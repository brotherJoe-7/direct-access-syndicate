const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  try {
    console.log('Adding file columns to community_posts...');
    await pool.query('ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS file_url VARCHAR(500)');
    await pool.query('ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS file_type VARCHAR(50)');
    console.log('Migration successful.');
  } catch (error) {
    console.error('Migration failed:', error.message);
  } finally {
    await pool.end();
  }
}

migrate();
