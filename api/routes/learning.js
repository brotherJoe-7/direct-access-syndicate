const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Get all learning materials
router.get('/materials', verifyToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM learning_materials ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new material (Admin only)
router.post('/materials', [verifyToken, verifyAdmin], async (req, res) => {
    const { title, description, type, file_url } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO learning_materials (title, description, type, file_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, type, file_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Qualify a student (Admin only)
router.put('/students/:id/qualify', [verifyToken, verifyAdmin], async (req, res) => {
    const { is_qualified } = req.body;
    try {
        await pool.query('UPDATE students SET is_qualified = $1 WHERE id = $2', [is_qualified, req.params.id]);
        res.json({ message: 'Student qualification status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
