const express = require('express');
const router = express.Router();
const { sql } = require('@vercel/postgres');
const { verifyToken } = require('../middleware/authMiddleware');

// Start a new call (Video or Audio)
router.post('/start', verifyToken, async (req, res) => {
    try {
        const { room_name, call_type } = req.body;
        const caller_name = req.user.name;
        const caller_role = req.user.role;

        if (!room_name) {
            return res.status(400).json({ message: 'room_name is required' });
        }

        const { rows } = await sql`
            INSERT INTO active_calls (caller_name, caller_role, room_name, call_type) 
            VALUES (${caller_name}, ${caller_role}, ${room_name}, ${call_type || 'video'})
            RETURNING *;
        `;
        
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error starting call:', error);
        res.status(500).json({ message: 'Error starting call', detail: error.message });
    }
});

// Poll for active calls (created in the last 60 seconds)
router.get('/active', verifyToken, async (req, res) => {
    try {
        // Fetch calls that are less than 60 seconds old to simulate "ringing"
        const { rows } = await sql`
            SELECT id, caller_name, caller_role, room_name, call_type, created_at 
            FROM active_calls 
            WHERE created_at > (CURRENT_TIMESTAMP - INTERVAL '60 seconds')
            ORDER BY created_at DESC
            LIMIT 1;
        `;
        
        if (rows.length > 0) {
            res.json(rows[0]); // Return the most recent ringing call
        } else {
            res.json(null); // No active calls ringing
        }
    } catch (error) {
        console.error('Error fetching active calls:', error);
        res.status(500).json({ message: 'Error fetching active calls' });
    }
});

module.exports = router;
