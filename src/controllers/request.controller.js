// controllers/request.controller.js
const forwarder = require('../services/forwarder');
const logger = require('../utils/logger');
const FormData = require('form-data');

exports.getRequestTransactions = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'GET',
            path: '/api/requests/transactions',
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
        logger.error('Request transactions fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch request transactions', requestId: error.requestId });
    }
};
