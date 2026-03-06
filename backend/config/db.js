// backend/config/db.js
const { createPool } = require('@vercel/postgres');

// Use the Vercel Postgres pool
const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
});

module.exports = pool;
