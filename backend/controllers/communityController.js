const pool = require('../config/db');

const getPosts = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM community_posts ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching community posts:', error);
        res.status(500).json({ message: 'Error fetching community posts' });
    }
};

const createPost = async (req, res) => {
    try {
        const { message } = req.body;
        const author_name = req.user.name;
        const author_role = req.user.role;

        if (!message || message.trim() === '') {
            return res.status(400).json({ message: 'Message content is required' });
        }

        const { rows } = await pool.query(
            'INSERT INTO community_posts (author_name, author_role, message) VALUES ($1, $2, $3) RETURNING *',
            [author_name, author_role, message]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating community post:', error);
        res.status(500).json({ message: 'Error creating community post' });
    }
};

module.exports = {
    getPosts,
    createPost
};
