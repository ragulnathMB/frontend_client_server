const forwarder = require('../services/forwarder');
const logger = require('../utils/logger');
const FormData = require('form-data');

exports.uploadDocument = async (req, res) => {
    try {
        const { empId } = req.params;
        const { documentType } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });
        formData.append('documentType', documentType);
        formData.append('empId', empId);

        const result = await forwarder.forward({
            method: 'POST',
            path: `/api/documents/${empId}/upload`,
            body: formData,
            headers: {
                ...req.headers,
                ...formData.getHeaders() // Add multipart headers
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

        // Log document upload
        if (result.status === 200 && result.data) {
            logger.info('Document uploaded successfully', {
                empId,
                documentType,
                fileName: req.file.originalname,
                fileSize: req.file.size,
                documentId: result.data.documentId,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Document upload error:', error);
        res.status(500).json({ 
            error: 'Failed to upload document',
            requestId: error.requestId 
        });
    }
};

exports.getAllDocuments = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/documents/${empId}`,
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
        logger.error('Documents fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch documents',
            requestId: error.requestId 
        });
    }
};

exports.downloadDocument = async (req, res) => {
    try {
        const { empId, docId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/documents/${empId}/download/${docId}`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // For file downloads, we need to handle binary content differently
        if (result.status === 200) {
            // Set headers for file download
            const contentType = result.headers['content-type'] || 'application/octet-stream';
            const contentDisposition = result.headers['content-disposition'] || 
                `attachment; filename="document_${docId}"`;
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

            // Send the file content
            return res.send(result.data);
        } else {
            // Handle error responses
            res.set('X-Request-ID', result.requestId);
            res.set('X-Response-Time', `${result.duration}ms`);
            return res.status(result.status).json(result.data);
        }
    } catch (error) {
        logger.error('Document download error:', error);
        res.status(500).json({ 
            error: 'Failed to download document',
            requestId: error.requestId 
        });
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        const { empId, docId } = req.params;
        
        const result = await forwarder.forward({
            method: 'DELETE',
            path: `/api/documents/${empId}/${docId}`,
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

        // Log document deletion
        if (result.status === 200) {
            logger.info('Document deleted successfully', {
                empId,
                docId,
                tenantId: req.tenant.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Document delete error:', error);
        res.status(500).json({ 
            error: 'Failed to delete document',
            requestId: error.requestId 
        });
    }
};

exports.getDocumentById = async (req, res) => {
    try {
        const { empId, docId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/documents/${empId}/${docId}`,
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
        logger.error('Document fetch by ID error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch document',
            requestId: error.requestId 
        });
    }
};

exports.updateDocumentMetadata = async (req, res) => {
    try {
        const { empId, docId } = req.params;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/documents/${empId}/${docId}/metadata`,
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
        logger.error('Document metadata update error:', error);
        res.status(500).json({ 
            error: 'Failed to update document metadata',
            requestId: error.requestId 
        });
    }
};
