const { createPool } = require('@vercel/postgres');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function runMigration() {
    const pool = createPool({
        connectionString: process.env.POSTGRES_URL
    });

    try {
        console.log('Starting migration: Adding phone and OTP columns to parents table...');
        
        // 1. Add phone column if not exists
        await pool.query(`
            ALTER TABLE parents 
            ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
            ADD COLUMN IF NOT EXISTS otp_code VARCHAR(10),
            ADD COLUMN IF NOT EXISTS otp_expiry TIMESTAMP;
        `);
        
        console.log('Migration successful: Columns added.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
}

runMigration();
