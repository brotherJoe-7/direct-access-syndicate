// backend/controllers/receiptsController.js
const pool = require('../config/db');

// Get all receipts (admin) OR parent's receipts
const getReceipts = async (req, res) => {
  try {
    let query = 'SELECT * FROM receipts ORDER BY issue_date DESC';
    let params = [];

    if (req.user.role === 'parent') {
      // Parents can only see receipts associated with their name
      // This matches the logic from the PHP `dashboard.php`
      query = 'SELECT * FROM receipts WHERE parent_name = ? ORDER BY issue_date DESC';
      params = [req.user.name];
    }

    const [rows] = await pool.query(query, params);
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
    const [result] = await pool.execute(
      'INSERT INTO receipts (issue_date, parent_name, student_name, level, method, amount, receipt_no) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [issue_date, parent_name, student_name, level, method, amount, receipt_no]
    );

    res.status(201).json({ id: result.insertId, receipt_no, message: 'Receipt created successfully' });
  } catch (error) {
    console.error('Error creating receipt:', error);
    res.status(500).json({ message: 'Server error creating receipt' });
  }
};

module.exports = { getReceipts, createReceipt };
