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
// Health Check (Top Level, No Dependencies)
app.get('/api/health', async (req, res) => {
    res.json({ 
      status: 'ok', 
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
// We use path.join and static imports for Vercel stability.
// We also wrap everything in a try-catch to hide technical details from "hackers".

const registerSafeRoute = (routePath, moduleRelativePath) => {
    try {
        const absolutePath = path.join(__dirname, moduleRelativePath);
        const routerModule = require(absolutePath);
        
        app.use(routePath, (req, res, next) => {
            try {
                routerModule(req, res, next);
            } catch (routeError) {
                console.error(`Runtime crash in ${routePath}:`, routeError.message);
                res.status(500).json({
                    error: 'An internal server error occurred.',
                    code: 'ROUTE_ERROR'
                });
            }
        });
    } catch (importError) {
        console.error(`Failed to load module for ${routePath}:`, importError.message);
        // We don't want the server to die, but we won't show the path to the user
        app.use(routePath, (req, res) => {
            res.status(500).json({
                error: 'Service temporarily unavailable.',
                code: 'MODULE_MISSING'
            });
        });
    }
};

// Register all routes with the security-hardened loader
registerSafeRoute('/api/auth', './routes/auth');
registerSafeRoute('/api/students', './routes/students');
registerSafeRoute('/api/receipts', './routes/receipts');
registerSafeRoute('/api/attendance', './routes/attendance');
registerSafeRoute('/api/expenses', './routes/expenses');
registerSafeRoute('/api/dashboard', './routes/dashboard');
registerSafeRoute('/api/feedbacks', './routes/feedbacks');
registerSafeRoute('/api/whatsapp', './routes/whatsapp');
registerSafeRoute('/api/parents', './routes/parents');
registerSafeRoute('/api/community', './routes/community');
registerSafeRoute('/api/learning', './routes/learning');
registerSafeRoute('/api/grades', './routes/grading');
registerSafeRoute('/api/staff', './routes/staff');
registerSafeRoute('/api/ai', './routes/ai');
registerSafeRoute('/api/calls', './routes/calls');

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
