// backend/controllers/studentsController.js
const pool = require('../config/db');

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students ORDER BY student_name ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error fetching students' });
  }
};

// Create a new student (Admin only)
const createStudent = async (req, res) => {
  const { student_name, level, parent_name, contact } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO students (student_name, level, parent_name, contact, registered_at) VALUES (?, ?, ?, ?, NOW())',
      [student_name, level, parent_name, contact]
    );

    // Log action
    await pool.execute(
      'INSERT INTO activity_logs (user_id, role, action, student_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'admin', 'register_student', result.insertId, `Registered student ${student_name}`]
    );

    res.status(201).json({ id: result.insertId, message: 'Student registered successfully' });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ message: 'Server error registering student' });
  }
};

// Delete student (Admin only)
const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM students WHERE id = ?', [id]);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error deleting student' });
  }
};

// Parent self-enrolls a student
const enrollStudent = async (req, res) => {
  const { student_name, level, contact } = req.body;
  const parent_name = req.user.name; // extracted from JWT token

  try {
    const [result] = await pool.execute(
      'INSERT INTO students (student_name, level, parent_name, contact, registered_at) VALUES (?, ?, ?, ?, NOW())',
      [student_name, level, parent_name, contact]
    );

    // Update the parent's student_id if it's their first child (optional schema fix)
    await pool.execute('UPDATE parents SET student_id = ? WHERE id = ? AND student_id IS NULL', [result.insertId, req.user.id]);

    await pool.execute(
      'INSERT INTO activity_logs (user_id, role, action, student_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'parent', 'enroll_student', result.insertId, `Parent enrolled student ${student_name}`]
    );

    res.status(201).json({ id: result.insertId, message: 'Student enrolled successfully' });
  } catch (error) {
    console.error('Error enrolling student:', error);
    res.status(500).json({ message: 'Server error enrolling student' });
  }
};

// Public application endpoint (No Auth)
const applyStudent = async (req, res) => {
  const { student_name, level, parent_name, contact } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO students (student_name, level, parent_name, contact, registered_at) VALUES (?, ?, ?, ?, NOW())',
      [student_name, level, parent_name, contact]
    );

    // Normally we'd log this, but there's no user_id to attribute it to easily without a generic "System" user.

    res.status(201).json({ id: result.insertId, message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error with public application:', error);
    res.status(500).json({ message: 'Server error processing application' });
  }
};

module.exports = { getAllStudents, createStudent, deleteStudent, enrollStudent, applyStudent };
