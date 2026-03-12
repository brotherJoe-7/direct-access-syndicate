const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getPosts, createPost } = require('../controllers/communityController');
const { verifyToken } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|webm|mp4|mp3|wav|m4a|ogg/;
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

// Soft-delete a community post (only the author can delete their own post)
router.delete('/:id', verifyToken, async (req, res) => {
    const { sql } = require('@vercel/postgres');
    try {
        const { id } = req.params;
        const userName = req.user.name;
        // Verify the post belongs to the current user
        const { rows } = await sql`
            UPDATE community_posts 
            SET deleted = true 
            WHERE id = ${id} AND author_name = ${userName}
            RETURNING id;
        `;
        if (rows.length === 0) {
            return res.status(403).json({ message: 'Not authorized to delete this message' });
        }
        res.json({ message: 'Message deleted' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ message: 'Error deleting message' });
    }
});

module.exports = router;
