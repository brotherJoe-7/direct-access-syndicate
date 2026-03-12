const express = require('express');
const router = express.Router();
const { getStaff, createStaffMember, deleteStaffMember } = require('../controllers/staffController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, verifyAdmin, getStaff);
router.post('/', verifyToken, verifyAdmin, createStaffMember);
router.delete('/:id', verifyToken, verifyAdmin, deleteStaffMember);

module.exports = router;
