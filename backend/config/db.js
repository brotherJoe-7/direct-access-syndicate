// backend/config/db.js
const { createPool } = require('@vercel/postgres');

const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
});

module.exports = pool;
