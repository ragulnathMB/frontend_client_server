const forwarder = require('../services/forwarder');
const logger = require('../utils/logger');
const FormData = require('form-data');

exports.submitExcuse = async (req, res) => {
    try {
        const { empId, type, reason, excuseDate, duration } = req.body;
        
        let requestBody;
        let requestHeaders = req.headers;

        // Handle file attachment if present
        if (req.file) {
            const formData = new FormData();
            formData.append('file', req.file.buffer, {
                filename: req.file.originalname,
                contentType: req.file.mimetype
            });
            formData.append('empId', empId);
            formData.append('type', type);
            formData.append('reason', reason);
            formData.append('excuseDate', excuseDate);
            formData.append('duration', duration);

            requestBody = formData;
            requestHeaders = {
                ...req.headers,
                ...formData.getHeaders()
            };
        } else {
            requestBody = req.body;
        }

        const result = await forwarder.forward({
            method: 'POST',
            path: '/api/excuses/submit',
            body: requestBody,
            headers: requestHeaders,
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

        // Log excuse submission
        if (result.status === 200 && result.data) {
            logger.info(`EXCUSE: ${empId} submitted ${type} excuse for ${excuseDate}`, {
                empId,
                type,
                excuseDate,
                duration,
                hasAttachment: !!req.file,
                excuseId: result.data.excuseId,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Excuse submission error:', error);
        res.status(500).json({ 
            error: 'Failed to submit excuse request',
            requestId: error.requestId 
        });
    }
};

exports.getExcuseHistory = async (req, res) => {
    try {
        const { empId } = req.params;
        const { startDate, endDate, status } = req.query;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/excuses/history/${empId}`,
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
        logger.error('Excuse history error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch excuse history',
            requestId: error.requestId 
        });
    }
};

exports.getExcuseStatus = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/excuses/status/${empId}`,
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
        logger.error('Excuse status error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch excuse status',
            requestId: error.requestId 
        });
    }
};

exports.approveRejectExcuse = async (req, res) => {
    try {
        const { excuseId } = req.params;
        const { action, remarks, managerId } = req.body;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/excuses/${excuseId}/action`,
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

        // Log excuse action
        if (result.status === 200) {
            logger.info(`Excuse request ${action}d successfully`, {
                excuseId,
                action,
                managerId,
                remarks,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Excuse approval error:', error);
        res.status(500).json({ 
            error: 'Failed to process excuse approval',
            requestId: error.requestId 
        });
    }
};

exports.getPendingExcuses = async (req, res) => {
    try {
        const { managerId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/excuses/pending/${managerId}`,
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
        logger.error('Pending excuses error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch pending excuses',
            requestId: error.requestId 
        });
    }
};

exports.cancelExcuse = async (req, res) => {
    try {
        const { excuseId } = req.params;
        const { empId } = req.body;
        
        const result = await forwarder.forward({
            method: 'DELETE',
            path: `/api/excuses/${excuseId}/cancel`,
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

        // Log excuse cancellation
        if (result.status === 200) {
            logger.info('Excuse request cancelled successfully', {
                excuseId,
                empId,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Excuse cancellation error:', error);
        res.status(500).json({ 
            error: 'Failed to cancel excuse request',
            requestId: error.requestId 
        });
    }
};

exports.getExcuseTypes = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'GET',
            path: '/api/excuses/types',
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
        logger.error('Excuse types error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch excuse types',
            requestId: error.requestId 
        });
    }
};

exports.getExcuseById = async (req, res) => {
    try {
        const { excuseId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/excuses/${excuseId}`,
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
        logger.error('Excuse fetch by ID error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch excuse details',
            requestId: error.requestId 
        });
    }
};

exports.downloadExcuseAttachment = async (req, res) => {
    try {
        const { excuseId, attachmentId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/excuses/${excuseId}/attachment/${attachmentId}`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // For file downloads, handle binary content
        if (result.status === 200) {
            const contentType = result.headers['content-type'] || 'application/octet-stream';
            const contentDisposition = result.headers['content-disposition'] || 
                `attachment; filename="excuse_attachment_${attachmentId}"`;
            const contentLength = result.headers['content-length'];

            res.set({
                'Content-Type': contentType,
                'Content-Disposition': contentDisposition,
                'Content-Length': contentLength,
                'X-Request-ID': result.requestId,
                'X-Response-Time': `${result.duration}ms`
            });

            // Forward other relevant headers
            Object.entries(result.headers).forEach(([key, value]) => {
                if (!['content-type', 'content-disposition', 'content-length'].includes(key.toLowerCase())) {
                    res.set(key, value);
                }
            });

            return res.send(result.data);
        } else {
            res.set('X-Request-ID', result.requestId);
            res.set('X-Response-Time', `${result.duration}ms`);
            return res.status(result.status).json(result.data);
        }
    } catch (error) {
        logger.error('Excuse attachment download error:', error);
        res.status(500).json({ 
            error: 'Failed to download excuse attachment',
            requestId: error.requestId 
        });
    }
};
exports.getExcuseTransactions = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'GET',
            path: '/api/excuse/transactions',
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id, userId: req.user?.id, tenant: req.tenant
        });
        Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
        res.set('X-Request-ID', result.requestId); res.set('X-Response-Time', `${result.duration}ms`);
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Excuse transactions fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch excuse transactions', requestId: error.requestId });
    }
};

// Fetch excuse request details
exports.getExcuseRequestDetails = async (req, res) => {
    try {
        const { excuseReqId } = req.params;
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/excuse/${excuseReqId}/details`,
            headers: req.headers, query: req.query,
            tenantId: req.tenant.id, userId: req.user?.id, tenant: req.tenant
        });
        Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
        res.set('X-Request-ID', result.requestId); res.set('X-Response-Time', `${result.duration}ms`);
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Excuse request details fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch excuse request details', requestId: error.requestId });
    }
};

// Submit new excuse request (ExcuseReqID generated by backend)
exports.submitExcuse = async (req, res) => {
    try {
        let requestBody, requestHeaders = req.headers;
        if (req.file) {
            const formData = new FormData();
            Object.entries(req.body).forEach(([key, value]) => formData.append(key, value));
            formData.append('attachment', req.file.buffer, {
                filename: req.file.originalname, contentType: req.file.mimetype
            });
            requestBody = formData;
            requestHeaders = { ...req.headers, ...formData.getHeaders() };
        } else {
            requestBody = req.body;
        }
        const result = await forwarder.forward({
            method: 'POST',
            path: '/api/excuse/submit',
            body: requestBody, headers: requestHeaders,
            query: req.query,
            tenantId: req.tenant.id, userId: req.user?.id, tenant: req.tenant
        });
        Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
        res.set('X-Request-ID', result.requestId); res.set('X-Response-Time', `${result.duration}ms`);
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Excuse submit error:', error);
        res.status(500).json({ error: 'Failed to submit excuse', requestId: error.requestId });
    }
};

// On-behalf submit
exports.submitExcuseOnBehalf = async (req, res) => {
    try {
        let requestBody, requestHeaders = req.headers;
        if (req.file) {
            const formData = new FormData();
            Object.entries(req.body).forEach(([key, value]) => formData.append(key, value));
            formData.append('attachment', req.file.buffer, {
                filename: req.file.originalname, contentType: req.file.mimetype
            });
            requestBody = formData;
            requestHeaders = { ...req.headers, ...formData.getHeaders() };
        } else {
            requestBody = req.body;
        }
        const result = await forwarder.forward({
            method: 'POST',
            path: '/api/excuse/submit-on-behalf',
            body: requestBody, headers: requestHeaders, query: req.query,
            tenantId: req.tenant.id, userId: req.user?.id, tenant: req.tenant
        });
        Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
        res.set('X-Request-ID', result.requestId); res.set('X-Response-Time', `${result.duration}ms`);
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Excuse OnBehalf submit error:', error);
        res.status(500).json({ error: 'Failed to submit excuse on behalf', requestId: error.requestId });
    }
};
exports.editExcuseRequest = async (req, res) => {
    try {
        const { excuseReqId } = req.params;
        let requestBody = req.body;
        let requestHeaders = req.headers;

        // Handle file attachment if present
        if (req.file) {
            const formData = new FormData();
            // Append all other body fields
            Object.entries(req.body).forEach(([key, value]) => formData.append(key, value));
            formData.append('attachment', req.file.buffer, {
                filename: req.file.originalname,
                contentType: req.file.mimetype
            });
            requestBody = formData;
            requestHeaders = {
                ...req.headers,
                ...formData.getHeaders()
            };
        }

        const result = await forwarder.forward({
            method: 'PATCH',
            path: `/excuse/${excuseReqId}`,
            body: requestBody,
            headers: requestHeaders,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // Set response headers from API Gateway
        Object.entries(result.headers).forEach(([key, value]) => res.set(key, value));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Edit excuse request error:', error);
        res.status(500).json({
            error: 'Failed to edit excuse request',
            requestId: error.requestId,
        });
    }
};

/**
 * Save an excuse request as draft
 * POST /excuse/draft-save
 */
exports.draftSaveExcuseRequest = async (req, res) => {
    try {
        let requestBody = req.body;
        let requestHeaders = req.headers;

        // Handle file attachment if present
        if (req.file) {
            const formData = new FormData();
            // Append all other body fields
            Object.entries(req.body).forEach(([key, value]) => formData.append(key, value));
            formData.append('attachment', req.file.buffer, {
                filename: req.file.originalname,
                contentType: req.file.mimetype
            });
            requestBody = formData;
            requestHeaders = {
                ...req.headers,
                ...formData.getHeaders()
            };
        }

        const result = await forwarder.forward({
            method: 'POST',
            path: `/excuse/draft-save`,
            body: requestBody,
            headers: requestHeaders,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant,
        });

        // Set response headers from API Gateway
        Object.entries(result.headers).forEach(([key, value]) => res.set(key, value));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Save draft excuse request error:', error);
        res.status(500).json({
            error: 'Failed to save excuse request draft',
            requestId: error.requestId,
        });
    }
}

exports.getPendingExcuseRequests = async (req, res) => {
    try {
        const { managerId } = req.params;

        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/excuse/pending/${managerId}`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // Response includes id, date, fromTime, toTime, type, forwardedBy (if any)
        Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Pending excuse requests fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch pending excuse requests', requestId: error.requestId });
    }
};

exports.getPendingExcuseRequestDetails = async (req, res) => {
    try {
        const { excuseReqId } = req.params;

        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/excuse/${excuseReqId}/details`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // Response includes id, date, fromTime, toTime, createdDate, type, description, attachment, forwardedBy (if any)
        Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Pending excuse request details fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch pending excuse request details', requestId: error.requestId });
    }
};
exports.approveRejectExcuseRequest = async (req, res) => {
    try {
        const { reqID } = req.params;
        const { comments, empID } = req.body;

        const result = await forwarder.forward({
            method: 'PATCH',
            path: `/api/excuse/${reqID}/approve-reject`,
            body: { comments, empID },
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Approve/Reject excuse request error:', error);
        res.status(500).json({ error: 'Failed to process excuse approval/rejection', requestId: error.requestId });
    }
};


exports.changeExcuseApproval = async (req, res) => {
    try {
        const { reqID } = req.params;  // Excuse request ID
        const { comments, empID } = req.body;

        const result = await forwarder.forward({
            method: 'PATCH',
            path: `/api/excuse/${reqID}/change-request`,
            body: { comments, empID },
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant,
        });

        Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Change excuse approval error:', error);
        res.status(500).json({
            error: 'Failed to request change on excuse approval',
            requestId: error.requestId,
        });
    }
};

exports.delegateExcuseApproval = async (req, res) => {
    try {
        const { reqID } = req.params;  // Excuse request ID
        const { empID: delegateEmpId, comment } = req.body;

        const result = await forwarder.forward({
            method: 'POST',
            path: `/api/excuse/${reqID}/delegate`,
            body: { empID: delegateEmpId, comment },
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant,
        });

        Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Delegate excuse approval error:', error);
        res.status(500).json({
            error: 'Failed to delegate excuse approval',
            requestId: error.requestId,
        });
    }
};