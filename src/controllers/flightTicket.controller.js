const forwarder = require('../services/forwarder');
const logger = require('../utils/logger');
const FormData = require('form-data');

// Fetch all flight ticket requests
exports.getFlightTicketTransactions = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'GET',
            path: '/api/flight-ticket/transactions',
            headers: req.headers, query: req.query,
            tenantId: req.tenant.id, userId: req.user?.id, tenant: req.tenant
        });
        Object.entries(result.headers).forEach(([k,v])=>res.set(k,v));
        res.set('X-Request-ID', result.requestId); res.set('X-Response-Time', `${result.duration}ms`);
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('FlightTicket transactions fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch flight ticket requests', requestId: error.requestId });
    }
};

// Fetch flight ticket request details
exports.getFlightTicketRequestDetails = async (req, res) => {
    try {
        const { flightTicketReqId } = req.params;
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/flight-ticket/${flightTicketReqId}/details`,
            headers: req.headers, query: req.query,
            tenantId: req.tenant.id, userId: req.user?.id, tenant: req.tenant
        });
        Object.entries(result.headers).forEach(([k,v])=>res.set(k,v));
        res.set('X-Request-ID', result.requestId); res.set('X-Response-Time', `${result.duration}ms`);
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('FlightTicket request details fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch flight ticket request details', requestId: error.requestId });
    }
};

// Submit new flight ticket request
exports.submitFlightTicketRequest = async (req, res) => {
    try {
        // Assuming passengers structure is passed in req.body.passengers as array
        const result = await forwarder.forward({
            method: 'POST',
            path: '/api/flight-ticket/submit',
            body: req.body,
            headers: req.headers, query: req.query,
            tenantId: req.tenant.id, userId: req.user?.id, tenant: req.tenant
        });
        Object.entries(result.headers).forEach(([k,v])=>res.set(k,v));
        res.set('X-Request-ID', result.requestId); res.set('X-Response-Time', `${result.duration}ms`);
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Submit FlightTicket error:', error);
        res.status(500).json({ error: 'Failed to submit flight ticket request', requestId: error.requestId });
    }
};

// On-behalf flight ticket
exports.submitFlightTicketRequestOnBehalf = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'POST',
            path: '/api/flight-ticket/submit-on-behalf',
            body: req.body,
            headers: req.headers, query: req.query,
            tenantId: req.tenant.id, userId: req.user?.id, tenant: req.tenant
        });
        Object.entries(result.headers).forEach(([k,v])=>res.set(k,v));
        res.set('X-Request-ID', result.requestId); res.set('X-Response-Time', `${result.duration}ms`);
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Submit FlightTicket on behalf error:', error);
        res.status(500).json({ error: 'Failed to submit flight ticket on behalf', requestId: error.requestId });
    }
};
