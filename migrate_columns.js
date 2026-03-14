const fs = require('fs');
const path = require('path');

// Manually parse env file
const envPath = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) process.env[key.trim()] = value.trim().replace(/^"(.*)"$/, '$1');
    });
}

const pool = require('./backend/config/db');

async function migrate() {
    try {
        console.log('Starting migration: Expanding learning_materials columns to TEXT...');
        await pool.query('ALTER TABLE learning_materials ALTER COLUMN content_link TYPE TEXT');
        await pool.query('ALTER TABLE learning_materials ALTER COLUMN file_path TYPE TEXT');
        console.log('Migration SUCCESS: Columns expanded.');
        process.exit(0);
    } catch (err) {
        console.error('Migration FAILED:', err);
        process.exit(1);
    }
}

migrate();
