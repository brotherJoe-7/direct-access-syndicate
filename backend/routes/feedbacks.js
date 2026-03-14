// backend/routes/feedbacks.js
const express = require('express');
const router = express.Router();
const { getFeedbacks, createFeedback } = require('../controllers/feedbacksController');
const { verifyToken, verifyAdminOrTeacher } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getFeedbacks);
router.post('/', verifyAdminOrTeacher, createFeedback);

module.exports = router;
