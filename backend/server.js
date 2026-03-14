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

// Comprehensive Route Registration with Error Handling
const routes = [
    { path: '/api/auth', module: './routes/auth' },
    { path: '/api/students', module: './routes/students' },
    { path: '/api/receipts', module: './routes/receipts' },
    { path: '/api/attendance', module: './routes/attendance' },
    { path: '/api/expenses', module: './routes/expenses' },
    { path: '/api/dashboard', module: './routes/dashboard' },
    { path: '/api/feedbacks', module: './routes/feedbacks' },
    { path: '/api/whatsapp', module: './routes/whatsapp' },
    { path: '/api/parents', module: './routes/parents' },
    { path: '/api/community', module: './routes/community' },
    { path: '/api/learning', module: './routes/learning' },
    { path: '/api/grades', module: './routes/grading' },
    { path: '/api/staff', module: './routes/staff' },
    { path: '/api/ai', module: './routes/ai' },
    { path: '/api/calls', module: './routes/calls' }
];

routes.forEach(route => {
    app.use(route.path, (req, res, next) => {
        try {
            // Lazy load to catch requirement errors at request time
            const router = require(route.module);
            if (typeof router !== 'function') {
                throw new Error(`Module ${route.module} did not export a router function/object.`);
            }
            router(req, res, next);
        } catch (error) {
            console.error(`CRASH in route ${route.path}:`, error);
            res.status(500).json({
                error: 'Route Handler Failed',
                path: route.path,
                message: error.message,
                stack: process.env.NODE_ENV === 'production' ? null : error.stack
            });
        }
    });
});

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
