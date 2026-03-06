// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protected Routes
router.get('/', verifyToken, getDashboardStats);

module.exports = router;
