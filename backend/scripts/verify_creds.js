const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function verifyCredentials() {
  const testCases = [
    { username: 'admin', password: 'admin123' },
    { username: 'teacherjoe', password: 'joe123' }
  ];

  for (const test of testCases) {
    try {
      const { rows } = await pool.query('SELECT password FROM admins WHERE username = $1', [test.username]);
      if (rows.length === 0) {
        console.log(`User ${test.username} not found.`);
        continue;
      }
      const isMatch = await bcrypt.compare(test.password, rows[0].password);
      console.log(`User: ${test.username}, Password: ${test.password}, Match: ${isMatch}`);
    } catch (err) {
      console.error(`Error verifying ${test.username}:`, err);
    }
  }
  await pool.end();
}

verifyCredentials();
