// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const studentsRoutes = require('./routes/students');
const receiptsRoutes = require('./routes/receipts');
const attendanceRoutes = require('./routes/attendance');
const expensesRoutes = require('./routes/expenses');
const dashboardRoutes = require('./routes/dashboard');
const feedbacksRoutes = require('./routes/feedbacks');
const whatsappRoutes = require('./routes/whatsapp');
const parentsRoutes = require('./routes/parents');
const learningRoutes = require('./routes/learning');
const path = require('path');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/receipts', receiptsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/feedbacks', feedbacksRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/parents', parentsRoutes);
app.use('/api/learning', learningRoutes);

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Direct Access Syndicate Management API' });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
