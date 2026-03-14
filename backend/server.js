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

// --- SECURE ROUTE REGISTRATION ---
// We use literal require() strings here so Vercel's bundler (NFT) 
// can correctly identify and include the route files in the bundle.
const safeLoad = (modulePath) => {
    try {
        const mod = require(modulePath);
        return { module: mod };
    } catch (e) {
        console.error(`Module Load Error (${modulePath}):`, e.message);
        return { error: e.message };
    }
};

const registerSafe = (path, result) => {
    if (!result || result.error) {
        app.use(path, (req, res) => {
            res.status(500).json({
                error: 'Service temporarily unavailable.',
                code: 'MODULE_INITIALIZATION_FAILED',
                detail: result?.error || 'Unknown initialization error'
            });
        });
        return;
    }
    
    app.use(path, (req, res, next) => {
        try {
            result.module(req, res, next);
        } catch (err) {
            console.error(`Runtime failure at ${path}:`, err.message);
            res.status(500).json({
                error: 'An internal error occurred.',
                code: 'SERVER_RUNTIME_ERROR'
            });
        }
    });
};

// Explicitly require modules with literal strings for Vercel bundling
registerSafe('/api/auth', safeLoad('./routes/auth'));
registerSafe('/api/students', safeLoad('./routes/students'));
registerSafe('/api/receipts', safeLoad('./routes/receipts'));
registerSafe('/api/attendance', safeLoad('./routes/attendance'));
registerSafe('/api/expenses', safeLoad('./routes/expenses'));
registerSafe('/api/dashboard', safeLoad('./routes/dashboard'));
registerSafe('/api/feedbacks', safeLoad('./routes/feedbacks'));
registerSafe('/api/whatsapp', safeLoad('./routes/whatsapp'));
registerSafe('/api/parents', safeLoad('./routes/parents'));
registerSafe('/api/community', safeLoad('./routes/community'));
registerSafe('/api/learning', safeLoad('./routes/learning'));
registerSafe('/api/grades', safeLoad('./routes/grading'));
registerSafe('/api/staff', safeLoad('./routes/staff'));
registerSafe('/api/ai', safeLoad('./routes/ai'));
registerSafe('/api/calls', safeLoad('./routes/calls'));

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
