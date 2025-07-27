const forwarder = require('../services/forwarder');
const logger = require('../utils/logger');

exports.submitFeedback = async (req, res) => {
    try {
        const { empId, feedbackType, targetId, rating, comments, anonymous } = req.body;
        
        const result = await forwarder.forward({
            method: 'POST',
            path: '/api/feedback/submit',
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

        // Log feedback submission
        if (result.status === 200 && result.data) {
            logger.info('Feedback submitted successfully', {
                empId,
                feedbackType,
                targetId,
                rating,
                anonymous: !!anonymous,
                feedbackId: result.data.feedbackId,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Feedback submission error:', error);
        res.status(500).json({ 
            error: 'Failed to submit feedback',
            requestId: error.requestId 
        });
    }
};

exports.getFeedbackHistory = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/feedback/history/${empId}`,
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
        logger.error('Feedback history fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch feedback history',
            requestId: error.requestId 
        });
    }
};

exports.getReceivedFeedback = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/feedback/received/${empId}`,
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
        logger.error('Received feedback fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch received feedback',
            requestId: error.requestId 
        });
    }
};

exports.getFeedbackById = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/feedback/${feedbackId}`,
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
        logger.error('Feedback fetch by ID error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch feedback details',
            requestId: error.requestId 
        });
    }
};

exports.updateFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/feedback/${feedbackId}`,
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
        logger.error('Feedback update error:', error);
        res.status(500).json({ 
            error: 'Failed to update feedback',
            requestId: error.requestId 
        });
    }
};

exports.deleteFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        
        const result = await forwarder.forward({
            method: 'DELETE',
            path: `/api/feedback/${feedbackId}`,
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

        // Log feedback deletion
        if (result.status === 200) {
            logger.info('Feedback deleted successfully', {
                feedbackId,
                deletedBy: req.user?.id,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Feedback deletion error:', error);
        res.status(500).json({ 
            error: 'Failed to delete feedback',
            requestId: error.requestId 
        });
    }
};

exports.getFeedbackTypes = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'GET',
            path: '/api/feedback/types',
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
        logger.error('Feedback types fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch feedback types',
            requestId: error.requestId 
        });
    }
};

exports.getFeedbackAnalytics = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/feedback/analytics/${empId}`,
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
        logger.error('Feedback analytics fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch feedback analytics',
            requestId: error.requestId 
        });
    }
};

exports.respondToFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        
        const result = await forwarder.forward({
            method: 'POST',
            path: `/api/feedback/${feedbackId}/respond`,
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
        logger.error('Feedback response error:', error);
        res.status(500).json({ 
            error: 'Failed to respond to feedback',
            requestId: error.requestId 
        });
    }
};

exports.markFeedbackAsRead = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/feedback/${feedbackId}/read`,
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
        logger.error('Mark feedback as read error:', error);
        res.status(500).json({ 
            error: 'Failed to mark feedback as read',
            requestId: error.requestId 
        });
    }
};

exports.getTeamFeedback = async (req, res) => {
    try {
        const { managerId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/feedback/team/${managerId}`,
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
        logger.error('Team feedback fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch team feedback',
            requestId: error.requestId 
        });
    }
};

exports.generateFeedbackReport = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'POST',
            path: '/api/feedback/generate-report',
            body: req.body,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // For file downloads, handle binary content
        if (result.status === 200 && result.headers['content-type']?.includes('application/pdf')) {
            const contentDisposition = result.headers['content-disposition'] || 
                `attachment; filename="feedback_report.pdf"`;
            const contentLength = result.headers['content-length'];

            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': contentDisposition,
                'Content-Length': contentLength,
                'X-Request-ID': result.requestId,
                'X-Response-Time': `${result.duration}ms`
            });

            return res.send(result.data);
        } else {
            // Set response headers from API Gateway
            Object.entries(result.headers).forEach(([key, value]) => {
                res.set(key, value);
            });

            res.set('X-Request-ID', result.requestId);
            res.set('X-Response-Time', `${result.duration}ms`);

            return res.status(result.status).json(result.data);
        }
    } catch (error) {
        logger.error('Feedback report generation error:', error);
        res.status(500).json({ 
            error: 'Failed to generate feedback report',
            requestId: error.requestId 
        });
    }
};
