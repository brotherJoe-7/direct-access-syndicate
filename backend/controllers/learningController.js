const pool = require('../config/db');

const getMaterials = async (req, res) => {
    try {
        const { level } = req.query;
        let query = 'SELECT * FROM learning_materials';
        let params = [];

        if (level && level !== 'All') {
            query += ' WHERE level_target = $1 OR level_target = \'All\'';
            params.push(level);
        }
        
        query += ' ORDER BY created_at DESC';
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching learning materials:', error);
        res.status(500).json({ message: 'Error fetching learning materials' });
    }
};

const createMaterial = async (req, res) => {
    try {
        const { title, description, content_link, level_target } = req.body;
        const created_by = req.user.name;

        if (!title || !content_link || !level_target) {
            return res.status(400).json({ message: 'Title, content link, and target level are required' });
        }

        const { rows } = await pool.query(
            'INSERT INTO learning_materials (title, description, content_link, level_target, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, content_link, level_target, created_by]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating learning material:', error);
        res.status(500).json({ message: 'Error creating learning material' });
    }
};

const deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM learning_materials WHERE id = $1', [id]);
        res.json({ message: 'Material deleted successfully' });
    } catch (error) {
        console.error('Error deleting learning material:', error);
        res.status(500).json({ message: 'Error deleting material' });
    }
};

module.exports = {
    getMaterials,
    createMaterial,
    deleteMaterial
};
