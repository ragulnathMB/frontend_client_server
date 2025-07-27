const forwarder = require('../services/forwarder');
const logger = require('../utils/logger');

exports.getDashboardData = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'GET',
            path: '/api/dashboard',
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
        logger.error('Dashboard data fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch dashboard data',
            requestId: error.requestId 
        });
    }
};

exports.getEmployeeDashboard = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/dashboard/employee/${empId}`,
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
        logger.error('Employee dashboard data fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch employee dashboard data',
            requestId: error.requestId 
        });
    }
};

exports.getManagerDashboard = async (req, res) => {
    try {
        const { managerId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/dashboard/manager/${managerId}`,
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
        logger.error('Manager dashboard data fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch manager dashboard data',
            requestId: error.requestId 
        });
    }
};

exports.getAttendanceStats = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'GET',
            path: '/api/dashboard/attendance-stats',
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
        logger.error('Attendance stats fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch attendance statistics',
            requestId: error.requestId 
        });
    }
};

exports.getRecentActivities = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'GET',
            path: '/api/dashboard/recent-activities',
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
        logger.error('Recent activities fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch recent activities',
            requestId: error.requestId 
        });
    }
};

exports.getPendingApprovals = async (req, res) => {
    try {
        const { managerId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/dashboard/pending-approvals/${managerId}`,
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
        logger.error('Pending approvals fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch pending approvals',
            requestId: error.requestId 
        });
    }
};

exports.getQuickStats = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/dashboard/quick-stats/${empId}`,
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
        logger.error('Quick stats fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch quick statistics',
            requestId: error.requestId 
        });
    }
};

exports.getTeamOverview = async (req, res) => {
    try {
        const { managerId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/dashboard/team-overview/${managerId}`,
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
        logger.error('Team overview fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch team overview',
            requestId: error.requestId 
        });
    }
};

exports.getNotificationSummary = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'GET',
            path: '/api/dashboard/notifications',
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
        logger.error('Notification summary fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch notification summary',
            requestId: error.requestId 
        });
    }
};

exports.refreshDashboard = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'POST',
            path: '/api/dashboard/refresh',
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

        // Log dashboard refresh
        if (result.status === 200) {
            logger.info('Dashboard refreshed successfully', {
                userId: req.user?.id,
                tenantId: req.tenant.id,
                timestamp: new Date().toISOString()
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Dashboard refresh error:', error);
        res.status(500).json({ 
            error: 'Failed to refresh dashboard',
            requestId: error.requestId 
        });
    }
};

exports.updateDashboardPreferences = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/dashboard/preferences/${empId}`,
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
        logger.error('Dashboard preferences update error:', error);
        res.status(500).json({ 
            error: 'Failed to update dashboard preferences',
            requestId: error.requestId 
        });
    }
};
