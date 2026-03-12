require('dotenv').config();
const { sql } = require('@vercel/postgres');

async function migrateAuditAndCommunity() {
    try {
        // 1. Create audit_logs table if it doesn't exist
        console.log('Creating audit_logs table...');
        await sql`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id SERIAL PRIMARY KEY,
                admin_id INTEGER,
                action TEXT NOT NULL,
                student_id INTEGER,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log('audit_logs table ready.');

        // 2. Add delete support for community posts (soft delete)
        console.log('Adding deleted column to community_posts...');
        await sql`
            ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;
        `;
        console.log('community_posts.deleted column added.');

        // 3. Migrate learning_materials to store files as base64
        console.log('Updating learning_materials file_path column to TEXT...');
        await sql`
            ALTER TABLE learning_materials ALTER COLUMN file_path TYPE TEXT;
        `;
        console.log('learning_materials.file_path is now TEXT.');

        // 4. Add content_link as TEXT too for large data URIs
        await sql`
            ALTER TABLE learning_materials ALTER COLUMN content_link TYPE TEXT;
        `;
        console.log('learning_materials.content_link is now TEXT.');

        console.log('All migrations complete!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error.message);
        process.exit(1);
    }
}

migrateAuditAndCommunity();
