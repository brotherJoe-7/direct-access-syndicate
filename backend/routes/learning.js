const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { getMaterials, createMaterial, deleteMaterial } = require('../controllers/learningController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

const uploadDir = path.join(__dirname, '../uploads/learning');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `learning_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

router.get('/', verifyToken, getMaterials);
router.post('/', verifyAdmin, upload.single('file'), createMaterial);
router.delete('/:id', verifyAdmin, deleteMaterial);

module.exports = router;
