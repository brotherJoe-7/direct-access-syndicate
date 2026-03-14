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
// We use static imports here so Vercel's bundler can reliably find the files.
// Also, we use a wrapper to catch crashes and return generic error messages.
const registerSafeRoute = (path, routerModule) => {
    app.use(path, (req, res, next) => {
        try {
            routerModule(req, res, next);
        } catch (error) {
            console.error(`CRASH in route ${path}:`, error.message);
            // Professional generic error for the end user
            res.status(500).json({
                error: 'An internal error occurred. Please try again later.',
                code: 'SERVER_ERROR'
            });
        }
    });
};

// Import all routers statically
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const receiptRoutes = require('./routes/receipts');
const attendanceRoutes = require('./routes/attendance');
const expenseRoutes = require('./routes/expenses');
const dashboardRoutes = require('./routes/dashboard');
const feedbackRoutes = require('./routes/feedbacks');
const whatsappRoutes = require('./routes/whatsapp');
const parentRoutes = require('./routes/parents');
const communityRoutes = require('./routes/community');
const learningRoutes = require('./routes/learning');
const gradingRoutes = require('./routes/grading');
const staffRoutes = require('./routes/staff');
const aiRoutes = require('./routes/ai');
const callRoutes = require('./routes/calls');

// Register them safely
registerSafeRoute('/api/auth', authRoutes);
registerSafeRoute('/api/students', studentRoutes);
registerSafeRoute('/api/receipts', receiptRoutes);
registerSafeRoute('/api/attendance', attendanceRoutes);
registerSafeRoute('/api/expenses', expenseRoutes);
registerSafeRoute('/api/dashboard', dashboardRoutes);
registerSafeRoute('/api/feedbacks', feedbackRoutes);
registerSafeRoute('/api/whatsapp', whatsappRoutes);
registerSafeRoute('/api/parents', parentRoutes);
registerSafeRoute('/api/community', communityRoutes);
registerSafeRoute('/api/learning', learningRoutes);
registerSafeRoute('/api/grades', gradingRoutes);
registerSafeRoute('/api/staff', staffRoutes);
registerSafeRoute('/api/ai', aiRoutes);
registerSafeRoute('/api/calls', callRoutes);

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
