const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    updateProfileImage,
    getParentProfile,
    getMyChildren,
    linkStudentByCode,
    getAllParents,
    updateParentAdmin,
    deleteParent,
    createParent
} = require('../controllers/parentsController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Multer Storage Configuration
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
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed (jpeg, jpg, png, webp)'));
    }
});

// Parent Routes
router.get('/profile', verifyToken, getParentProfile);
router.post('/profile/image', verifyToken, upload.single('profile_image'), updateProfileImage);
router.get('/children', verifyToken, getMyChildren);
router.post('/children/link', verifyToken, linkStudentByCode);

// Admin Routes
router.post('/', verifyAdmin, createParent);
router.get('/all', verifyAdmin, getAllParents);
router.put('/:id', verifyAdmin, updateParentAdmin);
router.delete('/:id', verifyAdmin, deleteParent);

module.exports = router;
