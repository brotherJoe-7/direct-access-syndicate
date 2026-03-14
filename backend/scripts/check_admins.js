const { createPool } = require('@vercel/postgres');
require('dotenv').config();

const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
});

async function checkAdmins() {
  try {
    const { rows } = await pool.query('SELECT id, username, role, password FROM admins');
    console.log('Admins in database:', JSON.stringify(rows, null, 2));
    
    // Check for specifically 'admin'
    const adminUser = rows.find(u => u.username === 'admin');
    if (!adminUser) {
      console.log('CRITICAL: No user with username "admin" found!');
    } else {
      console.log('Found "admin" user. Password hash starts with:', adminUser.password.substring(0, 10));
    }
  } catch (err) {
    console.error('Error checking admins:', err);
  } finally {
    process.exit();
  }
}

checkAdmins();
