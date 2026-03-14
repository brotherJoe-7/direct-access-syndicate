// backend/controllers/feedbacksController.js
const pool = require('../config/db');

// Get feedbacks for a student (Parents can view their child's feedback)
const getFeedbacks = async (req, res) => {
  try {
    let query = `
      SELECT f.*, a.username as teacher_name, s.student_name 
      FROM student_feedbacks f
      JOIN admins a ON f.teacher_id = a.id
      JOIN students s ON f.student_id = s.id
    `;
    let params = [];

    // If parent, strict IDOR check via parent_students
    if (req.user.role === 'parent') {
      query = `
        SELECT f.*, a.username as teacher_name, s.student_name 
        FROM student_feedbacks f
        JOIN admins a ON f.teacher_id = a.id
        JOIN students s ON f.student_id = s.id
        JOIN parent_students ps ON s.id = ps.student_id
        WHERE ps.parent_id = $1
        ORDER BY f.created_at DESC
      `;
      params = [req.user.id];
    } else {
      query += ' ORDER BY f.created_at DESC';
    }

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Server error fetching feedbacks' });
  }
};

// Create a new feedback (Teacher/Admin only)
const createFeedback = async (req, res) => {
  const { student_id, subject, feedback_text, credibility_score } = req.body;
  const teacher_id = req.user.id; // From admin JWT

  if (!student_id || !subject || !feedback_text || credibility_score === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO student_feedbacks (student_id, teacher_id, subject, feedback_text, credibility_score) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [student_id, teacher_id, subject, feedback_text, credibility_score]
    );

    await pool.query(
      'INSERT INTO activity_logs (user_id, role, action, details) VALUES ($1, $2, $3, $4)',
      [teacher_id, 'admin', 'create_feedback', `Admin left feedback for student ID ${student_id}`]
    );

    res.status(201).json({ id: rows[0].id, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ message: 'Server error adding feedback' });
  }
};

module.exports = { getFeedbacks, createFeedback };
