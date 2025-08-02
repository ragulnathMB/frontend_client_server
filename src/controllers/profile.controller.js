const forwarder = require('../services/forwarder');
const logger = require('../utils/logger');
const FormData = require('form-data');

exports.getProfile = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/profile/${empId}`,
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
        logger.error('Profile fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch profile',
            requestId: error.requestId 
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/profile/${empId}`,
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

        // Log profile update
        if (result.status === 200) {
            logger.info('Profile updated successfully', {
                empId,
                tenantId: req.tenant.id,
                updatedBy: req.user?.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Profile update error:', error);
        res.status(500).json({ 
            error: 'Failed to update profile',
            requestId: error.requestId 
        });
    }
};

exports.uploadPhoto = async (req, res) => {
    try {
        const { empId } = req.params;
        
        if (!req.file) {
            return res.status(400).json({ error: 'No photo uploaded' });
        }
        
        // Client-side validation (before forwarding to API Gateway)
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ 
                error: 'Invalid file type. Only JPEG, PNG, JPG, and GIF are allowed.' 
            });
        }
        
        // Validate file size (5MB limit)
        if (req.file.size > 5 * 1024 * 1024) {
            return res.status(400).json({ 
                error: 'File size exceeds 5MB limit' 
            });
        }

        // Create FormData for photo upload
        const formData = new FormData();
        formData.append('photo', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });
        formData.append('empId', empId);

        const result = await forwarder.forward({
            method: 'POST',
            path: `/api/profile/${empId}/photo`,
            body: formData,
            headers: {
                ...req.headers,
                ...formData.getHeaders()
            },
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

        // Log photo upload
        if (result.status === 200) {
            logger.info('Photo uploaded successfully', {
                empId,
                fileName: req.file.originalname,
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Photo upload error:', error);
        res.status(500).json({ 
            error: 'Failed to upload photo',
            requestId: error.requestId 
        });
    }
};

exports.getPhoto = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/profile/${empId}/photo`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // For photo downloads, handle binary content
        if (result.status === 200) {
            const contentType = result.headers['content-type'] || 'image/jpeg';
            const contentLength = result.headers['content-length'];
            const cacheControl = result.headers['cache-control'] || 'public, max-age=86400';

            res.set({
                'Content-Type': contentType,
                'Content-Length': contentLength,
                'Cache-Control': cacheControl,
                'X-Request-ID': result.requestId,
                'X-Response-Time': `${result.duration}ms`
            });

            // Forward other relevant headers
            Object.entries(result.headers).forEach(([key, value]) => {
                if (!['content-type', 'content-length', 'cache-control'].includes(key.toLowerCase())) {
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
        logger.error('Photo fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch photo',
            requestId: error.requestId 
        });
    }
};

exports.deletePhoto = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'DELETE',
            path: `/api/profile/${empId}/photo`,
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

        // Log photo deletion
        if (result.status === 200) {
            logger.info('Photo deleted successfully', {
                empId,
                tenantId: req.tenant.id,
                deletedBy: req.user?.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Photo delete error:', error);
        res.status(500).json({ 
            error: 'Failed to delete photo',
            requestId: error.requestId 
        });
    }
};

exports.getEmploymentSummary = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/profile/${empId}/employment-summary`,
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
        logger.error('Employment summary error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch employment summary',
            requestId: error.requestId 
        });
    }
};

exports.getPersonalInfo = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/profile/${empId}/personal-info`,
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
        logger.error('Personal info fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch personal information',
            requestId: error.requestId 
        });
    }
};

exports.updatePersonalInfo = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/profile/${empId}/personal-info`,
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
        logger.error('Personal info update error:', error);
        res.status(500).json({ 
            error: 'Failed to update personal information',
            requestId: error.requestId 
        });
    }
};

exports.getContactInfo = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/profile/${empId}/contact-info`,
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
        logger.error('Contact info fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch contact information',
            requestId: error.requestId 
        });
    }
};

exports.updateContactInfo = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/profile/${empId}/contact-info`,
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
        logger.error('Contact info update error:', error);
        res.status(500).json({ 
            error: 'Failed to update contact information',
            requestId: error.requestId 
        });
    }
};
exports.getProfileSummary = async (req, res) => {
    try {
        const { empId } = req.params; // Should be the current user's employee ID

        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/profile/${empId}/summary`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        Object.entries(result.headers).forEach(([key, value]) => res.set(key, value));
        res.set('X-Request-ID', result.requestId);
        res.set('X-Response-Time', `${result.duration}ms`);

        // The API Gateway should ensure the response contains: name, empId, role, department
        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Profile summary fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch profile summary',
            requestId: error.requestId
        });
    }
};

exports.getCalendar = async (req, res) => {
  try {
    const { month, year } = req.body;

    if (!month || !year) {
      return res.status(400).json({ error: 'month and year are required' });
    }

    const result = await forward({
      method: 'POST',
      path: '/calendar',
      body: { month, year },
      headers: req.headers,
      tenantId: req.tenant.id,
      userId: req.user?.id,
      tenant: req.tenant,
    });

    // Response contains array of events (leaves, excuses, trips) with dates

    Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
    res.set('X-Request-ID', result.requestId);
    res.set('X-Response-Time', `${result.duration}ms`);

    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error('Failed to fetch calendar:', error);
    res.status(500).json({
      error: 'Failed to fetch calendar',
      requestId: error.requestId,
    });
  }
};