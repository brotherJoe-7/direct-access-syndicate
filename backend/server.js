// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('Created uploads directory');
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check (Top Level, No Dependencies)
app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      env: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
      time: new Date().toISOString()
    });
});

console.log('Server initializing...');

// Fail-safe initialization
try {
    console.log('Registering routes...');
    
    // Lazy-load routes within the app.use to prevent top-level requirement crashes from taking down the whole app
    app.use('/api/auth', (req, res, next) => require('./routes/auth')(req, res, next));
    app.use('/api/students', (req, res, next) => require('./routes/students')(req, res, next));
    app.use('/api/receipts', (req, res, next) => require('./routes/receipts')(req, res, next));
    app.use('/api/attendance', (req, res, next) => require('./routes/attendance')(req, res, next));
    app.use('/api/expenses', (req, res, next) => require('./routes/expenses')(req, res, next));
    app.use('/api/dashboard', (req, res, next) => require('./routes/dashboard')(req, res, next));
    app.use('/api/feedbacks', (req, res, next) => require('./routes/feedbacks')(req, res, next));
    app.use('/api/whatsapp', (req, res, next) => require('./routes/whatsapp')(req, res, next));
    app.use('/api/parents', (req, res, next) => require('./routes/parents')(req, res, next));
    app.use('/api/community', (req, res, next) => require('./routes/community')(req, res, next));
    app.use('/api/learning', (req, res, next) => require('./routes/learning')(req, res, next));
    app.use('/api/grades', (req, res, next) => require('./routes/grading')(req, res, next));
    app.use('/api/staff', (req, res, next) => require('./routes/staff')(req, res, next));
    app.use('/api/ai', (req, res, next) => require('./routes/ai')(req, res, next));
    
    console.log('Router registration complete.');
} catch (error) {
    console.error('SERVER INITIALIZATION ERROR:', error.message);
    app.all('/api/(.*)', (req, res) => {
        res.status(500).json({
            error: 'Server failed to initialize',
            message: error.message,
            stack: error.stack
        });
    });
}

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Direct Access Syndicate API' });
});

app.get('/api/', (req, res) => {
  res.json({ message: 'Express API is running' });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
