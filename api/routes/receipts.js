// backend/routes/receipts.js
const express = require('express');
const router = express.Router();
const { getReceipts, createReceipt } = require('../controllers/receiptsController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Protected Routes
router.get('/', verifyToken, getReceipts);       // Admins see all, parents see theirs
router.post('/', verifyAdmin, createReceipt);    // Only admins can create

module.exports = router;
