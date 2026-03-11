// backend/controllers/receiptsController.js
const pool = require('../config/db');

// Get all receipts (admin) OR parent's receipts
const getReceipts = async (req, res) => {
  try {
    let query = 'SELECT * FROM receipts ORDER BY issue_date DESC';
    let params = [];

    if (req.user.role === 'parent') {
      // Parents can only see receipts associated with their name
      query = 'SELECT * FROM receipts WHERE parent_name = $1 ORDER BY issue_date DESC';
      params = [req.user.name];
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
