const express = require('express');
const router = express.Router();
const { chatWithAI, chatWithVisitor, generateAcademicAssistant } = require('../controllers/aiController');
const { verifyToken } = require('../middleware/authMiddleware');
const { sql } = require('@vercel/postgres');

// Postgres-backed rate limiter for the public visitor endpoint
// Allows 15 messages per IP address per hour
const visitorRateLimit = async (req, res, next) => {
    const LIMIT = 15;
    const WINDOW_MS = 60 * 60 * 1000; // 1 hour

    // Get real IP (Vercel forwards it in x-forwarded-for)
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    try {
        // Ensure the rate limit table exists
        await sql`
            CREATE TABLE IF NOT EXISTS visitor_rate_limits (
                ip TEXT NOT NULL,
                request_count INT DEFAULT 1,
                window_start BIGINT NOT NULL,
                PRIMARY KEY (ip)
            );
        `;

        // Clean up old windows first
        await sql`DELETE FROM visitor_rate_limits WHERE window_start < ${windowStart};`;

        // Upsert: insert new or increment existing count within the window
        const { rows } = await sql`
            INSERT INTO visitor_rate_limits (ip, request_count, window_start)
            VALUES (${ip}, 1, ${now})
            ON CONFLICT (ip) DO UPDATE
                SET request_count = visitor_rate_limits.request_count + 1
            RETURNING request_count;
        `;

        const count = rows[0]?.request_count || 1;

        if (count > LIMIT) {
            return res.status(429).json({
                message: `Too many messages. You have reached the limit of ${LIMIT} questions per hour. Please try again later.`
            });
        }

        // Set headers so the frontend can show remaining count
        res.setHeader('X-RateLimit-Limit', LIMIT);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, LIMIT - count));
        next();
    } catch (err) {
        // If rate limit check fails, don't block the user — just log it
        console.error('Rate limit check failed (allowing request):', err.message);
        next();
    }
};

router.post('/chat', verifyToken, chatWithAI);
router.post('/visitor', visitorRateLimit, chatWithVisitor); // Public with rate limit

module.exports = router;
