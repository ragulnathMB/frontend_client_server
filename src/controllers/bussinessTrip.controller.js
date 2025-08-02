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
// Edit Business Trip Request (PATCH)
exports.editBusinessTripRequest = async (req, res) => {
    try {
        const { businessTripReqId } = req.params;
        let requestBody = req.body;
        let requestHeaders = req.headers;

        // If there's a file attachment, prepare FormData
        if (req.file) {
            const formData = new FormData();
            // Append all fields except files
            Object.entries(req.body).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    // If value is an object or array, stringify it
                    if (typeof value === 'object') {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value);
                    }
                }
            });
            // Append the attachment
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
            path: `/business-trip/${businessTripReqId}`,
            body: requestBody,
            headers: requestHeaders,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant,
        });

        // Forward response headers
        Object.entries(result.headers).forEach(([key, val]) => res.set(key, val));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Edit Business Trip request error:', error);
        res.status(500).json({
            error: 'Failed to edit Business Trip request',
            requestId: error.requestId,
        });
    }
};

// Save Business Trip Request as Draft (POST)
exports.draftSaveBusinessTripRequest = async (req, res) => {
    try {
        let requestBody = req.body;
        let requestHeaders = req.headers;

        if (req.file) {
            const formData = new FormData();
            Object.entries(req.body).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (typeof value === 'object') {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value);
                    }
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
            path: `/business-trip/draft-save`,
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
        logger.error('Save Business Trip draft error:', error);
        res.status(500).json({
            error: 'Failed to save Business Trip request draft',
            requestId: error.requestId,
        });
    }
};
// controllers/businessTrip.controller.js
exports.delegateBusinessTripApproval = async (req, res) => {
    try {
        const { reqID } = req.params;
        const { empID: delegateEmpId, comment } = req.body;
        const body = { empID: delegateEmpId, comment };

        const result = await forwarder.forward({
            method: 'POST',
            path: `/api/business-trip/${reqID}/delegate`,
            body,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id, userId: req.user?.id, tenant: req.tenant
        });
        Object.entries(result.headers).forEach(([k,v])=>res.set(k,v));
        res.set('X-Request-ID', result.requestId); 
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Delegate business trip approval error:', error);
        res.status(500).json({ error: 'Failed to delegate business trip approval', requestId: error.requestId });
    }
};
exports.changeBusinessTripApproval = async (req, res) => {
    try {
        const { reqID } = req.params;
        const { comments, empID } = req.body;
        const body = { comments, empID };

        const result = await forwarder.forward({
            method: 'PATCH',
            path: `/api/business-trip/${reqID}/change-request`,
            body,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id, userId: req.user?.id, tenant: req.tenant
        });
        Object.entries(result.headers).forEach(([k,v])=>res.set(k,v));
        res.set('X-Request-ID', result.requestId); 
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Change business trip approval error:', error);
        res.status(500).json({ error: 'Failed to request change on business trip approval', requestId: error.requestId });
    }
};
exports.approveRejectBusinessTripRequest = async (req, res) => {
    try {
        const { reqID } = req.params;
        const { comments, empID } = req.body;

        const body = { comments, empID };

        const result = await forwarder.forward({
            method: 'PATCH',
            path: `/api/business-trip/${reqID}/approve-reject`,
            body,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id, userId: req.user?.id, tenant: req.tenant
        });

        Object.entries(result.headers).forEach(([k,v])=>res.set(k,v));
        res.set('X-Request-ID', result.requestId); 
        res.set('X-Response-Time', `${result.duration}ms`);

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Approve/reject business trip error:', error);
        res.status(500).json({ error: 'Failed to process business trip approval/rejection', requestId: error.requestId });
    }
};

exports.getPendingBusinessTripRequestDetails = async (req, res) => {
  try {
    const { requestId } = req.params;

    const result = await forward({
      method: 'GET',
      path: `/business-trip/${requestId}/details`,
      headers: req.headers,
      query: req.query,
      tenantId: req.tenant.id,
      userId: req.user?.id,
      tenant: req.tenant,
    });

    // Expect that the backend API includes forwardedBy info where applicable

    Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
    res.set('X-Request-ID', result.requestId);
    res.set('X-Response-Time', `${result.duration}ms`);

    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error('Error fetching business trip request details:', error);
    res.status(500).json({
      error: 'Failed to fetch business trip request details',
      requestId: error.requestId || null,
    });
  }
};

exports.getPendingBusinessTripRequests = async (req, res) => {
  try {
    const { managerId } = req.params;

    const result = await forward({
      method: 'GET',
      path: `/business-trip/pending/${managerId}`,
      headers: req.headers,
      query: req.query,
      tenantId: req.tenant.id,
      userId: req.user?.id,
      tenant: req.tenant,
    });

    // Make sure that the backend API adds forwardedBy info where applicable

    Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
    res.set('X-Request-ID', result.requestId);
    res.set('X-Response-Time', `${result.duration}ms`);

    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error('Error fetching pending business trip requests:', error);
    res.status(500).json({
      error: 'Failed to fetch pending business trip requests',
      requestId: error.requestId || null,
    });
  }
};