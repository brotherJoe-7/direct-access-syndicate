const { createPool } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
});

async function verifyLogin() {
  const username = 'admin';
  const passwordToTest = 'admin'; // Testing common password

  try {
    const { rows } = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (rows.length === 0) {
       console.log('User admin not found');
       return;
    }
    
    const admin = rows[0];
    const isMatch = await bcrypt.compare(passwordToTest, admin.password);
    console.log(`Login test for "admin" / "${passwordToTest}": ${isMatch ? 'SUCCESS' : 'FAILURE'}`);
    
    const passwordToTest2 = 'admin123';
    const isMatch2 = await bcrypt.compare(passwordToTest2, admin.password);
    console.log(`Login test for "admin" / "${passwordToTest2}": ${isMatch2 ? 'SUCCESS' : 'FAILURE'}`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

verifyLogin();
