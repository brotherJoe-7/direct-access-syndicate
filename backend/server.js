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
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
    cors: {
        origin: "*", // Adjust this in production
        methods: ["GET", "POST"]
    }
});

// Store io in global to access from controllers
global.io = io;

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    socket.on('join_parent_room', (parentId) => {
        socket.join(`parent_${parentId}`);
        console.log(`Socket ${socket.id} joined room parent_${parentId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});


// Middleware
app.use(cors());
app.use(express.json());

// Health Check (Top Level, No Dependencies)
app.get('/api/health', async (req, res) => {
    let dbStatus = 'testing';
    try {
        const pool = require('./config/db');
        await pool.query('SELECT 1');
        dbStatus = 'connected';
    } catch (e) {
        dbStatus = 'error: ' + e.message;
    }

    res.json({ 
      status: 'ok', 
      database: dbStatus,
      env: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
      time: new Date().toISOString()
    });
});

// Environment Audit (Sanitized)
app.get('/api/audit', (req, res) => {
    const vars = [
        'POSTGRES_URL',
        'JWT_SECRET',
        'TWILIO_ACCOUNT_SID',
        'TWILIO_AUTH_TOKEN',
        'TWILIO_WHATSAPP_NUMBER'
    ];
    
    const report = {};
    vars.forEach(v => {
        const val = process.env[v];
        report[v] = val ? `Set (Length: ${val.length})` : 'MISSING';
    });

    res.json({
        message: 'Environment Audit Results',
        timestamp: new Date().toISOString(),
        results: report
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
    app.use('/api/calls', (req, res, next) => require('./routes/calls')(req, res, next));
    
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
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
