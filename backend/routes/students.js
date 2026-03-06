// backend/routes/students.js
const express = require('express');
const router = express.Router();
const { getAllStudents, createStudent, deleteStudent, enrollStudent, applyStudent } = require('../controllers/studentsController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Public Routes
router.post('/apply', applyStudent); // Open to internet

// Protected Routes
router.get('/', verifyToken, getAllStudents);
router.post('/', verifyAdmin, createStudent);
router.post('/enroll', verifyToken, enrollStudent); // parents can use this
router.delete('/:id', verifyAdmin, deleteStudent);

module.exports = router;
