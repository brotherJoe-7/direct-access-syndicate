const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const pool = require('../config/db');

async function migrate() {
    try {
        console.log('Starting migration...');
        
        // Add is_qualified to students table if not exists
        await pool.query(`
            ALTER TABLE students 
            ADD COLUMN IF NOT EXISTS is_qualified BOOLEAN DEFAULT FALSE
        `);
        console.log('Checked students.is_qualified column.');

        // Create learning_materials table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS learning_materials (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                type VARCHAR(100) NOT NULL,
                file_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Checked learning_materials table.');

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
