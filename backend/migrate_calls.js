require('dotenv').config();
const { sql } = require('@vercel/postgres');

async function migrateCalls() {
    try {
        console.log('Creating active_calls table...');
        await sql`
            CREATE TABLE IF NOT EXISTS active_calls (
                id SERIAL PRIMARY KEY,
                caller_name VARCHAR(255) NOT NULL,
                caller_role VARCHAR(50) NOT NULL,
                room_name VARCHAR(100) UNIQUE NOT NULL,
                call_type VARCHAR(20) DEFAULT 'video',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 hour')
            );
        `;
        console.log('Successfully created active_calls table.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateCalls();
