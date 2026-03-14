// backend/controllers/receiptsController.js
const pool = require('../config/db');

// Get all receipts (admin) OR parent's receipts
const getReceipts = async (req, res) => {
  try {
    let query = 'SELECT * FROM receipts ORDER BY issue_date DESC';
    let params = [];

    if (req.user.role === 'parent') {
      // Parents can only see receipts for their mapped students
      const { rows: children } = await pool.query('SELECT student_id FROM parent_students WHERE parent_id = $1', [req.user.id]);
      if (children.length === 0) return res.json([]);
      
      const childIds = children.map(c => c.student_id);
      query = `
        SELECT r.* 
        FROM receipts r
        JOIN students s ON r.student_name = s.student_name
        WHERE s.id = ANY($1) 
        ORDER BY r.issue_date DESC`;
      params = [childIds];
    }

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching receipts:', error);
    res.status(500).json({ message: 'Server error fetching receipts' });
  }
};

// Create a new receipt (Admin only)
const createReceipt = async (req, res) => {
  const { issue_date, parent_name, student_name, level, method, amount } = req.body;
  const receipt_no = 'DAS-' + Math.floor(100000 + Math.random() * 900000);

  try {
    const { rows } = await pool.query(
      'INSERT INTO receipts (issue_date, parent_name, student_name, level, method, amount, receipt_no) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [issue_date, parent_name, student_name, level, method, amount, receipt_no]
    );

    res.status(201).json({ id: rows[0].id, receipt_no, message: 'Receipt created successfully' });
  } catch (error) {
    console.error('Error creating receipt:', error);
    res.status(500).json({ message: 'Server error creating receipt' });
  }
};

module.exports = { getReceipts, createReceipt };
