// backend/controllers/studentsController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM students ORDER BY student_name ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error fetching students' });
  }
};

// Helper: Generate a readable password
function generatePassword(name) {
  const cleanName = name.replace(/\s+/g, '').slice(0, 4).toUpperCase();
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `DAS${cleanName}${digits}`;
}

// Create a new student (Admin only) — Auto-creates parent account
const createStudent = async (req, res) => {
  const { student_name, level, parent_name, contact } = req.body;
  
  let generatedCredentials = null;

  try {
    // 1. Register the student
    const { rows } = await pool.query(
      'INSERT INTO students (student_name, level, parent_name, contact, registered_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id',
      [student_name, level, parent_name, contact]
    );
    const studentId = rows[0].id;

    // 2. Auto-create parent account if email/contact doesn't already exist
    const existingParent = await pool.query(
      'SELECT id FROM parents WHERE email = $1',
      [contact]
    );

    if (existingParent.rows.length === 0) {
      // Generate credentials
      const rawPassword = generatePassword(parent_name);
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      await pool.query(
        'INSERT INTO parents (parent_name, email, password, student_id) VALUES ($1, $2, $3, $4)',
        [parent_name, contact, hashedPassword, studentId]
      );

      generatedCredentials = {
        email: contact,
        password: rawPassword,
        message: `Parent account created for ${parent_name}`
      };
    } else {
      // Update existing parent's student_id if not set
      await pool.query(
        'UPDATE parents SET student_id = $1 WHERE email = $2 AND student_id IS NULL',
        [studentId, contact]
      );
      generatedCredentials = {
        email: contact,
        message: 'Parent account already exists. Password unchanged.'
      };
    }

    // 3. Log action
    await pool.query(
      'INSERT INTO activity_logs (user_id, role, action, student_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'admin', 'register_student', studentId, `Registered student ${student_name}`]
    );

    res.status(201).json({
      id: studentId,
      message: 'Student registered successfully',
      parentCredentials: generatedCredentials
    });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ message: 'Server error registering student' });
  }
};

// Delete student (Admin only)
const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM students WHERE id = $1', [id]);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error deleting student' });
  }
};

// Parent self-enrolls a student
const enrollStudent = async (req, res) => {
  const { student_name, level, contact } = req.body;
  const parent_name = req.user.name;

  try {
    const { rows } = await pool.query(
      'INSERT INTO students (student_name, level, parent_name, contact, registered_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id',
      [student_name, level, parent_name, contact]
    );
    const studentId = rows[0].id;

    await pool.query('UPDATE parents SET student_id = $1 WHERE id = $2 AND student_id IS NULL', [studentId, req.user.id]);

    await pool.query(
      'INSERT INTO activity_logs (user_id, role, action, student_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'parent', 'enroll_student', studentId, `Parent enrolled student ${student_name}`]
    );

    res.status(201).json({ id: studentId, message: 'Student enrolled successfully' });
  } catch (error) {
    console.error('Error enrolling student:', error);
    res.status(500).json({ message: 'Server error enrolling student' });
  }
};

// Public application endpoint (No Auth)
const applyStudent = async (req, res) => {
  const { student_name, level, parent_name, contact } = req.body;

  try {
    const { rows } = await pool.query(
      'INSERT INTO students (student_name, level, parent_name, contact, registered_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id',
      [student_name, level, parent_name, contact]
    );

    res.status(201).json({ id: rows[0].id, message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error with public application:', error);
    res.status(500).json({ message: 'Server error processing application' });
  }
};

module.exports = { getAllStudents, createStudent, deleteStudent, enrollStudent, applyStudent };
