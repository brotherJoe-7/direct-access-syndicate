// backend/controllers/expensesController.js
const pool = require('../config/db');

// Get all expenses (Admin only)
const getExpenses = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM expenses ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server error fetching expenses' });
  }
};

// Create a new expense (Admin only)
const createExpense = async (req, res) => {
  const { category, description, amount, paid_to } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO expenses (category, description, amount, paid_to) VALUES (?, ?, ?, ?)',
      [category, description, amount, paid_to]
    );

    res.status(201).json({ id: result.insertId, message: 'Expense recorded successfully' });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ message: 'Server error creating expense' });
  }
};

module.exports = { getExpenses, createExpense };
