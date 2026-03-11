const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const fs = require('fs');

console.log('DB URL provided:', process.env.POSTGRES_URL ? 'YES' : 'NO');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function runMigration() {
    try {
        console.log('Connecting to Vercel Postgres...');
        const schemaPath = path.join(__dirname, '..', 'schema_postgres_phase17.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('Executing Phase 17 Schema...');
        await pool.query(sql);
        console.log('Phase 17 Schema executed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
}

runMigration();
