const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkAdmin() {
  try {
    const res = await pool.query('SELECT username, role, password FROM admins');
    console.log('Admins in table:');
    res.rows.forEach(row => {
      console.log(`Username: ${row.username}, Role: ${row.role}, Password Hash exists: ${!!row.password}`);
    });
  } catch (err) {
    console.error('Error querying database:', err);
  } finally {
    await pool.end();
  }
}

checkAdmin();
