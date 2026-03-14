const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// Manual parse .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim().replace(/(^"|"$)/g, '');
        }
    });
}

async function diagnose() {
    console.log('--- Auth Diagnosis ---');
    console.log('DB URL Present:', !!process.env.POSTGRES_URL);
    
    // Convert Vercel URL to standard PG format if needed (postgres://... instead of postgresql://...)
    // However, the standard Pool usually handles both.
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const { rows: admins } = await pool.query('SELECT id, username, role, password FROM admins');
        console.log('Admins found:', admins.length);
        admins.forEach(a => {
            console.log(`- ID: ${a.id}, User: ${a.username}, Role: ${a.role}, PassHashStart: ${a.password.substring(0, 10)}...`);
        });

        // Test bcrypt comparison locally for 'admin' / 'admin123'
        const bcrypt = require('bcryptjs');
        const adminUser = admins.find(a => a.username === 'admin');
        if (adminUser) {
            const isMatch = await bcrypt.compare('admin123', adminUser.password);
            console.log(`Bcrypt check ('admin123'): ${isMatch ? 'PASSED' : 'FAILED'}`);
        }

    } catch (err) {
        console.error('Diagnosis ERROR:', err.message);
    } finally {
        await pool.end();
        console.log('--- Diagnosis End ---');
    }
}

diagnose();
