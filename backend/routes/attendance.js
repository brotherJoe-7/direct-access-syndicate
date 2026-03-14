// backend/routes/attendance.js
const express = require('express');
const router = express.Router();
const { getAttendance, markAttendance } = require('../controllers/attendanceController');
const { verifyToken, verifyAdminOrTeacher } = require('../middleware/authMiddleware');

// Protected Routes
router.get('/', verifyToken, getAttendance);      // Admins see all, parents see theirs
router.post('/', verifyAdminOrTeacher, markAttendance);    // Admins and teachers can mark attendance

module.exports = router;
