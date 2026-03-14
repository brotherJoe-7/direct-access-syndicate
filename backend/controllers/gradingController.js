const pool = require('../config/db');

const getGradesByStudent = async (req, res) => {
    try {
        const { student_id } = req.params;
        let query = `
            SELECT g.*, s.student_name 
            FROM student_grades g 
            JOIN students s ON g.student_id = s.id 
        `;
        let params = [student_id];

        if (req.user.role === 'parent') {
            // Strictly enforce API ownership
            query += `
                JOIN parent_students ps ON s.id = ps.student_id 
                WHERE g.student_id = $1 AND ps.parent_id = $2
            `;
            params.push(req.user.id);
        } else {
            query += ` WHERE g.student_id = $1 `;
        }

        query += ` ORDER BY g.created_at DESC`;

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching student grades:', error);
        res.status(500).json({ message: 'Error fetching grades' });
    }
};

const postGrade = async (req, res) => {
    try {
        const { student_id, term, subject, score, remark } = req.body;
        
        if (!student_id || !term || !subject || score === undefined) {
             return res.status(400).json({ message: 'Missing required fields' });
        }

        // Simple grading logic
        let grade = 'F';
        if (score >= 90) grade = 'A+';
        else if (score >= 80) grade = 'A';
        else if (score >= 70) grade = 'B';
        else if (score >= 60) grade = 'C';
        else if (score >= 50) grade = 'D';

        const { rows } = await pool.query(
            'INSERT INTO student_grades (student_id, term, subject, score, grade, remarks) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [student_id, term, subject, score, grade, remark]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error posting grade:', error);
        res.status(500).json({ message: 'Error posting grade' });
    }
};

const deleteGrade = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM student_grades WHERE id = $1', [id]);
        res.json({ message: 'Grade deleted successfully' });
    } catch (error) {
        console.error('Error deleting grade:', error);
        res.status(500).json({ message: 'Error deleting grade' });
    }
};

module.exports = {
    getGradesByStudent,
    postGrade,
    deleteGrade
};
