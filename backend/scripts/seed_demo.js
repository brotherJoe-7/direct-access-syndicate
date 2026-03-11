const { createPool } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function seed() {
    if (!process.env.POSTGRES_URL) {
        console.error("No POSTGRES_URL found in env vars. Did you create backend/.env?");
        process.exit(1);
    }
    
    console.log('Connecting to Neon DB:', process.env.POSTGRES_URL);
    const pool = createPool({ connectionString: process.env.POSTGRES_URL });

    try {
        console.log('Seeding robust multi-child demo data for Parent Dashboard...');

        // 1. Ensure test parent exists
        const hashedPw = await bcrypt.hash('parent123', 10);
        await pool.query(`
            INSERT INTO parents (parent_name, email, password) 
            VALUES ($1, $2, $3)
            ON CONFLICT (email) DO NOTHING
        `, ['John Doe', 'parent@test.com', hashedPw]);

        const { rows: parentRows } = await pool.query('SELECT id FROM parents WHERE email = $1', ['parent@test.com']);
        const parentId = parentRows[0].id;

        // 2. Clear old test students for clean slate
        await pool.query('DELETE FROM parent_students WHERE parent_id = $1', [parentId]);

        // Re-insert parent password ensure it works
        await pool.query(`
            UPDATE parents SET password = $1 WHERE id = $2
        `, [hashedPw, parentId]);

        // 3. Create 3 distinct children
        const children = [
            { name: 'Alice Doe', level: 'JSS 1', code: 'DAS-2024-901' },
            { name: 'Bob Doe', level: 'SSS 2', code: 'DAS-2024-902' },
            { name: 'Charlie Doe', level: 'Primary 4', code: 'DAS-2024-903' }
        ];

        for (const child of children) {
            // We originally added 'reg_code' to the students table in schema_postgres.sql. Let's check it.
            await pool.query('DELETE FROM students WHERE student_name = $1', [child.name]);
            
            const { rows } = await pool.query(`
                INSERT INTO students (student_name, level, parent_name, contact, reg_code)
                VALUES ($1, $2, $3, $4, $5) RETURNING id
            `, [child.name, child.level, 'John Doe', '078003333', child.code]);
            
            const studentId = rows[0].id;

            // Link to parent in junction table
            await pool.query(`
                INSERT INTO parent_students (parent_id, student_id) VALUES ($1, $2)
                ON CONFLICT DO NOTHING
            `, [parentId, studentId]);

            // Add some receipts for each child
            for (let i = 1; i <= 2; i++) {
                await pool.query(`
                    INSERT INTO receipts (issue_date, parent_name, student_name, level, method, amount, receipt_no)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                `, [
                    new Date().toISOString(), 'John Doe', child.name, child.level, 'Cash', 1500000 * i, 
                    'DAS-' + Math.floor(100000 + Math.random() * 900000)
                ]);
            }

            // Add some attendance records for each child
            const statuses = ['Present', 'Absent', 'Present', 'Present'];
            for (let i = 0; i < 4; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                await pool.query(`
                    INSERT INTO attendance (student_id, date, status, recorded_by)
                    VALUES ($1, $2, $3, $4)
                `, [studentId, d.toISOString(), statuses[i], 'system']);
            }
        }

        console.log('Successfully seeded! Login with parent@test.com / parent123 to see 3 children, dynamic receipts, and attendance records.');

    } catch (err) {
        console.error('Seed failed:', err);
    } finally {
        process.exit();
    }
}

seed();
