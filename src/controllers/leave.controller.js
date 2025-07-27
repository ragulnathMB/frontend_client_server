const forwarder = require('../services/forwarder');
const logger = require('../utils/logger');

exports.applyLeave = async (req, res) => {
    try {
        const { leaveId, empId, fromDate, toDate, type } = req.body;
        
        const result = await forwarder.forward({
            method: 'POST',
            path: '/api/leave/apply',
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

        // Log leave application
        if (result.status === 200) {
            logger.info('Leave application submitted successfully', {
                empId,
                leaveId,
                fromDate,
                toDate,
                type,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Leave application error:', error);
        res.status(500).json({ 
            error: 'Failed to apply for leave',
            requestId: error.requestId 
        });
    }
};

exports.getLeaveBalance = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/leave/balance/${empId}`,
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
        logger.error('Leave balance error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch leave balance',
            requestId: error.requestId 
        });
    }
};

exports.getLeaveHistory = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/leave/history/${empId}`,
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
        logger.error('Leave history error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch leave history',
            requestId: error.requestId 
        });
    }
};

exports.getLeaveTypes = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'GET',
            path: '/api/leave/types',
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
        logger.error('Leave types error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch leave types',
            requestId: error.requestId 
        });
    }
};

exports.getLeaveStatus = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/leave/status/${empId}`,
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
        logger.error('Leave status error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch leave status',
            requestId: error.requestId 
        });
    }
};

exports.cancelLeave = async (req, res) => {
    try {
        const { leaveId } = req.params;
        const { empId } = req.body;
        
        const result = await forwarder.forward({
            method: 'DELETE',
            path: `/api/leave/${leaveId}/cancel`,
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

        // Log leave cancellation
        if (result.status === 200) {
            logger.info('Leave cancelled successfully', {
                leaveId,
                empId,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Leave cancellation error:', error);
        res.status(500).json({ 
            error: 'Failed to cancel leave',
            requestId: error.requestId 
        });
    }
};

exports.approveRejectLeave = async (req, res) => {
    try {
        const { leaveId } = req.params;
        const { action, remarks, managerId } = req.body;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/leave/${leaveId}/action`,
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

        // Log leave action
        if (result.status === 200) {
            logger.info(`Leave request ${action}d successfully`, {
                leaveId,
                action,
                managerId,
                remarks,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Leave approval error:', error);
        res.status(500).json({ 
            error: 'Failed to process leave approval',
            requestId: error.requestId 
        });
    }
};

exports.getPendingLeaves = async (req, res) => {
    try {
        const { managerId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/leave/pending/${managerId}`,
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
        logger.error('Pending leaves error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch pending leaves',
            requestId: error.requestId 
        });
    }
};

exports.getLeaveById = async (req, res) => {
    try {
        const { leaveId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/leave/${leaveId}`,
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
        logger.error('Leave fetch by ID error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch leave details',
            requestId: error.requestId 
        });
    }
};

exports.updateLeave = async (req, res) => {
    try {
        const { leaveId } = req.params;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/leave/${leaveId}`,
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
        logger.error('Leave update error:', error);
        res.status(500).json({ 
            error: 'Failed to update leave',
            requestId: error.requestId 
        });
    }
};
