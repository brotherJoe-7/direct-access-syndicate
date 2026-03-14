console.log('authController.js loading...');
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

// Twilio Config
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // Default sandbox number

const login = async (req, res) => {
  console.log('Login attempt for username:', req.body.username);
  const { username, password } = req.body;

  try {
    // 1. Check Admins table First
    const { rows: admins } = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (admins.length > 0) {
      const admin = admins[0];
      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        const userRole = admin.role || 'admin';
        
        // Check for JWT_SECRET
        if (!process.env.JWT_SECRET) {
          console.error('CRITICAL ERROR: JWT_SECRET is missing from environment variables.');
          return res.status(500).json({ 
            message: 'Server configuration error (Secret Missing)',
            details: 'Please ensure JWT_SECRET is set in Vercel settings.'
          });
        }

        // Create JWT Token
        const token = jwt.sign(
          { id: admin.id, role: userRole, name: admin.username },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );

        // Log the activity
        await pool.query(
          'INSERT INTO activity_logs (user_id, role, action, details) VALUES ($1, $2, $3, $4)',
          [admin.id, userRole, 'login', `${userRole} ${admin.username} logged in`]
        );

        return res.json({ token, role: userRole, user: { id: admin.id, name: admin.username } });
      }
    }

    // 2. If not admin, check Parents table (username = email in PHP code)
    const { rows: parents } = await pool.query('SELECT * FROM parents WHERE email = $1', [username]);
    if (parents.length > 0) {
      const parent = parents[0];
      const isMatch = await bcrypt.compare(password, parent.password);
      if (isMatch) {
         // Create JWT Token
         const token = jwt.sign(
          { id: parent.id, role: 'parent', name: parent.parent_name },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );

        // Log the activity
        await pool.query(
          'INSERT INTO activity_logs (user_id, role, action, details) VALUES ($1, $2, $3, $4)',
          [parent.id, 'parent', 'login', `Parent ${parent.parent_name} logged in`]
        );

        return res.json({ token, role: 'parent', user: { id: parent.id, name: parent.parent_name } });
      }
    }

    // If no match found or wrong password
    return res.status(401).json({ message: 'Invalid username/email or password' });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      message: 'Server error during login', 
      debug: error.message,
      stack: error.stack
    });
  }
};

const requestOTP = async (req, res) => {
  const { phone } = req.body; // Expecting format like "+232..." or "0..."
  if (!phone) return res.status(400).json({ message: 'Phone number is required' });

  try {
    // 1. Locate parent by phone
    // We try both exact match and prefix 0 vs +232
    let searchPhone = phone.trim();
    const { rows: parents } = await pool.query('SELECT id, parent_name FROM parents WHERE phone = $1 OR phone = $2', 
      [searchPhone, searchPhone.startsWith('0') ? '+232' + searchPhone.slice(1) : searchPhone]);

    if (parents.length === 0) {
      return res.status(404).json({ message: 'No registered parent found with this phone number.' });
    }

    const parent = parents[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // 2. Save OTP to DB
    await pool.query('UPDATE parents SET otp_code = $1, otp_expiry = $2 WHERE id = $3', [otp, expiry, parent.id]);

    // 3. Send via Twilio
    const toPhone = searchPhone.startsWith('whatsapp:') ? searchPhone : `whatsapp:${searchPhone}`;
    
    await client.messages.create({
      body: `🛡️ *Direct Access Syndicate Security Code*\n\nYour login code is: *${otp}*\n\nThis code expires in 5 minutes. Do not share it with anyone.`,
      from: TWILIO_WHATSAPP_NUMBER,
      to: toPhone
    });

    res.json({ message: 'OTP sent successfully to WhatsApp' });
  } catch (error) {
    console.error('OTP Request Error:', error);
    res.status(500).json({ message: 'Failed to send OTP. Please check if Twilio is configured.' });
  }
};

const verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ message: 'Phone and OTP are required' });

  try {
    let searchPhone = phone.trim();
    const { rows: parents } = await pool.query(
      'SELECT id, parent_name, otp_code, otp_expiry FROM parents WHERE (phone = $1 OR phone = $2) AND otp_code = $3',
      [searchPhone, searchPhone.startsWith('0') ? '+232' + searchPhone.slice(1) : searchPhone, otp]
    );

    if (parents.length === 0) {
      return res.status(401).json({ message: 'Invalid or expired OTP code' });
    }

    const parent = parents[0];
    if (new Date() > new Date(parent.otp_expiry)) {
       return res.status(401).json({ message: 'OTP code has expired' });
    }

    // Success - Clear OTP and generate JWT
    await pool.query('UPDATE parents SET otp_code = NULL WHERE id = $1', [parent.id]);

    const token = jwt.sign(
      { id: parent.id, role: 'parent', name: parent.parent_name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Activity Log
    await pool.query(
      'INSERT INTO activity_logs (user_id, role, action, details) VALUES ($1, $2, $3, $4)',
      [parent.id, 'parent', 'login_otp', `Parent ${parent.parent_name} logged in via WhatsApp OTP`]
    );

    res.json({ token, role: 'parent', user: { id: parent.id, name: parent.parent_name } });
  } catch (error) {
    console.error('OTP Verify Error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
};

module.exports = { login, requestOTP, verifyOTP };
