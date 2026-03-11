const express = require('express');
const router = express.Router();
const { getMaterials, createMaterial, deleteMaterial } = require('../controllers/learningController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getMaterials);
router.post('/', verifyAdmin, createMaterial);
router.delete('/:id', verifyAdmin, deleteMaterial);

module.exports = router;
