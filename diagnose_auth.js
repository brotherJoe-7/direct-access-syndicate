const { createPool } = require('@vercel/postgres');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

async function diagnose() {
    console.log('Diagnostic Start...');
    console.log('ENv file checked at:', path.join(__dirname, 'backend', '.env'));
    
    const pool = createPool({
        connectionString: process.env.POSTGRES_URL
    });

    try {
        const { rows: admins } = await pool.query('SELECT id, username, role FROM admins');
        console.log('Found Admins:', admins);
        
        if (admins.length === 0) {
            console.log('WARNING: No admins found in the database!');
        } else {
            const admin = admins.find(a => a.username === 'admin');
            if (!admin) {
                console.log('WARNING: User "admin" not found in admins list.');
            } else {
                console.log('OK: User "admin" exists.');
            }
        }

        const { rows: tables } = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('Available Tables:', tables.map(t => t.table_name));

    } catch (err) {
        console.error('DIAGNOSTIC FAILED:', err);
    } finally {
        await pool.end();
        console.log('Diagnostic Complete.');
    }
}

diagnose();
