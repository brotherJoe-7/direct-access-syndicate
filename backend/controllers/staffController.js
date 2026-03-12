const pool = require('../config/db');
const bcrypt = require('bcrypt');

const getStaff = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, username, role, created_at FROM admins ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ message: 'Error fetching staff' });
    }
};

const createStaffMember = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        
        if (!username || !password || !role) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const { rows } = await pool.query(
            'INSERT INTO admins (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
            [username, hashedPassword, role]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating staff member:', error);
        res.status(500).json({ message: 'Error creating staff member' });
    }
};

const deleteStaffMember = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Prevent deleting the main admin if necessary, or just allow it with caution
        // For now, let's just allow it
        await pool.query('DELETE FROM admins WHERE id = $1', [id]);
        res.json({ message: 'Staff member deleted' });
    } catch (error) {
        console.error('Error deleting staff member:', error);
        res.status(500).json({ message: 'Error deleting staff member' });
    }
};

module.exports = {
    getStaff,
    createStaffMember,
    deleteStaffMember
};
