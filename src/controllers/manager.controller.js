const forwarder = require('../services/forwarder');
const logger = require('../utils/logger');

exports.getTeam = async (req, res) => {
    try {
        const { managerId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/manager/${managerId}/team`,
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
        logger.error('Team fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch team',
            requestId: error.requestId 
        });
    }
};

exports.bulkApprove = async (req, res) => {
    try {
        const { type, ids, action, managerId } = req.body;
        
        const result = await forwarder.forward({
            method: 'POST',
            path: '/api/manager/bulk-approve',
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

        // Log bulk approval action
        if (result.status === 200) {
            logger.info(`Bulk ${action} processed successfully`, {
                type,
                count: ids ? ids.length : 0,
                action,
                managerId,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Bulk approval error:', error);
        res.status(500).json({ 
            error: 'Failed to process bulk approval',
            requestId: error.requestId 
        });
    }
};

exports.getPendingApprovals = async (req, res) => {
    try {
        const { managerId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/manager/${managerId}/pending-approvals`,
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
        logger.error('Pending approvals error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch pending approvals',
            requestId: error.requestId 
        });
    }
};

exports.getTeamMemberDetails = async (req, res) => {
    try {
        const { managerId, empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/manager/${managerId}/team/${empId}`,
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
        logger.error('Team member details error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch team member details',
            requestId: error.requestId 
        });
    }
};

exports.getManagerDashboard = async (req, res) => {
    try {
        const { managerId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/manager/${managerId}/dashboard`,
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
        logger.error('Manager dashboard error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch manager dashboard',
            requestId: error.requestId 
        });
    }
};

exports.getTeamAttendanceSummary = async (req, res) => {
    try {
        const { managerId } = req.params;
        const { month, year } = req.query;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/manager/${managerId}/team/attendance-summary`,
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
        logger.error('Team attendance summary error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch team attendance summary',
            requestId: error.requestId 
        });
    }
};

exports.searchTeamMembers = async (req, res) => {
    try {
        const { managerId } = req.params;
        const { query } = req.query;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/manager/${managerId}/team/search`,
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
        logger.error('Team search error:', error);
        res.status(500).json({ 
            error: 'Failed to search team members',
            requestId: error.requestId 
        });
    }
};

exports.assignTask = async (req, res) => {
    try {
        const { managerId } = req.params;
        
        const result = await forwarder.forward({
            method: 'POST',
            path: `/api/manager/${managerId}/assign-task`,
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
        logger.error('Task assignment error:', error);
        res.status(500).json({ 
            error: 'Failed to assign task',
            requestId: error.requestId 
        });
    }
};

exports.updateTeamMember = async (req, res) => {
    try {
        const { managerId, empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/manager/${managerId}/team/${empId}`,
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
        logger.error('Team member update error:', error);
        res.status(500).json({ 
            error: 'Failed to update team member',
            requestId: error.requestId 
        });
    }
};

exports.getTeamPerformance = async (req, res) => {
    try {
        const { managerId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/manager/${managerId}/team/performance`,
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
        logger.error('Team performance error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch team performance',
            requestId: error.requestId 
        });
    }
};
