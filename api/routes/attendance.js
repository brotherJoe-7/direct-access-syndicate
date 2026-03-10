// backend/routes/attendance.js
const express = require('express');
const router = express.Router();
const { getAttendance, markAttendance } = require('../controllers/attendanceController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Protected Routes
router.get('/', verifyToken, getAttendance);      // Admins see all, parents see theirs
router.post('/', verifyAdmin, markAttendance);    // Only admins can mark attendance

module.exports = router;
