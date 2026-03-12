const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkCommunity() {
  try {
    console.log('Checking community_posts table...');
    const { rows } = await pool.query('SELECT * FROM community_posts');
    console.log(`Found ${rows.length} posts.`);
    if (rows.length > 0) {
        console.log('Sample post:', rows[0]);
    }
  } catch (error) {
    console.error('Database Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkCommunity();
