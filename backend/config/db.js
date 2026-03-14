// backend/config/db.js
const { createPool } = require('@vercel/postgres');

let pool;
try {
  if (!process.env.POSTGRES_URL) {
    console.warn('WARNING: POSTGRES_URL is not defined. Database will be unavailable.');
  }
  pool = createPool({
    connectionString: process.env.POSTGRES_URL,
  });
} catch (error) {
  console.error('DATABASE INITIALIZATION ERROR:', error.message);
  // Create a mock pool that throws descriptive errors when used
  pool = {
    query: () => {
      throw new Error('Database is uninitialized. Check Vercel Environment Variables (POSTGRES_URL).');
    }
  };
}

module.exports = pool;
