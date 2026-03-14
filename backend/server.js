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
    let dbStatus = 'unloaded';
    let authStatus = 'unloaded';
    
    try {
        const testPool = require('./config/db');
        dbStatus = testPool ? 'loaded' : 'null';
    } catch (e) {
        dbStatus = 'error';
    }

    try {
        const testAuth = require('./routes/auth');
        authStatus = testAuth ? 'loaded' : 'null';
    } catch (e) {
        authStatus = 'error';
    }

    res.json({ 
      status: 'ok', 
      database: dbStatus,
      auth: authStatus,
      env: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
      time: new Date().toISOString()
    });
});

// Environment Audit (Sanitized - only allowed in development)
app.get('/api/audit', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Audit disabled in production for security.' });
    }
    
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

// Explicitly require all modules at top level for Vercel NFT bundling
/*
const authMod = require('./routes/auth');
const studentMod = require('./routes/students');
const receiptMod = require('./routes/receipts');
const attendanceMod = require('./routes/attendance');
const expenseMod = require('./routes/expenses');
const dashboardMod = require('./routes/dashboard');
const feedbackMod = require('./routes/feedbacks');
const whatsappMod = require('./routes/whatsapp');
const parentMod = require('./routes/parents');
const communityMod = require('./routes/community');
const learningMod = require('./routes/learning');
const gradingMod = require('./routes/grading');
const staffMod = require('./routes/staff');
const aiMod = require('./routes/ai');
const callMod = require('./routes/calls');
*/

const registerSafe = (path, routerInstance) => {
    app.use(path, (req, res, next) => {
        try {
            routerInstance(req, res, next);
        } catch (err) {
            console.error(`Runtime failure at ${path}:`, err.message);
            res.status(500).json({
                error: 'An internal error occurred.',
                code: 'SERVER_RUNTIME_ERROR'
            });
        }
    });
};

// Register them safely
/*
registerSafe('/api/auth', authMod);
registerSafe('/api/students', studentMod);
registerSafe('/api/receipts', receiptMod);
registerSafe('/api/attendance', attendanceMod);
registerSafe('/api/expenses', expenseMod);
registerSafe('/api/dashboard', dashboardMod);
registerSafe('/api/feedbacks', feedbackMod);
registerSafe('/api/whatsapp', whatsappMod);
registerSafe('/api/parents', parentMod);
registerSafe('/api/community', communityMod);
registerSafe('/api/learning', learningMod);
registerSafe('/api/grades', gradingMod);
registerSafe('/api/staff', staffMod);
registerSafe('/api/ai', aiMod);
registerSafe('/api/calls', callMod);
*/

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
