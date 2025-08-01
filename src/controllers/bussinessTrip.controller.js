const forwarder = require('../services/forwarder');
const logger = require('../utils/logger');
const FormData = require('form-data');

// Get all business trip requests
exports.getBusinessTripTransactions = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'GET',
            path: '/api/business-trip/transactions',
            headers: req.headers, query: req.query,
            tenantId: req.tenant.id, userId: req.user?.id, tenant: req.tenant
        });
        Object.entries(result.headers).forEach(([k,v])=>res.set(k,v));
        res.set('X-Request-ID', result.requestId); res.set('X-Response-Time', `${result.duration}ms`);
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('BusinessTrip transactions fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch business trip requests', requestId: error.requestId });
    }
};

// Get business trip request details
exports.getBusinessTripRequestDetails = async (req, res) => {
    try {
        const { businessTripReqId } = req.params;
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/business-trip/${businessTripReqId}/details`,
            headers: req.headers, query: req.query,
            tenantId: req.tenant.id, userId: req.user?.id, tenant: req.tenant
        });
        Object.entries(result.headers).forEach(([k,v])=>res.set(k,v));
        res.set('X-Request-ID', result.requestId); res.set('X-Response-Time', `${result.duration}ms`);
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('BusinessTrip request details fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch business trip request details', requestId: error.requestId });
    }
};

// Submit new business trip request (with attachment)
exports.submitBusinessTripRequest = async (req, res) => {
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
            path: '/api/business-trip/submit',
            body: requestBody, headers: requestHeaders, query: req.query,
            tenantId: req.tenant.id, userId: req.user?.id, tenant: req.tenant
        });
        Object.entries(result.headers).forEach(([k,v])=>res.set(k,v));
        res.set('X-Request-ID', result.requestId); res.set('X-Response-Time', `${result.duration}ms`);
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Submit BusinessTrip error:', error);
        res.status(500).json({ error: 'Failed to submit business trip request', requestId: error.requestId });
    }
};

// On-behalf submit
exports.submitBusinessTripRequestOnBehalf = async (req, res) => {
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
            path: '/api/business-trip/submit-on-behalf',
            body: requestBody, headers: requestHeaders, query: req.query,
            tenantId: req.tenant.id, userId: req.user?.id, tenant: req.tenant
        });
        Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
        res.set('X-Request-ID', result.requestId); res.set('X-Response-Time', `${result.duration}ms`);
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Submit BusinessTrip on behalf error:', error);
        res.status(500).json({ error: 'Failed to submit business trip on behalf', requestId: error.requestId });
    }
};
