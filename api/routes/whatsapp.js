const express = require('express');
const router = express.Router();
const botController = require('../controllers/whatsappBotController');

router.post('/webhook', botController.handleIncomingMessage);

module.exports = router;
