const forwarder = require('../services/forwarder');
const logger = require('../utils/logger');

exports.submitSelfEvaluation = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'POST',
            path: `/api/performance/${empId}/self-evaluation`,
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

        // Log self evaluation submission
        if (result.status === 200) {
            logger.info('Self evaluation submitted successfully', {
                empId,
                tenantId: req.tenant.id,
                submittedBy: req.user?.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Self evaluation error:', error);
        res.status(500).json({ 
            error: 'Failed to submit self evaluation',
            requestId: error.requestId 
        });
    }
};

exports.getFeedback = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/performance/${empId}/feedback`,
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
        logger.error('Feedback fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch feedback',
            requestId: error.requestId 
        });
    }
};

exports.submitManagerFeedback = async (req, res) => {
    try {
        const { empId } = req.params;
        const { managerId, feedbackData } = req.body;
        
        const result = await forwarder.forward({
            method: 'POST',
            path: `/api/performance/${empId}/manager-feedback`,
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

        // Log manager feedback submission
        if (result.status === 200) {
            logger.info('Manager feedback submitted successfully', {
                empId,
                managerId,
                tenantId: req.tenant.id,
                submittedBy: req.user?.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Manager feedback error:', error);
        res.status(500).json({ 
            error: 'Failed to submit manager feedback',
            requestId: error.requestId 
        });
    }
};

exports.getPerformanceReviews = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/performance/${empId}/reviews`,
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
        logger.error('Performance reviews fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch performance reviews',
            requestId: error.requestId 
        });
    }
};

exports.createPerformanceGoal = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'POST',
            path: `/api/performance/${empId}/goals`,
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
        logger.error('Performance goal creation error:', error);
        res.status(500).json({ 
            error: 'Failed to create performance goal',
            requestId: error.requestId 
        });
    }
};

exports.updatePerformanceGoal = async (req, res) => {
    try {
        const { empId, goalId } = req.params;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/performance/${empId}/goals/${goalId}`,
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
        logger.error('Performance goal update error:', error);
        res.status(500).json({ 
            error: 'Failed to update performance goal',
            requestId: error.requestId 
        });
    }
};

exports.getPerformanceGoals = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/performance/${empId}/goals`,
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
        logger.error('Performance goals fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch performance goals',
            requestId: error.requestId 
        });
    }
};

exports.getPerformanceMetrics = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/performance/${empId}/metrics`,
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
        logger.error('Performance metrics fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch performance metrics',
            requestId: error.requestId 
        });
    }
};

exports.getPeerFeedback = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/performance/${empId}/peer-feedback`,
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
        logger.error('Peer feedback fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch peer feedback',
            requestId: error.requestId 
        });
    }
};

exports.submitPeerFeedback = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'POST',
            path: `/api/performance/${empId}/peer-feedback`,
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
        logger.error('Peer feedback submission error:', error);
        res.status(500).json({ 
            error: 'Failed to submit peer feedback',
            requestId: error.requestId 
        });
    }
};

exports.generatePerformanceReport = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'POST',
            path: `/api/performance/${empId}/generate-report`,
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
                `attachment; filename="performance_report_${empId}.pdf"`;
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
        logger.error('Performance report generation error:', error);
        res.status(500).json({ 
            error: 'Failed to generate performance report',
            requestId: error.requestId 
        });
    }
};
