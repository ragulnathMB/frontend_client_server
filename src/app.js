const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');

// Import routes
const announcementRoutes = require('./routes/announcement.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const documentRoutes = require('./routes/document.routes');
const excuseRoutes = require('./routes/excuse.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const leaveRoutes = require('./routes/leave.routes');
const managerRoutes = require('./routes/manager.routes');
const notificationRoutes = require('./routes/notification.routes');
const payrollRoutes = require('./routes/payroll.routes');
const performanceRoutes = require('./routes/performance.routes');
const profileRoutes = require('./routes/profile.routes');
const reimbursementRoutes = require('./routes/reimbursement.routes');
const feedbackRoutes = require('./routes/feedback.routes');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.http(message.trim())
    }
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'frontend-client-server',
        version: process.env.npm_package_version || '1.0.0'
    });
});

// API routes
app.use('/api/announcements', announcementRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/excuses', excuseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/reimbursement', reimbursementRoutes);
app.use('/api/feedback', feedbackRoutes);

// 404 handler
app.use((req, res) => {
    logger.warn('Route not found', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip
    });
    
    res.status(404).json({
        error: 'Route not found',
        method: req.method,
        path: req.originalUrl
    });
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error('Unhandled error', {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip
    });

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.status(err.status || 500).json({
        error: isDevelopment ? err.message : 'Internal server error',
        ...(isDevelopment && { stack: err.stack })
    });
});

module.exports = app;
