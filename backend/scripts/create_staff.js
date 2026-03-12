const { createPool } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function createStaff(username, password, role = 'teacher') {
    console.log(`Connecting to Neon DB to create ${role}: ${username}...`);
    const pool = createPool({
        connectionString: process.env.POSTGRES_URL
    });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user already exists
        const { rows } = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
        if (rows.length > 0) {
            console.log(`User ${username} already exists. Updating role to ${role} and resetting password...`);
            await pool.query(
                'UPDATE admins SET password = $1, role = $2 WHERE username = $3',
                [hashedPassword, role, username]
            );
        } else {
            console.log(`Creating new ${role} account...`);
            await pool.query(
                `INSERT INTO admins (username, password, role) VALUES ($1, $2, $3)`,
                [username, hashedPassword, role]
            );
            console.log(`Successfully created ${role}: ${username} / ${password}`);
        }
    } catch (err) {
        console.error('Failed to create staff account:', err);
    } finally {
        await pool.end();
        console.log('Done.');
    }
}

// EDIT THESE VALUES TO CREATE YOUR STAFF
createStaff('teacherjoe', 'joe123', 'teacher');
// createStaff('admin_secondary', 'admin-pass', 'admin'); 
