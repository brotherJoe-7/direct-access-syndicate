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
        const userId = req.user.id;

        // Message is optional if a file is uploaded
        if ((!message || message.trim() === '') && !req.file) {
            return res.status(400).json({ message: 'Message content or file is required' });
        }

        let parent_id = null;
        let admin_id = null;

        if (author_role === 'parent') {
            parent_id = userId;
        } else {
            admin_id = userId;
        }

        const file_url = req.file ? `/uploads/${req.file.filename}` : null;
        let file_type = null;
        if (req.file) {
            file_type = req.file.mimetype.startsWith('image/') ? 'image' : 'audio';
        }

        const { rows } = await pool.query(
            'INSERT INTO community_posts (author_name, author_role, message, parent_id, admin_id, file_url, file_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [author_name, author_role, message || '', parent_id, admin_id, file_url, file_type]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating community post:', error);
        res.status(500).json({ message: 'Error creating community post', detail: error.message });
    }
};

module.exports = {
    getPosts,
    createPost
};
