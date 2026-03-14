// backend/controllers/attendanceController.js
const pool = require('../config/db');

// Get attendance history
const getAttendance = async (req, res) => {
  try {
    let query = `
      SELECT a.id, s.student_name, a.date, a.status, a.recorded_by 
      FROM attendance a
      JOIN students s ON a.student_id = s.id
    `;
    let params = [];

    if (req.user.role === 'parent') {
      // Find parent's children STRICTLY from parent_students table
      const { rows: children } = await pool.query('SELECT student_id FROM parent_students WHERE parent_id = $1', [req.user.id]);
      if (children.length === 0) {
         return res.json([]); 
      }
      
      const childIds = children.map(c => c.student_id);
      query += ` WHERE a.student_id = ANY($1) `;
      params = [childIds];
    }
    
    query += ' ORDER BY a.date DESC';

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Server error fetching attendance' });
  }
};

// Mark attendance (Admin only)
const markAttendance = async (req, res) => {
  const { student_id, date, status } = req.body;
  const recorded_by = req.user.name;

  try {
    const { rows } = await pool.query(
      'INSERT INTO attendance (student_id, date, status, recorded_by) VALUES ($1, $2, $3, $4) RETURNING id',
      [student_id, date, status, recorded_by]
    );

    // Log action
    await pool.query(
      'INSERT INTO audit_logs (admin_id, action, student_id) VALUES ($1, $2, $3)',
      [req.user.id, 'mark_attendance', student_id]
    );

    res.status(201).json({ id: rows[0].id, message: 'Attendance marked' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error marking attendance' });
  }
};

module.exports = { getAttendance, markAttendance };
