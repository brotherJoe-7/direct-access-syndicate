const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { createPool } = require('@vercel/postgres');

async function migrate() {
    console.log('Connecting to Neon DB:', process.env.POSTGRES_URL);
    const pool = createPool({
        connectionString: process.env.POSTGRES_URL,
    });

    try {
        const schemaPath = path.join(__dirname, '../../schema_postgres_phase18.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('Running migration...');
        await pool.query(sql);
        console.log('Migration successful!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        process.exit();
    }
}
migrate();
