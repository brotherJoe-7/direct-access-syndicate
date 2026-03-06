const pool = require('../config/db');

const updateProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        const parentId = req.user.id;

        await pool.query('UPDATE parents SET profile_img = $1 WHERE id = $2', [imageUrl, parentId]);

        res.json({ message: 'Profile image updated successfully', profile_img: imageUrl });
    } catch (error) {
        console.error('Error updating profile image:', error);
        res.status(500).json({ message: 'Error updating profile image' });
    }
};

const getParentProfile = async (req, res) => {
    try {
        const parentId = req.user.id;
        const { rows } = await pool.query('SELECT id, parent_name, email, student_id, profile_img FROM parents WHERE id = $1', [parentId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching parent profile:', error);
        res.status(500).json({ message: 'Error fetching parent profile' });
    }
};

// Admin Functions
const getAllParents = async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT p.id, p.parent_name, p.email, p.student_id, p.profile_img, s.student_name 
            FROM parents p
            LEFT JOIN students s ON p.student_id = s.id
            ORDER BY p.id DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching all parents:', error);
        res.status(500).json({ message: 'Error fetching parents' });
    }
};

const updateParentAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { parent_name, email, student_id } = req.body;
        
        await pool.query(
            'UPDATE parents SET parent_name = $1, email = $2, student_id = $3 WHERE id = $4',
            [parent_name, email, student_id, id]
        );
        
        res.json({ message: 'Parent updated successfully' });
    } catch (error) {
        console.error('Error updating parent:', error);
        res.status(500).json({ message: 'Error updating parent' });
    }
};

const deleteParent = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM parents WHERE id = $1', [id]);
        res.json({ message: 'Parent deleted successfully' });
    } catch (error) {
        console.error('Error deleting parent:', error);
        res.status(500).json({ message: 'Error deleting parent' });
    }
};

module.exports = {
    updateProfileImage,
    getParentProfile,
    getAllParents,
    updateParentAdmin,
    deleteParent
};
