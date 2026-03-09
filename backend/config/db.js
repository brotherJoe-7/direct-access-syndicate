const { Pool } = require('pg');
require('dotenv').config();

const isProduction = !!process.env.POSTGRES_URL;

const pool = new Pool(isProduction ? {
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
} : {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || ''),
  database: process.env.DB_NAME || 'das_receipts',
  port: 5432,
  ssl: false
});

module.exports = pool;
