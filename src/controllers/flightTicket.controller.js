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
 
exports.editFlightTicketRequest = async (req, res) => {
    try {
        const { flightTicketReqId } = req.params;
        let requestBody = req.body;
        let requestHeaders = req.headers;

        // Handle file attachment if present
        if (req.file) {
            const formData = new FormData();

            // Append all body fields except files
            Object.entries(req.body).forEach(([key, value]) => {
                // If value is an object/array, stringify it (e.g., passengers list)
                if (typeof value === 'object' && value !== null) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });

            // Attach the file
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
            path: `/flight-ticket/${flightTicketReqId}`,
            body: requestBody,
            headers: requestHeaders,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant,
        });

        Object.entries(result.headers).forEach(([key, val]) => res.set(key, val));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Edit flight ticket request error:', error);
        res.status(500).json({
            error: 'Failed to edit flight ticket request',
            requestId: error.requestId,
        });
    }
};

/**
 * Save a flight ticket request as draft
 * POST /flight-ticket/draft-save
 */
exports.draftSaveFlightTicketRequest = async (req, res) => {
    try {
        let requestBody = req.body;
        let requestHeaders = req.headers;

        if (req.file) {
            const formData = new FormData();

            Object.entries(req.body).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });

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
            path: '/flight-ticket/draft-save',
            body: requestBody,
            headers: requestHeaders,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant,
        });

        Object.entries(result.headers).forEach(([key, val]) => res.set(key, val));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Save draft flight ticket request error:', error);
        res.status(500).json({
            error: 'Failed to save draft flight ticket request',
            requestId: error.requestId,
        });
    }
};

exports.delegateFlightTicketApproval = async (req, res) => {
    try {
        const { reqID } = req.params;
        const { empID: delegateEmpId, comment } = req.body;
        const body = { empID: delegateEmpId, comment };

        const result = await forwarder.forward({
            method: 'POST',
            path: `/api/flight-ticket/${reqID}/delegate`,
            body,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id, userId: req.user?.id, tenant: req.tenant,
        });

        Object.entries(result.headers).forEach(([k,v])=>res.set(k,v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Delegate flight ticket approval error:', error);
        res.status(500).json({ error: 'Failed to delegate flight ticket approval', requestId: error.requestId });
    }
};
exports.changeFlightTicketApproval = async (req, res) => {
    try {
        const { reqID } = req.params;
        const { comments, empID } = req.body;
        const body = { comments, empID };

        const result = await forwarder.forward({
            method: 'PATCH',
            path: `/api/flight-ticket/${reqID}/change-request`,
            body,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id, userId: req.user?.id, tenant: req.tenant,
        });

        Object.entries(result.headers).forEach(([k,v])=>res.set(k,v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Change flight ticket approval error:', error);
        res.status(500).json({ error: 'Failed to request change on flight ticket approval', requestId: error.requestId });
    }
};
exports.approveRejectFlightTicketRequest = async (req, res) => {
    try {
        const { reqID } = req.params;
        const { comments, empID } = req.body;
        const body = { comments, empID };

        const result = await forwarder.forward({
            method: 'PATCH',
            path: `/api/flight-ticket/${reqID}/approve-reject`,
            body,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id, tenant: req.tenant,
        });

        Object.entries(result.headers).forEach(([k,v])=>res.set(k,v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Approve/reject flight ticket request error:', error);
        res.status(500).json({ error: 'Failed to process flight ticket approval/rejection', requestId: error.requestId });
    }
};
exports.getPendingFlightTicketRequestsDetails = async (req, res) => {
    try {
        const { flightTicketReqId } = req.params;

        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/flight-ticket/${flightTicketReqId}/details`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id, tenant: req.tenant,
        });

        // Include forwardedBy in response

        Object.entries(result.headers).forEach(([k,v])=>res.set(k,v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Pending flight ticket request details fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch pending flight ticket request details', requestId: error.requestId });
    }
};
// controllers/flightTicket.controller.js
exports.getPendingFlightTicketRequests = async (req, res) => {
    try {
        const { managerId } = req.params;

        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/flight-ticket/pending/${managerId}`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id, userId: req.user?.id, tenant: req.tenant
        });

        // Include forwardedBy in response
        
        Object.entries(result.headers).forEach(([k,v]) => res.set(k,v));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Pending flight ticket requests fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch pending flight ticket requests', requestId: error.requestId });
    }
};
