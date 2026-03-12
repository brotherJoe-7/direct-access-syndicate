const { createPool } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function seedAll() {
    console.log('Connecting to Neon DB for FULL SEEDING...');
    const pool = createPool({
        connectionString: process.env.POSTGRES_URL
    });

    try {
        const saltRounds = 10;

        // 1. Seed Admin
        const adminHash = await bcrypt.hash('admin123', saltRounds);
        await pool.query(
            'INSERT INTO admins (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO UPDATE SET password = $2, role = $3',
            ['admin', adminHash, 'admin']
        );
        console.log('Admin seeded: admin / admin123');

        // 2. Seed Teacher
        const teacherHash = await bcrypt.hash('joe123', saltRounds);
        await pool.query(
            'INSERT INTO admins (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO UPDATE SET password = $2, role = $3',
            ['teacherjoe', teacherHash, 'teacher']
        );
        console.log('Teacher seeded: teacherjoe / joe123');

        // 3. Seed Student
        const studentRes = await pool.query(
            "INSERT INTO students (id, student_name, level, parent_name, contact, reg_code) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET student_name = $2 RETURNING id",
            [1, 'Jane Doe', 'Primary 1', 'John Doe', '0123456789', 'REG001']
        );
        const studentId = studentRes.rows[0].id;
        console.log('Student seeded: Jane Doe');

        // 4. Seed Parent
        const parentHash = await bcrypt.hash('parent123', saltRounds);
        const parentRes = await pool.query(
            "INSERT INTO parents (parent_name, email, password, student_id) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET password = $3 RETURNING id",
            ['John Doe', 'parent@test.com', parentHash, studentId]
        );
        const parentId = parentRes.rows[0].id;
        console.log('Parent seeded: parent@test.com / parent123');

        // 5. Map Parent to Student
        await pool.query(
            "INSERT INTO parent_students (parent_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [parentId, studentId]
        );
        console.log('Parent-Student mapping completed.');

        console.log('--- ALL SEEDING COMPLETED SUCCESSFULLY ---');
    } catch (err) {
        console.error('Failed to seed database:', err);
    } finally {
        await pool.end();
    }
}

seedAll();
