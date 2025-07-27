const forwarder = require('../services/forwarder');
const logger = require('../utils/logger');

exports.getNotifications = async (req, res) => {
    try {
        const { empId } = req.params;
        const { page = 1, limit = 20, type, status } = req.query;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/notifications/${empId}`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // Set response headers from API Gateway
        Object.entries(result.headers).forEach(([key, value]) => {
            res.set(key, value);
        });

        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Get notifications error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch notifications',
            requestId: error.requestId 
        });
    }
};

exports.getUnreadNotifications = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/notifications/${empId}/unread`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // Set response headers from API Gateway
        Object.entries(result.headers).forEach(([key, value]) => {
            res.set(key, value);
        });

        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Get unread notifications error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch unread notifications',
            requestId: error.requestId 
        });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { empId } = req.body;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/notifications/${notificationId}/read`,
            body: req.body,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // Set response headers from API Gateway
        Object.entries(result.headers).forEach(([key, value]) => {
            res.set(key, value);
        });

        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Mark as read error:', error);
        res.status(500).json({ 
            error: 'Failed to mark notification as read',
            requestId: error.requestId 
        });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/notifications/${empId}/read-all`,
            body: req.body,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // Set response headers from API Gateway
        Object.entries(result.headers).forEach(([key, value]) => {
            res.set(key, value);
        });

        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        // Log bulk read action
        if (result.status === 200 && result.data) {
            logger.info('All notifications marked as read', {
                empId,
                markedCount: result.data.markedCount,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Mark all as read error:', error);
        res.status(500).json({ 
            error: 'Failed to mark all notifications as read',
            requestId: error.requestId 
        });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { empId } = req.body;
        
        const result = await forwarder.forward({
            method: 'DELETE',
            path: `/api/notifications/${notificationId}`,
            body: req.body,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // Set response headers from API Gateway
        Object.entries(result.headers).forEach(([key, value]) => {
            res.set(key, value);
        });

        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Delete notification error:', error);
        res.status(500).json({ 
            error: 'Failed to delete notification',
            requestId: error.requestId 
        });
    }
};

exports.createNotification = async (req, res) => {
    try {
        const { targetEmpId, title, content, type, priority, scheduledFor, senderEmpId } = req.body;
        
        const result = await forwarder.forward({
            method: 'POST',
            path: '/api/notifications',
            body: req.body,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // Set response headers from API Gateway
        Object.entries(result.headers).forEach(([key, value]) => {
            res.set(key, value);
        });

        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        // Log notification creation
        if (result.status === 200 && result.data) {
            logger.info(`NOTIFICATION CREATED: ${title} for ${targetEmpId}`, {
                notificationId: result.data.notificationId,
                targetEmpId,
                senderEmpId,
                title,
                type,
                priority,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Create notification error:', error);
        res.status(500).json({ 
            error: 'Failed to create notification',
            requestId: error.requestId 
        });
    }
};

exports.broadcastNotification = async (req, res) => {
    try {
        const { title, content, type, priority, targetGroups, excludeEmpIds, senderEmpId } = req.body;
        
        const result = await forwarder.forward({
            method: 'POST',
            path: '/api/notifications/broadcast',
            body: req.body,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // Set response headers from API Gateway
        Object.entries(result.headers).forEach(([key, value]) => {
            res.set(key, value);
        });

        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        // Log broadcast notification
        if (result.status === 200 && result.data) {
            logger.info(`BROADCAST NOTIFICATION: ${title} sent to ${result.data.sentCount} employees`, {
                title,
                type,
                priority,
                targetGroups,
                sentCount: result.data.sentCount,
                failedCount: result.data.failedCount,
                senderEmpId,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Broadcast notification error:', error);
        res.status(500).json({ 
            error: 'Failed to send broadcast notification',
            requestId: error.requestId 
        });
    }
};

exports.getAllNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 50, type, status, startDate, endDate } = req.query;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: '/api/notifications/admin/all',
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // Set response headers from API Gateway
        Object.entries(result.headers).forEach(([key, value]) => {
            res.set(key, value);
        });

        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Get all notifications error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch all notifications',
            requestId: error.requestId 
        });
    }
};

exports.deleteNotificationAdmin = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        const result = await forwarder.forward({
            method: 'DELETE',
            path: `/api/notifications/admin/${notificationId}`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // Set response headers from API Gateway
        Object.entries(result.headers).forEach(([key, value]) => {
            res.set(key, value);
        });

        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        // Log admin deletion
        if (result.status === 200) {
            logger.info('Notification deleted by admin', {
                notificationId,
                adminUserId: req.user?.id,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Admin delete notification error:', error);
        res.status(500).json({ 
            error: 'Failed to delete notification',
            requestId: error.requestId 
        });
    }
};

exports.getNotificationSettings = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/notifications/${empId}/settings`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // Set response headers from API Gateway
        Object.entries(result.headers).forEach(([key, value]) => {
            res.set(key, value);
        });

        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Get notification settings error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch notification settings',
            requestId: error.requestId 
        });
    }
};

exports.updateNotificationSettings = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/notifications/${empId}/settings`,
            body: req.body,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // Set response headers from API Gateway
        Object.entries(result.headers).forEach(([key, value]) => {
            res.set(key, value);
        });

        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Update notification settings error:', error);
        res.status(500).json({ 
            error: 'Failed to update notification settings',
            requestId: error.requestId 
        });
    }
};

exports.getNotificationById = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/notifications/details/${notificationId}`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // Set response headers from API Gateway
        Object.entries(result.headers).forEach(([key, value]) => {
            res.set(key, value);
        });

        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Get notification by ID error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch notification details',
            requestId: error.requestId 
        });
    }
};

exports.getNotificationStats = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/notifications/${empId}/stats`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // Set response headers from API Gateway
        Object.entries(result.headers).forEach(([key, value]) => {
            res.set(key, value);
        });

        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Get notification stats error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch notification statistics',
            requestId: error.requestId 
        });
    }
};
