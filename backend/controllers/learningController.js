const pool = require('../config/db');
const jwt = require('jsonwebtoken');

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
            
            // Auto-detect type only if not explicitly provided
            if (!material_type) {
                if (req.file.mimetype.startsWith('video/')) finalMaterialType = 'local_video';
                else if (req.file.mimetype.startsWith('image/')) finalMaterialType = 'image';
                else finalMaterialType = 'document';
            } else {
                finalMaterialType = material_type;
            }
        } else {
            if (!finalContentLink) {
                return res.status(400).json({ message: 'Either a file upload or a content link is required' });
            }
            // Auto-detect YouTube if type not provided
            if (!material_type && (finalContentLink.includes('youtube.com') || finalContentLink.includes('youtu.be'))) {
                finalMaterialType = 'youtube';
            }
        }

        const { rows } = await pool.query(
            'INSERT INTO learning_materials (title, description, content_link, level_target, created_by, material_type, file_path) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, description || '', finalContentLink, level_target, created_by, finalMaterialType, filePath]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('SERVER ERROR [createMaterial]:', {
            message: error.message,
            stack: error.stack,
            body: req.body,
            file: req.file ? { size: req.file.size, type: req.file.mimetype } : 'none'
        });
        res.status(500).json({ 
            message: 'Error creating learning material', 
            detail: error.message,
            hint: 'If you are uploading a file, ensure it is small (under 4MB) for serverless stability.' 
        });
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

const generateViewToken = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT id FROM learning_materials WHERE id = $1', [id]);
        
        if (rows.length === 0) return res.status(404).json({ message: 'Material not found' });
        
        const viewToken = jwt.sign(
            { materialId: id, purpose: 'view_secure' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Increased to 1h for Microsoft viewer latency
        );
        
        res.json({ viewToken });
    } catch (error) {
        console.error('Error generating view token:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const viewSecure = async (req, res) => {
    try {
        const { id, filename } = req.params;
        const { token } = req.query;
        const userAgent = req.headers['user-agent'] || 'Unknown';

        console.log(`[SecureView] Request for ID: ${id}, Filename: ${filename}, UA: ${userAgent}`);

        if (!token) return res.status(401).send('Access Denied: No Token');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (String(decoded.materialId) !== String(id) || decoded.purpose !== 'view_secure') {
            return res.status(401).send('Access Denied: Invalid Token');
        }

        const { rows } = await pool.query('SELECT content_link, title FROM learning_materials WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).send('Not Found');

        const material = rows[0];
        const displayName = filename || material.title || 'document';
        
        if (material.content_link.startsWith('data:')) {
            // High-performance string splitting (much faster than regex for large files on Vercel)
            const parts = material.content_link.split(',');
            if (parts.length < 2) return res.status(400).send('Malformed Data URI');
            
            const header = parts[0];
            const base64Data = parts[1];
            
            const typeMatch = header.match(/data:(.*?);/);
            const type = typeMatch ? typeMatch[1] : 'application/octet-stream';
            const buffer = Buffer.from(base64Data, 'base64');

            res.set('Content-Type', type);
            res.set('Content-Length', buffer.length);
            res.set('Content-Disposition', `inline; filename="${displayName}"`);
            res.set('Cache-Control', 'public, max-age=3600'); 
            
            console.log(`[SecureView] Served optimized Data URI. Type: ${type}, Size: ${buffer.length} bytes`);
            return res.send(buffer);
        }

        // If it's a direct link, redirect but try to ensure it's absolute if it's an /uploads/ path
        let targetUrl = material.content_link;
        if (targetUrl.startsWith('/uploads/')) {
            const protocol = req.headers['x-forwarded-proto'] || req.protocol;
            const host = req.get('host');
            targetUrl = `${protocol}://${host}${targetUrl}`;
        }

        console.log(`[SecureView] Redirecting to: ${targetUrl}`);
        res.redirect(targetUrl);
    } catch (error) {
        console.error('Secure View Error:', error);
        res.status(401).send('Session Expired or Invalid');
    }
};

module.exports = {
    getMaterials,
    createMaterial,
    deleteMaterial,
    generateViewToken,
    viewSecure
};
