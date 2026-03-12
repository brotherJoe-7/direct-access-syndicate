const express = require('express');
const router = express.Router();
const { chatWithAI, chatWithVisitor } = require('../controllers/aiController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/chat', verifyToken, chatWithAI);
router.post('/visitor', chatWithVisitor); // Public - no auth required

module.exports = router;
