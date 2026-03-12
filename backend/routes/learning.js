const express = require('express');
const router = express.Router();
const multer = require('multer');

const { getMaterials, createMaterial, deleteMaterial } = require('../controllers/learningController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Use memory storage to avoid Vercel read-only filesystem crash
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', verifyToken, getMaterials);
router.post('/', verifyAdmin, upload.single('file'), createMaterial);
router.delete('/:id', verifyAdmin, deleteMaterial);

module.exports = router;
