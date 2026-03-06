const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const runSeed = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        // Create Database and Use
        await connection.query('CREATE DATABASE IF NOT EXISTS das_receipts');
        await connection.query('USE das_receipts');

        // Create Tables
        const tables = [
            `CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'admin'
            )`,
            `CREATE TABLE IF NOT EXISTS students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_name VARCHAR(255) NOT NULL,
                level VARCHAR(100) NOT NULL,
                parent_name VARCHAR(255) NOT NULL,
                contact VARCHAR(100),
                registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS parents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                parent_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                student_id INT
            )`,
            `CREATE TABLE IF NOT EXISTS receipts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                issue_date DATE NOT NULL,
                parent_name VARCHAR(255) NOT NULL,
                student_name VARCHAR(255) NOT NULL,
                level VARCHAR(100) NOT NULL,
                method VARCHAR(100) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                receipt_no VARCHAR(100) UNIQUE NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS attendance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                date DATE NOT NULL,
                status VARCHAR(50) NOT NULL,
                recorded_by VARCHAR(255)
            )`,
            `CREATE TABLE IF NOT EXISTS expenses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(255) NOT NULL,
                description TEXT,
                amount DECIMAL(10,2) NOT NULL,
                paid_to VARCHAR(255) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS activity_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                role VARCHAR(50) NOT NULL,
                action VARCHAR(255) NOT NULL,
                details TEXT,
                student_id INT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS audit_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                admin_id INT NOT NULL,
                action VARCHAR(255) NOT NULL,
                student_id INT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )`
        ];

        for (const sql of tables) {
            await connection.query(sql);
        }
        
        // Seed Data
        const adminPass = await bcrypt.hash('admin123', 10);
        await connection.query('INSERT IGNORE INTO admins (id, username, password, role) VALUES (1, "admin", ?, "admin")', [adminPass]);

        const parentPass = await bcrypt.hash('parent123', 10);
        await connection.query('INSERT IGNORE INTO parents (id, parent_name, email, password, student_id) VALUES (1, "John Doe", "parent@test.com", ?, 1)', [parentPass]);

        await connection.query('INSERT IGNORE INTO students (id, student_name, level, parent_name, contact) VALUES (1, "Jane Doe", "Primary", "John Doe", "123456789")');

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

runSeed();
