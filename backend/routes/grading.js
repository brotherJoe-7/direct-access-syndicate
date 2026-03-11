const express = require('express');
const router = express.Router();
const { getGradesByStudent, postGrade, deleteGrade } = require('../controllers/gradingController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/:student_id', verifyToken, getGradesByStudent);
router.post('/', verifyAdmin, postGrade);
router.delete('/:id', verifyAdmin, deleteGrade);

module.exports = router;
