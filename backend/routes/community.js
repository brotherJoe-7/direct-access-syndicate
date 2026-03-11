const express = require('express');
const router = express.Router();
const { getPosts, createPost } = require('../controllers/communityController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getPosts);
router.post('/', verifyToken, createPost);

module.exports = router;
