require('dotenv').config();
const { sql } = require('@vercel/postgres');

async function migrate() {
    try {
        await sql`ALTER TABLE community_posts ALTER COLUMN file_url TYPE TEXT;`;
        console.log('Column altered to TEXT successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
