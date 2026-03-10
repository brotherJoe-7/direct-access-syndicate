const { Pool } = require('pg');

const isProduction = !!(process.env.POSTGRES_URL || process.env.DATABASE_URL);
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

const pool = new Pool(isProduction ? {
  connectionString,
  ssl: { rejectUnauthorized: false }
} : {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || ''),
  database: process.env.DB_NAME || 'das_receipts',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: false
});

module.exports = pool;
