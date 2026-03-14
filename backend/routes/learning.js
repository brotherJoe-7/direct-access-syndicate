const express = require('express');
const router = express.Router();
const multer = require('multer');

const { getMaterials, createMaterial, deleteMaterial, generateViewToken, viewSecure } = require('../controllers/learningController');
const { verifyToken, verifyAdminOrTeacher } = require('../middleware/authMiddleware');

// Use memory storage to avoid Vercel read-only filesystem crash
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', verifyToken, getMaterials);
router.post('/', verifyAdminOrTeacher, upload.single('file'), createMaterial);
router.delete('/:id', verifyAdminOrTeacher, deleteMaterial);

// Universal Doc Support
router.get('/view-token/:id', verifyToken, generateViewToken);
router.get('/view-secure/:id/:filename?', viewSecure); // Public guarded by token in controller

module.exports = router;
