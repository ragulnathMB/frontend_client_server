const forwarder = require('../services/forwarder');
const logger = require('../utils/logger');
const FormData = require('form-data');

exports.submitReimbursement = async (req, res) => {
    try {
        const { empId, type, amount, comment, expenseDate } = req.body;
        
        let requestBody;
        let requestHeaders = req.headers;

        // Handle receipt attachment if present
        if (req.file) {
            const formData = new FormData();
            formData.append('receipt', req.file.buffer, {
                filename: req.file.originalname,
                contentType: req.file.mimetype
            });
            formData.append('empId', empId);
            formData.append('type', type);
            formData.append('amount', parseFloat(amount));
            formData.append('comment', comment);
            formData.append('expenseDate', expenseDate);

            requestBody = formData;
            requestHeaders = {
                ...req.headers,
                ...formData.getHeaders()
            };
        } else {
            requestBody = {
                ...req.body,
                amount: parseFloat(amount)
            };
        }

        const result = await forwarder.forward({
            method: 'POST',
            path: '/api/reimbursement/submit',
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

        // Log reimbursement submission
        if (result.status === 200 && result.data) {
            logger.info(`REIMBURSEMENT: ${empId} submitted ${type} claim for ₹${amount}`, {
                empId,
                type,
                amount: parseFloat(amount),
                expenseDate,
                hasReceipt: !!req.file,
                reimbursementId: result.data.reimbursementId,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Reimbursement submission error:', error);
        res.status(500).json({ 
            error: 'Failed to submit reimbursement request',
            requestId: error.requestId 
        });
    }
};

exports.getReimbursementHistory = async (req, res) => {
    try {
        const { empId } = req.params;
        const { startDate, endDate, status } = req.query;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/reimbursement/history/${empId}`,
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
        logger.error('Reimbursement history error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch reimbursement history',
            requestId: error.requestId 
        });
    }
};

exports.getReimbursementStatus = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/reimbursement/status/${empId}`,
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
        logger.error('Reimbursement status error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch reimbursement status',
            requestId: error.requestId 
        });
    }
};

exports.approveRejectReimbursement = async (req, res) => {
    try {
        const { reimbursementId } = req.params;
        const { action, remarks, managerId } = req.body;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/reimbursement/${reimbursementId}/action`,
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

        // Log reimbursement action
        if (result.status === 200) {
            logger.info(`Reimbursement request ${action}d successfully`, {
                reimbursementId,
                action,
                managerId,
                remarks,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Reimbursement approval error:', error);
        res.status(500).json({ 
            error: 'Failed to process reimbursement approval',
            requestId: error.requestId 
        });
    }
};

exports.getReimbursementTypes = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'GET',
            path: '/api/reimbursement/types',
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
        logger.error('Reimbursement types error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch reimbursement types',
            requestId: error.requestId 
        });
    }
};

exports.getPendingReimbursements = async (req, res) => {
    try {
        const { managerId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/reimbursement/pending/${managerId}`,
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
        logger.error('Pending reimbursements error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch pending reimbursements',
            requestId: error.requestId 
        });
    }
};

exports.cancelReimbursement = async (req, res) => {
    try {
        const { reimbursementId } = req.params;
        const { empId } = req.body;
        
        const result = await forwarder.forward({
            method: 'DELETE',
            path: `/api/reimbursement/${reimbursementId}/cancel`,
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

        // Log reimbursement cancellation
        if (result.status === 200) {
            logger.info('Reimbursement request cancelled successfully', {
                reimbursementId,
                empId,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Reimbursement cancellation error:', error);
        res.status(500).json({ 
            error: 'Failed to cancel reimbursement request',
            requestId: error.requestId 
        });
    }
};

exports.getReimbursementById = async (req, res) => {
    try {
        const { reimbursementId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/reimbursement/${reimbursementId}`,
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
        logger.error('Reimbursement fetch by ID error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch reimbursement details',
            requestId: error.requestId 
        });
    }
};

exports.downloadReceipt = async (req, res) => {
    try {
        const { reimbursementId, receiptId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/reimbursement/${reimbursementId}/receipt/${receiptId}`,
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
                `attachment; filename="receipt_${receiptId}"`;
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
        logger.error('Receipt download error:', error);
        res.status(500).json({ 
            error: 'Failed to download receipt',
            requestId: error.requestId 
        });
    }
};

exports.getReimbursementSummary = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/reimbursement/summary/${empId}`,
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
        logger.error('Reimbursement summary error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch reimbursement summary',
            requestId: error.requestId 
        });
    }
};
