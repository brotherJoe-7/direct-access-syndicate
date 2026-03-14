const { createPool } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
});

async function resetPassword() {
  const username = 'admin';
  const newPassword = 'admin123';

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const result = await pool.query(
      'UPDATE admins SET password = $1 WHERE username = $2 RETURNING id',
      [hashedPassword, username]
    );
    
    if (result.rowCount === 0) {
      console.log('User admin not found for update');
    } else {
      console.log(`Password reset successfully for "admin" to "${newPassword}"`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

resetPassword();
