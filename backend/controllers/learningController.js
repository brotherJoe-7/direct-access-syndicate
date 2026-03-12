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
        const { title, description, content_link, level_target, material_type } = req.body;
        const created_by = req.user.name;

        if (!title || !level_target) {
            return res.status(400).json({ message: 'Title and target level are required' });
        }

        let finalContentLink = content_link || '';
        let finalMaterialType = material_type || 'link';
        let filePath = null;

        if (req.file) {
            // Convert buffer to base64 data URI (Vercel-compatible)
            const base64Data = req.file.buffer.toString('base64');
            finalContentLink = `data:${req.file.mimetype};base64,${base64Data}`;
            filePath = finalContentLink;
            if (!material_type) {
                if (req.file.mimetype.startsWith('video/')) finalMaterialType = 'local_video';
                else if (req.file.mimetype.startsWith('image/')) finalMaterialType = 'image';
                else finalMaterialType = 'document';
            }
        } else {
            if (!finalContentLink) {
                return res.status(400).json({ message: 'Either a file upload or a content link is required' });
            }
            if (finalContentLink.includes('youtube.com') || finalContentLink.includes('youtu.be')) {
                finalMaterialType = 'youtube';
            }
        }

        const { rows } = await pool.query(
            'INSERT INTO learning_materials (title, description, content_link, level_target, created_by, material_type, file_path) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, description || '', finalContentLink, level_target, created_by, finalMaterialType, filePath]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating learning material:', error);
        res.status(500).json({ message: 'Error creating learning material', detail: error.message });
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
