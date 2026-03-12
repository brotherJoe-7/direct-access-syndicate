const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getPosts, createPost } = require('../controllers/communityController');
const { verifyToken } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|mp3|wav|m4a|ogg/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images and audio files are allowed!'));
    }
});

router.get('/', verifyToken, getPosts);
router.post('/', verifyToken, upload.single('file'), createPost);

module.exports = router;
