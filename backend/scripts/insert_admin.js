const { createPool } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function createAdmin() {
    console.log('Connecting to Neon DB...');
    const pool = createPool({
        connectionString: process.env.POSTGRES_URL
    });

    try {
        const username = 'admin';
        const password = 'admin123'; // Standard fallback, user can change later if needed or already changed in local
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if admin already exists
        const { rows } = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
        if (rows.length > 0) {
            console.log('Admin user already exists. ID:', rows[0].id);
            
            // Optionally update the password if it's failing
            await pool.query('UPDATE admins SET password = $1 WHERE username = $2', [hashedPassword, username]);
            console.log('Updated existing admin password to: password123');
        } else {
            console.log('Creating new admin user...');
            await pool.query(
                `INSERT INTO admins (username, password) VALUES ($1, $2)`,
                [username, hashedPassword]
            );
            console.log('Successfully created default admin user: admin / password123');
        }
    } catch (err) {
        console.error('Failed to create admin:', err);
    } finally {
        await pool.end();
        console.log('Done.');
    }
}

createAdmin();
