const forwarder = require('../services/forwarder');
const logger = require('../utils/logger');

exports.getAllAnnouncements = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'GET',
            path: '/api/announcements',
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
        logger.error('Announcements fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch announcements',
            requestId: error.requestId 
        });
    }
};

exports.addAnnouncement = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'POST',
            path: '/api/announcements',
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
        logger.error('Announcement add error:', error);
        res.status(500).json({ 
            error: 'Failed to add announcement',
            requestId: error.requestId 
        });
    }
};

exports.updateAnnouncement = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/announcements/${req.params.id}`,
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
        logger.error('Announcement update error:', error);
        res.status(500).json({ 
            error: 'Failed to update announcement',
            requestId: error.requestId 
        });
    }
};

exports.deleteAnnouncement = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'DELETE',
            path: `/api/announcements/${req.params.id}`,
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
        logger.error('Announcement delete error:', error);
        res.status(500).json({ 
            error: 'Failed to delete announcement',
            requestId: error.requestId 
        });
    }
};

exports.getAnnouncementById = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/announcements/${req.params.id}`,
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
        logger.error('Announcement fetch by ID error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch announcement',
            requestId: error.requestId 
        });
    }
};
