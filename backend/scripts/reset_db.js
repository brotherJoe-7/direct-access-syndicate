const { createPool } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function resetDatabase() {
    console.log('Connecting to Neon DB for FULL RESET...');
    const pool = createPool({
        connectionString: process.env.POSTGRES_URL
    });

    try {
        const sqlPath = path.join(__dirname, '../../schema_complete.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        console.log('Executing full schema reset (DROP and CREATE)...');
        // Split by semicolon to run multiple statements if needed, 
        // though pool.query usually handles multi-statement strings for Postgres.
        await pool.query(sql);
        console.log('Database reset successfully with consolidated schema!');
        console.log('Default Admin: admin / admin123');
    } catch (err) {
        console.error('Failed to reset database:', err);
    } finally {
        await pool.end();
    }
}

resetDatabase();
