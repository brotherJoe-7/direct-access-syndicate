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
      // Find parent's children
      const [children] = await pool.query('SELECT student_id FROM parents WHERE id = ?', [req.user.id]);
      if (children.length === 0) {
         return res.json([]); 
      }
      
      const childIds = children.map(c => c.student_id);
      query += ` WHERE a.student_id IN (?) `;
      // Note: we'd ideally use IN operator with array, simplified for this example
      params = [childIds];
    }
    
    query += ' ORDER BY a.date DESC';

    const [rows] = await pool.query(query, params);
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
    const [result] = await pool.execute(
      'INSERT INTO attendance (student_id, date, status, recorded_by) VALUES (?, ?, ?, ?)',
      [student_id, date, status, recorded_by]
    );

    // Log action
    await pool.execute(
      'INSERT INTO audit_logs (admin_id, action, student_id) VALUES (?, ?, ?)',
      [req.user.id, 'mark_attendance', student_id]
    );

    res.status(201).json({ id: result.insertId, message: 'Attendance marked' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error marking attendance' });
  }
};

module.exports = { getAttendance, markAttendance };
