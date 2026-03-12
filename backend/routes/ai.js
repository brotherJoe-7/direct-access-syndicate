const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/aiController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/chat', verifyToken, chatWithAI);

module.exports = router;
