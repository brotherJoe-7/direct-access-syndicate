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
    { type: 'Admin', username: 'admin', password: 'admin123', table: 'admins', field: 'username' },
    { type: 'Teacher', username: 'teacherjoe', password: 'joe123', table: 'admins', field: 'username' },
    { type: 'Parent', username: 'parent@test.com', password: 'parent123', table: 'parents', field: 'email' }
  ];

  console.log('--- Credential Verification ---');
  for (const test of testCases) {
    try {
      const { rows } = await pool.query(`SELECT password FROM ${test.table} WHERE ${test.field} = $1`, [test.username]);
      if (rows.length === 0) {
        console.log(`[FAIL] User ${test.username} (${test.type}) NOT FOUND in ${test.table}.`);
        continue;
      }
      const isMatch = await bcrypt.compare(test.password, rows[0].password);
      console.log(`[${isMatch ? 'PASS' : 'FAIL'}] ${test.type}: ${test.username}, Matches: ${isMatch}`);
    } catch (err) {
      console.error(`[ERROR] Verifying ${test.username}:`, err.message);
    }
  }
  await pool.end();
}

verifyCredentials();
