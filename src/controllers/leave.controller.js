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
exports.getLeaveRequestTransactions = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'GET',
            path: '/api/leave/transactions',
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });
        Object.entries(result.headers).forEach(([k,v])=>res.set(k,v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Leave request transactions fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch leave request transactions', requestId: error.requestId });
    }
};
exports.getLeaveRequestDetails = async (req, res) => {
    try {
        const { leaveReqId } = req.params;
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/leave/${leaveReqId}/details`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });
        Object.entries(result.headers).forEach(([k,v])=>res.set(k,v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Leave request details fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch leave request details', requestId: error.requestId });
    }
};
exports.submitLeave = async (req, res) => {
    try {
        // body: leaveType, startDate, endDate, reason, attachment (maybe multipart), empId, createdDate
        // leaveReqID should be ignored in input, set by downstream service
        const result = await forwarder.forward({
            method: 'POST',
            path: '/api/leave/submit',
            body: req.body, // or handle form-data
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });
        Object.entries(result.headers).forEach(([k,v])=>res.set(k,v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Submit leave error:', error);
        res.status(500).json({ error: 'Failed to submit leave', requestId: error.requestId });
    }
};
exports.submitLeaveOnBehalf = async (req, res) => {
    try {
        // body: leaveType, startDate, endDate, reason, attachment (maybe multipart), empId, createdDate
        // leaveReqID should be ignored in input, set by downstream service
        const result = await forwarder.forward({
            method: 'POST',
            path: '/api/leave/submit',
            body: req.body, // or handle form-data
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });
        Object.entries(result.headers).forEach(([k,v])=>res.set(k,v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Submit leave error:', error);
        res.status(500).json({ error: 'Failed to submit leave', requestId: error.requestId });
    }
};
exports.getPendingLeaveRequests = async (req, res) => {
    try {
        const { managerId } = req.params;

        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/leave/pending-requests/${managerId}`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant,
        });

        Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        // Each pending request should: id, fromDate, toDate, type, forwarded
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Pending leave requests fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch pending leave requests',
            requestId: error.requestId,
        });
    }
};
exports.editLeaveRequest = async (req, res) => {
    try {
        const { leaveReqId } = req.params;
        let requestBody = req.body;
        let requestHeaders = req.headers;

        // If the request includes attachments, send as multipart/form-data
        if (req.file) {
            const formData = new FormData();
            // Append all fields from req.body into the formData
            Object.entries(req.body).forEach(([key, value]) => formData.append(key, value));
            formData.append('attachment', req.file.buffer, {
                filename: req.file.originalname,
                contentType: req.file.mimetype,
            });
            requestBody = formData;
            requestHeaders = {
                ...req.headers,
                ...formData.getHeaders(),
            };
        }

        const result = await forwarder.forward({
            method: 'PATCH',
            path: `/leave/${leaveReqId}`,
            body: requestBody,
            headers: requestHeaders,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant,
        });

        // Set response headers from API Gateway
        Object.entries(result.headers).forEach(([key, value]) => {
            res.set(key, value);
        });
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Edit leave request error:', error);
        res.status(500).json({
            error: 'Failed to edit leave request',
            requestId: error.requestId,
        });
    }
};

/**
 * Save a leave request as draft
 * POST /leave/draft-save
 */
exports.draftSaveLeaveRequest = async (req, res) => {
    try {
        let requestBody = req.body;
        let requestHeaders = req.headers;

        // Handle attachments as multipart/form-data if present
        if (req.file) {
            const formData = new FormData();
            Object.entries(req.body).forEach(([key, value]) => formData.append(key, value));
            formData.append('attachment', req.file.buffer, {
                filename: req.file.originalname,
                contentType: req.file.mimetype,
            });
            requestBody = formData;
            requestHeaders = {
                ...req.headers,
                ...formData.getHeaders(),
            };
        }

        const result = await forwarder.forward({
            method: 'POST',
            path: `/leave/draft-save`,
            body: requestBody,
            headers: requestHeaders,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant,
        });

        Object.entries(result.headers).forEach(([key, value]) => {
            res.set(key, value);
        });
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Save draft leave request error:', error);
        res.status(500).json({
            error: 'Failed to save leave request draft',
            requestId: error.requestId,
        });
    }
}

exports.getPendingLeaveRequestDetails = async (req, res) => {
    try {
        const { leaveReqId } = req.params;

        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/leave/${leaveReqId}/details`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // The response should contain: id, fromDate, toDate, createdDate, type, description, attachment, forwardedBy (if applicable)
        Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Pending leave request details fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch pending leave request details', requestId: error.requestId });
    }
};
exports.approveRejectLeaveRequest = async (req, res) => {
    try {
        const { reqID } = req.params; // Assuming reqID is leaveReqId
        const { comments, empID } = req.body;
        
        const body = {
            comments,
            empID
        };

        const result = await forwarder.forward({
            method: 'PATCH',
            path: `/api/leave/${reqID}/approve-reject`,
            body,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });
        
        Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);
        
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Approve/Reject leave request error:', error);
        res.status(500).json({ error: 'Failed to process leave approval/rejection', requestId: error.requestId });
    }
};

exports.changeLeaveRequestApproval = async (req, res) => {
    try {
        const { reqID } = req.params;
        const { comments, empID } = req.body;

        const body = { comments, empID };

        const result = await forwarder.forward({
            method: 'PATCH',
            path: `/api/leave/${reqID}/change-request`,
            body,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Change leave request approval error:', error);
        res.status(500).json({ error: 'Failed to request change on leave approval', requestId: error.requestId });
    }
};

exports.getDelegates = async (req, res) => {
    try {
        const { empId } = req.params; // employee making the request

        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/leave/${empId}/delegates`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        Object.entries(result.headers).forEach(([k,v]) => res.set(k,v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        // Response: list of employees in same dept or higher position
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Get delegates error:', error);
        res.status(500).json({ error: 'Failed to fetch delegates', requestId: error.requestId });
    }
};
exports.delegateLeaveApproval = async (req, res) => {
    try {
        const { reqID } = req.params;
        const { empID: delegateEmpId, comment } = req.body;

        const body = { empID: delegateEmpId, comment };

        const result = await forwarder.forward({
            method: 'POST',
            path: `/api/leave/${reqID}/delegate`,
            body,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        Object.entries(result.headers).forEach(([k,v]) => res.set(k,v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Delegate leave approval error:', error);
        res.status(500).json({ error: 'Failed to delegate leave approval', requestId: error.requestId });
    }
};