const { login, requestOTP, verifyOTP } = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/request-otp
router.post('/request-otp', requestOTP);

// POST /api/auth/verify-otp
router.post('/verify-otp', verifyOTP);

module.exports = router;
