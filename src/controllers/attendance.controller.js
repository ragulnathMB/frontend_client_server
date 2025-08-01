const forwarder = require('../services/forwarder');
const logger = require('../utils/logger');

exports.markAttendance = async (req, res) => {
    try {
        const { empId, type } = req.body; // type: 'checkin' or 'checkout'
        
        // Validate attendance type before forwarding
        if (!type || !['checkin', 'checkout'].includes(type)) {
            return res.status(400).json({ error: 'Invalid attendance type' });
        }

        const result = await forwarder.forward({
            method: 'POST',
            path: '/api/attendance/mark',
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

        // Log attendance action
        if (result.status === 200 && result.data) {
            logger.info(`ATTENDANCE: Employee ${empId} ${type}`, {
                empId,
                type,
                time: result.data.time,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Attendance marking error:', error);
        res.status(500).json({ 
            error: 'Failed to mark attendance',
            requestId: error.requestId 
        });
    }
};

exports.getDailyStatus = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/attendance/daily/${empId}`,
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
        logger.error('Daily status error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch daily status',
            requestId: error.requestId 
        });
    }
};

exports.getAttendanceHistory = async (req, res) => {
    try {
        const { empId } = req.params;
        const { month, year } = req.query;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/attendance/history/${empId}`,
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
        logger.error('Attendance history error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch attendance history',
            requestId: error.requestId 
        });
    }
};

exports.getMonthlySummary = async (req, res) => {
    try {
        const { empId } = req.params;
        const { month, year } = req.query;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/attendance/summary/${empId}`,
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
        logger.error('Monthly summary error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch monthly summary',
            requestId: error.requestId 
        });
    }
};

exports.updateAttendance = async (req, res) => {
    try {
        const { empId } = req.params;
        const { date, checkInTime, checkOutTime, workingHours } = req.body;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/attendance/${empId}`,
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
        logger.error('Attendance update error:', error);
        res.status(500).json({ 
            error: 'Failed to update attendance',
            requestId: error.requestId 
        });
    }
};

exports.getAttendanceReport = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'GET',
            path: '/api/attendance/report',
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
        logger.error('Attendance report error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch attendance report',
            requestId: error.requestId 
        });
    }
};
exports.getCheckinCheckoutTime = async (req, res) => {
    try {
        const { empId } = req.params; // Should be the current user's employee ID

        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/attendance/checkin-checkout/${empId}`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        Object.entries(result.headers).forEach(([key, value]) => res.set(key, value));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        // The API Gateway should make sure the response contains: { checkInTime, checkOutTime }
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Checkin/Checkout time fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch checkin/checkout time',
            requestId: error.requestId
        });
    }
};
