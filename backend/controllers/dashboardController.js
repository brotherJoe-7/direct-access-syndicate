// backend/controllers/dashboardController.js
const pool = require('../config/db');

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      // Admin calculations
      const { rows: incomeRows } = await pool.query('SELECT SUM(amount) AS total FROM receipts');
      const { rows: expensesRows } = await pool.query('SELECT SUM(amount) AS total FROM expenses');
      
      const totalIncome = parseFloat(incomeRows[0]?.total || 0);
      const totalExpenses = parseFloat(expensesRows[0]?.total || 0);
      const totalSavings = totalIncome - totalExpenses;

      // Breakdown by level
      const { rows: levels } = await pool.query('SELECT level, SUM(amount) AS total FROM receipts GROUP BY level');
      
      // Monthly Revenue for current year
      const { rows: monthlyRevenueRows } = await pool.query(`
          SELECT TO_CHAR(issue_date, 'Mon') as month, SUM(amount) as total 
          FROM receipts 
          WHERE EXTRACT(YEAR FROM issue_date) = EXTRACT(YEAR FROM CURRENT_DATE)
          GROUP BY TO_CHAR(issue_date, 'Mon'), EXTRACT(MONTH FROM issue_date)
          ORDER BY EXTRACT(MONTH FROM issue_date)
      `);

      // Annual Revenue
      const { rows: annualRevenueRows } = await pool.query(`
          SELECT SUM(amount) as total 
          FROM receipts 
          WHERE EXTRACT(YEAR FROM issue_date) = EXTRACT(YEAR FROM CURRENT_DATE)
      `);
      const annualRevenue = parseFloat(annualRevenueRows[0]?.total || 0);

      // Activity Logs
      const { rows: activityLogs } = await pool.query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 10');

      return res.json({
        totalIncome,
        totalExpenses,
        totalSavings,
        annualRevenue,
        monthlyRevenue: monthlyRevenueRows.map(r => ({ name: r.month, value: parseFloat(r.total) })),
        monthlyByLevel: levels,
        activityLogs
      });
    } else {
      // Parent calculations
      const { rows: receiptRows } = await pool.query('SELECT COUNT(*) AS cnt FROM receipts WHERE parent_name = $1', [req.user.name]);

      const { rows: attendanceRows } = await pool.query(`
        SELECT SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) AS present,
               SUM(CASE WHEN a.status='Absent' THEN 1 ELSE 0 END) AS absent
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        JOIN parents p ON p.student_id = s.id
        WHERE p.id = $1
      `, [req.user.id]);

      const { rows: childrenAttendance } = await pool.query(`
        SELECT s.student_name,
               SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) AS present,
               SUM(CASE WHEN a.status='Absent' THEN 1 ELSE 0 END) AS absent
        FROM students s
        LEFT JOIN attendance a ON s.id = a.student_id
        JOIN parents p ON p.student_id = s.id
        WHERE p.id = $1
        GROUP BY s.id, s.student_name
      `, [req.user.id]);

      return res.json({
        receiptCount: parseInt(receiptRows[0]?.cnt || 0),
        totalAttendance: attendanceRows[0] || { present: 0, absent: 0 },
        childrenAttendance
      });
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};

module.exports = { getDashboardStats };
