const app = require('./src/app');
const logger = require('./src/utils/logger');

// Load environment variables
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

let shuttingDown = false;

// Start server
const server = app.listen(PORT, () => {
    logger?.info?.('Frontend Client Server started', {
        port: PORT,
        environment: NODE_ENV,
        nodeVersion: process.version,
        pid: process.pid,
        timestamp: new Date().toISOString()
    });

    console.log(`🚀 Frontend Client Server running on port ${PORT}`);
    console.log(`📊 Environment: ${NODE_ENV}`);
    console.log(`🔗 API Gateway URL: ${process.env.API_GATEWAY_URL || 'Not configured'}`);
});

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;

    logger?.info?.(`Received ${signal}, shutting down gracefully`, {
        signal,
        timestamp: new Date().toISOString()
    });

    server.close((err) => {
        if (err) {
            logger?.error?.('Error during server shutdown', { error: err.message });
            process.exit(1);
        }

        logger?.info?.('Server closed successfully');
        process.exit(0);
    });

    // Force exit after 10s
    setTimeout(() => {
        logger?.error?.('Force shutdown: connections not closed in time');
        process.exit(1);
    }, 10_000);
};

// Signal listeners
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger?.error?.('Uncaught Exception', {
        error: err.message,
        stack: err.stack
    }) || console.error('Uncaught Exception:', err);
    gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger?.error?.('Unhandled Rejection', {
        reason: reason?.toString?.(),
        promise: promise?.toString?.()
    }) || console.error('Unhandled Rejection:', reason);
    gracefulShutdown('unhandledRejection');
});

module.exports = server;
