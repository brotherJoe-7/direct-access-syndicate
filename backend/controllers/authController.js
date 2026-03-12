// backend/controllers/authController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Check Admins table First
    const { rows: admins } = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (admins.length > 0) {
      const admin = admins[0];
      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        const userRole = admin.role || 'admin';
        
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
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { login };
