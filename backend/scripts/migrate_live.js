const { createPool } = require('@vercel/postgres');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function migrateDatabase() {
    console.log('Connecting to Neon DB for SAFE MIGRATION...');
    const pool = createPool({
        connectionString: process.env.POSTGRES_URL
    });

    try {
        console.log('Adding missing columns to admins...');
        await pool.query('ALTER TABLE admins ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT \'admin\'');
        
        console.log('Adding missing columns to community_posts...');
        await pool.query('ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS parent_id INT REFERENCES parents(id) ON DELETE SET NULL');
        await pool.query('ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS admin_id INT REFERENCES admins(id) ON DELETE SET NULL');
        await pool.query('ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS file_url VARCHAR(500)');
        await pool.query('ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS file_type VARCHAR(50)');
        
        console.log('Migration completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
}

migrateDatabase();
