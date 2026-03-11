// backend/routes/expenses.js
const express = require('express');
const router = express.Router();
const { getExpenses, createExpense } = require('../controllers/expensesController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Protected Routes
router.get('/', verifyAdmin, getExpenses);       
router.post('/', verifyAdmin, createExpense);

module.exports = router;
