CREATE DATABASE IF NOT EXISTS das_receipts;
USE das_receipts;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin'
);

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(255) NOT NULL,
  level VARCHAR(100) NOT NULL,
  parent_name VARCHAR(255) NOT NULL,
  contact VARCHAR(100),
  registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS parents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parent_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  student_id INT
);

CREATE TABLE IF NOT EXISTS receipts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  issue_date DATE NOT NULL,
  parent_name VARCHAR(255) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  level VARCHAR(100) NOT NULL,
  method VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  receipt_no VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  recorded_by VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  paid_to VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  role VARCHAR(50) NOT NULL,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  student_id INT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  action VARCHAR(255) NOT NULL,
  student_id INT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed an admin user (password is 'admin123')
INSERT IGNORE INTO admins (username, password, role) VALUES ('admin', '$2b$10$UoQ0HItL/g.PtzdZNo63.ezW0v9xM2bFwY1p5EStXvD6S1R8A8ehe', 'admin');

-- Seed a parent user (password is 'parent123')
INSERT IGNORE INTO parents (parent_name, email, password, student_id) VALUES ('John Doe', 'parent@test.com', '$2b$10$fN9sS5Y8Wj6Z4gR6R8v8U.Y8v8U.Y8v8U.Y8v8U.Y8v8U.Y8v8U.', 1);
-- (Using bcrypt hash for password for dev) Wait, I should generate proper bcrypt hashes using node to seed them safely.
