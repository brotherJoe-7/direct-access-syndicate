// backend/controllers/dashboardController.js
const pool = require('../config/db');

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      // Admin calculations
      const [[incomeResult]] = await pool.query('SELECT SUM(amount) AS total FROM receipts');
      const [[expensesResult]] = await pool.query('SELECT SUM(amount) AS total FROM expenses');
      
      const totalIncome = incomeResult.total || 0;
      const totalExpenses = expensesResult.total || 0;
      const totalSavings = totalIncome - totalExpenses;

      // Breakdown by level
      const [levels] = await pool.query('SELECT level, SUM(amount) AS total FROM receipts GROUP BY level');
      
      // Activity Logs
      const [activityLogs] = await pool.query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 10');

      return res.json({
        totalIncome,
        totalExpenses,
        totalSavings,
        monthlyByLevel: levels,
        activityLogs
      });
    } else {
      // Parent calculations
      const [[receiptCount]] = await pool.query('SELECT COUNT(*) AS cnt FROM receipts WHERE parent_name = ?', [req.user.name]);

      const [attendance] = await pool.query(`
        SELECT SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) AS present,
               SUM(CASE WHEN a.status='Absent' THEN 1 ELSE 0 END) AS absent
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        JOIN parents p ON p.student_id = s.id
        WHERE p.id = ?
      `, [req.user.id]);

      const [childrenAttendance] = await pool.query(`
        SELECT s.student_name,
               SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) AS present,
               SUM(CASE WHEN a.status='Absent' THEN 1 ELSE 0 END) AS absent
        FROM students s
        LEFT JOIN attendance a ON s.id = a.student_id
        JOIN parents p ON p.student_id = s.id
        WHERE p.id = ?
        GROUP BY s.id, s.student_name
      `, [req.user.id]);

      return res.json({
        receiptCount: receiptCount.cnt,
        totalAttendance: attendance[0] || { present: 0, absent: 0 },
        childrenAttendance
      });
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};

module.exports = { getDashboardStats };
