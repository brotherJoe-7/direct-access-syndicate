const { createPool } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function runMigration() {
    console.log('Connecting to Neon DB for Phase 19 migration...');
    const pool = createPool({
        connectionString: process.env.POSTGRES_URL
    });

    try {
        const sqlPath = path.join(__dirname, '../../schema_postgres_phase19.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        console.log('Executing migration...');
        await pool.query(sql);
        console.log('Phase 19 Migration applied successfully!');
    } catch (err) {
        console.error('Failed to apply migration:', err);
    } finally {
        await pool.end();
    }
}

runMigration();
