// backend/controllers/studentsController.js
const pool = require('../config/db');

// Helper: generate unique student registration code
const generateRegCode = async () => {
  const year = new Date().getFullYear();
  const prefix = `DAS-${year}-`;
  const { rows } = await pool.query(
    `SELECT reg_code FROM students WHERE reg_code LIKE $1 ORDER BY id DESC LIMIT 1`,
    [`${prefix}%`]
  );
  if (rows.length === 0) {
    return `${prefix}001`;
  }
  const lastNum = parseInt(rows[0].reg_code.split('-')[2], 10);
  const nextNum = String(lastNum + 1).padStart(3, '0');
  return `${prefix}${nextNum}`;
};

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

// Create a new student (Admin only) - auto-generates reg_code
const createStudent = async (req, res) => {
  const { student_name, level, parent_name, contact, subjects_enrolled, total_fees_assessed } = req.body;
  try {
    const reg_code = await generateRegCode();

    const { rows } = await pool.query(
      'INSERT INTO students (student_name, level, parent_name, contact, reg_code, registered_at, subjects_enrolled, total_fees_assessed) VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7) RETURNING id',
      [student_name, level, parent_name, contact, reg_code, JSON.stringify(subjects_enrolled || []), total_fees_assessed || 0]
    );
    const studentId = rows[0].id;

    await pool.query(
      'INSERT INTO activity_logs (user_id, role, action, details) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'admin', 'register_student', `Registered student ${student_name} (${reg_code})`]
    );

    res.status(201).json({ id: studentId, reg_code, message: 'Student registered successfully' });
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

// Update student (Admin only)
const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { student_name, level, parent_name, contact } = req.body;
  try {
    await pool.query(
      'UPDATE students SET student_name = $1, level = $2, parent_name = $3, contact = $4 WHERE id = $5',
      [student_name, level, parent_name, contact, id]
    );
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Server error updating student' });
  }
};

// Parent self-enrolls a student
const enrollStudent = async (req, res) => {
  const { student_name, level, contact } = req.body;
  const parent_name = req.user.name;

  try {
    const reg_code = await generateRegCode();

    const { rows } = await pool.query(
      'INSERT INTO students (student_name, level, parent_name, contact, reg_code, registered_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id',
      [student_name, level, parent_name, contact, reg_code]
    );
    const studentId = rows[0].id;

    await pool.query('UPDATE parents SET student_id = $1 WHERE id = $2 AND student_id IS NULL', [studentId, req.user.id]);

    await pool.query(
      'INSERT INTO activity_logs (user_id, role, action, details) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'parent', 'enroll_student', `Parent enrolled student ${student_name}`]
    );

    res.status(201).json({ id: studentId, reg_code, message: 'Student enrolled successfully' });
  } catch (error) {
    console.error('Error enrolling student:', error);
    res.status(500).json({ message: 'Server error enrolling student' });
  }
};

// Public application endpoint (No Auth)
const applyStudent = async (req, res) => {
  const { student_name, level, parent_name, contact, subjects_enrolled, total_fees_assessed } = req.body;

  try {
    const reg_code = await generateRegCode();

    const { rows } = await pool.query(
      'INSERT INTO students (student_name, level, parent_name, contact, reg_code, registered_at, subjects_enrolled, total_fees_assessed) VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7) RETURNING id',
      [student_name, level, parent_name, contact, reg_code, JSON.stringify(subjects_enrolled || []), total_fees_assessed || 0]
    );

    res.status(201).json({ id: rows[0].id, reg_code, message: 'Application submitted successfully. Your registration code is: ' + reg_code });
  } catch (error) {
    console.error('Error with public application:', error);
    res.status(500).json({ message: 'Server error processing application' });
  }
};

module.exports = { getAllStudents, createStudent, deleteStudent, updateStudent, enrollStudent, applyStudent };
