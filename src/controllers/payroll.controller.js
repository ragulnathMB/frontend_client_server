const forwarder = require('../services/forwarder');
const logger = require('../utils/logger');

exports.getPayslip = async (req, res) => {
    try {
        const { empId } = req.params;
        const { month, year } = req.query;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/payroll/${empId}/payslip`,
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
        logger.error('Payslip fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch payslip',
            requestId: error.requestId 
        });
    }
};

exports.getPayslipHistory = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/payroll/${empId}/history`,
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
        logger.error('Payslip history error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch payslip history',
            requestId: error.requestId 
        });
    }
};

exports.updateBankDetails = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/payroll/${empId}/bank-details`,
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

        // Log bank details update
        if (result.status === 200) {
            logger.info('Bank details updated successfully', {
                empId,
                tenantId: req.tenant.id,
                updatedBy: req.user?.id
            });
        }

        return res.status(result.status).json(result.data);
    } catch (error) {
        logger.error('Bank details update error:', error);
        res.status(500).json({ 
            error: 'Failed to update bank details',
            requestId: error.requestId 
        });
    }
};

exports.downloadPayslip = async (req, res) => {
    try {
        const { empId, payslipId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/payroll/${empId}/payslip/${payslipId}/download`,
            headers: req.headers,
            query: req.query,
            tenantId: req.tenant.id,
            userId: req.user?.id,
            tenant: req.tenant
        });

        // For file downloads, handle binary content
        if (result.status === 200) {
            const contentType = result.headers['content-type'] || 'application/pdf';
            const contentDisposition = result.headers['content-disposition'] || 
                `attachment; filename="payslip_${empId}_${payslipId}.pdf"`;
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
        logger.error('Payslip download error:', error);
        res.status(500).json({ 
            error: 'Failed to download payslip',
            requestId: error.requestId 
        });
    }
};

exports.getSalaryBreakdown = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/payroll/${empId}/salary-breakdown`,
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
        logger.error('Salary breakdown error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch salary breakdown',
            requestId: error.requestId 
        });
    }
};

exports.getTaxDocuments = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/payroll/${empId}/tax-documents`,
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
        logger.error('Tax documents error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch tax documents',
            requestId: error.requestId 
        });
    }
};

exports.getPayrollSummary = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/payroll/${empId}/summary`,
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
        logger.error('Payroll summary error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch payroll summary',
            requestId: error.requestId 
        });
    }
};

exports.getBankDetails = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'GET',
            path: `/api/payroll/${empId}/bank-details`,
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
        logger.error('Bank details fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch bank details',
            requestId: error.requestId 
        });
    }
};

exports.generatePayrollReport = async (req, res) => {
    try {
        const result = await forwarder.forward({
            method: 'POST',
            path: '/api/payroll/admin/generate-report',
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
        logger.error('Payroll report generation error:', error);
        res.status(500).json({ 
            error: 'Failed to generate payroll report',
            requestId: error.requestId 
        });
    }
};

exports.updateSalaryStructure = async (req, res) => {
    try {
        const { empId } = req.params;
        
        const result = await forwarder.forward({
            method: 'PUT',
            path: `/api/payroll/${empId}/salary-structure`,
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
        logger.error('Salary structure update error:', error);
        res.status(500).json({ 
            error: 'Failed to update salary structure',
            requestId: error.requestId 
        });
    }
};
