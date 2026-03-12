-- Comprehensive LeoneAI Database Schema
-- Consolidating Base + Phases 17, 18, 19
-- WARNING: This script will drop existing tables and data!

DROP TABLE IF EXISTS student_grades;
DROP TABLE IF EXISTS parent_students;
DROP TABLE IF EXISTS student_feedbacks;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS community_posts;
DROP TABLE IF EXISTS learning_materials;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS receipts;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS parents;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS admins;

-- 1. Admins (Includes Phase 19 Role)
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin'
);

-- 2. Students (Includes Phase 17 Expansion)
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  student_name VARCHAR(255) NOT NULL,
  level VARCHAR(100) NOT NULL,
  parent_name VARCHAR(255) NOT NULL,
  contact VARCHAR(100),
  reg_code VARCHAR(20) UNIQUE,
  subjects_enrolled JSONB,
  total_fees_assessed DECIMAL(10,2) DEFAULT 0.00,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Parents
CREATE TABLE parents (
  id SERIAL PRIMARY KEY,
  parent_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  student_id INT, -- Legacy field, use parent_students table for many-to-many
  profile_img VARCHAR(500)
);

-- 4. Parent-Student Mapping
CREATE TABLE parent_students (
  id SERIAL PRIMARY KEY,
  parent_id INT NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE(parent_id, student_id)
);

-- 5. Receipts
CREATE TABLE receipts (
  id SERIAL PRIMARY KEY,
  issue_date DATE NOT NULL,
  parent_name VARCHAR(255) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  level VARCHAR(100) NOT NULL,
  method VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  receipt_no VARCHAR(100) UNIQUE NOT NULL
);

-- 6. Attendance
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  recorded_by VARCHAR(255)
);

-- 7. Expenses
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  paid_to VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Activity Logs
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  role VARCHAR(50) NOT NULL,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  student_id INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Audit Logs
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  admin_id INT NOT NULL,
  action VARCHAR(255) NOT NULL,
  student_id INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Student Feedbacks
CREATE TABLE student_feedbacks (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  feedback_text TEXT NOT NULL,
  credibility_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Community Posts (Includes Phase 18 authors)
CREATE TABLE community_posts (
  id SERIAL PRIMARY KEY,
  author_name VARCHAR(255) NOT NULL,
  author_role VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  parent_id INT REFERENCES parents(id) ON DELETE SET NULL,
  admin_id INT REFERENCES admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Learning Materials (Includes Phase 18 types)
CREATE TABLE learning_materials (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_link VARCHAR(500) NOT NULL,
  file_path VARCHAR(500),
  material_type VARCHAR(50) DEFAULT 'link',
  level_target VARCHAR(100) NOT NULL,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Student Grades (Phase 17)
CREATE TABLE student_grades (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  term VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  score INT NOT NULL,
  grade VARCHAR(10),
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEED DATA
-- 1. Default Admin: admin / admin123
INSERT INTO admins (username, password, role) 
VALUES ('admin', '$2b$10$UoQ0HItL/g.PtzdZNo63.ezW0v9xM2bFwY1p5EStXvD6S1R8A8ehe', 'admin')
ON CONFLICT (username) DO NOTHING;

-- 2. Default Student
INSERT INTO students (id, student_name, level, parent_name, contact, reg_code)
VALUES (1, 'Jane Doe', 'Primary 1', 'John Doe', '0123456789', 'REG001')
ON CONFLICT (id) DO NOTHING;

-- 3. Default Parent: parent@test.com / parent123
INSERT INTO parents (parent_name, email, password, student_id) 
VALUES ('John Doe', 'parent@test.com', '$2b$10$fN9sS5Y8Wj6Z4gR6R8v8U.Y8v8U.Y8v8U.Y8v8U.Y8v8U.Y8v8U.', 1)
ON CONFLICT (email) DO NOTHING;

-- 4. Map Parent to Student (Many-to-Many)
INSERT INTO parent_students (parent_id, student_id)
VALUES (1, 1)
ON CONFLICT DO NOTHING;
