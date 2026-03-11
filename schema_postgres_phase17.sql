-- Phase 17 Schema Expansion for DAS Receipt Generator

CREATE TABLE IF NOT EXISTS community_posts (
  id SERIAL PRIMARY KEY,
  author_name VARCHAR(255) NOT NULL,
  author_role VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS learning_materials (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_link VARCHAR(500) NOT NULL,
  level_target VARCHAR(100) NOT NULL,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_grades (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  term VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  score INT NOT NULL,
  grade VARCHAR(10),
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alter Students table for dynamic registration fees
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS subjects_enrolled JSONB,
ADD COLUMN IF NOT EXISTS total_fees_assessed DECIMAL(10,2) DEFAULT 0.00;
