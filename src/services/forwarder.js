const axios = require('axios');
const FormData = require('form-data');
const logger = require('../utils/logger');
const { performance } = require('perf_hooks');

class RequestForwarder {
  constructor() {
    this.apiGatewayUrl = process.env.API_GATEWAY_URL;
    this.timeout = parseInt(process.env.REQUEST_TIMEOUT) || 30000;
    this.retryAttempts = parseInt(process.env.RETRY_ATTEMPTS) || 3;
    this.retryDelay = parseInt(process.env.RETRY_DELAY) || 1000;
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024; // 50MB default
  }

  /**
   * Forward request to API Gateway with tenant context
   * @param {Object} options - Request options
   * @param {string} options.method - HTTP method
   * @param {string} options.path - API path
   * @param {Object} options.body - Request body
   * @param {Object} options.headers - Request headers
   * @param {Object} options.query - Query parameters
   * @param {string} options.tenantId - Tenant identifier
   * @param {string} options.userId - User identifier
   * @param {Object} options.tenant - Tenant configuration object
   * @returns {Promise<Object>} API response
   */
  async forward(options) {
    const {
      method,
      path,
      body,
      headers,
      query,
      tenantId,
      userId,
      tenant
    } = options;

    const startTime = performance.now();
    const requestId = this.generateRequestId();
    
    try {
      logger.info('Forwarding request to API Gateway', {
        requestId,
        tenantId,
        userId,
        method,
        path,
        isFormData: body instanceof FormData
      });

      // Prepare headers for API Gateway
      const forwardHeaders = this.prepareHeaders(headers, {
        tenantId,
        userId,
        requestId,
        tenant
      });

      // Process placeholders in body and query (skip for FormData)
      const processedBody = body instanceof FormData ? body : this.replacePlaceholders(body, tenant);
      const processedQuery = this.replacePlaceholders(query, tenant);

      // Build complete URL
      const targetUrl = this.buildTargetUrl(path, processedQuery);

      // Configure request options
      const requestConfig = {
        method: method.toUpperCase(),
        url: targetUrl,
        headers: forwardHeaders,
        timeout: this.timeout,
        validateStatus: () => true, // Don't throw on HTTP error status
        maxContentLength: this.maxFileSize,
        maxBodyLength: this.maxFileSize
      };

      // Handle FormData specially
      if (body instanceof FormData) {
        requestConfig.data = body;
        // Remove content-type to let FormData set it with boundary
        delete requestConfig.headers['content-type'];
        delete requestConfig.headers['Content-Type'];
        
        // Add FormData headers
        const formHeaders = body.getHeaders();
        requestConfig.headers = {
          ...requestConfig.headers,
          ...formHeaders
        };
      } else if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && processedBody) {
        requestConfig.data = processedBody;
      }

      // Set response type for potential binary data
      if (path.includes('/download/') || headers.accept?.includes('application/octet-stream')) {
        requestConfig.responseType = 'arraybuffer';
      }

      // Forward request with retry logic
      const response = await this.executeWithRetry(requestConfig);
      
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      // Log successful forwarding
      logger.info('Request forwarded successfully', {
        requestId,
        tenantId,
        statusCode: response.status,
        duration: `${duration}ms`,
        responseType: typeof response.data,
        contentType: response.headers['content-type']
      });

      return {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: this.filterResponseHeaders(response.headers),
        requestId,
        duration
      };

    } catch (error) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      logger.error('Request forwarding failed', {
        requestId,
        tenantId,
        error: error.message,
        duration: `${duration}ms`,
        stack: error.stack,
        errorCode: error.code
      });

      return this.handleForwardingError(error, requestId, duration);
    }
  }

  /**
   * Prepare headers for API Gateway request
   */
  prepareHeaders(originalHeaders, context) {
    const { tenantId, userId, requestId, tenant } = context;
    
    // Filter out hop-by-hop headers
    const filteredHeaders = this.filterRequestHeaders(originalHeaders);
    
    const baseHeaders = {
      'X-Tenant-ID': tenantId,
      'X-User-ID': userId,
      'X-Request-ID': requestId,
      'X-Client-Server': 'frontend-proxy',
      'X-Tenant-Domain': tenant?.domain || '',
      'X-Tenant-Config': tenant?.config ? JSON.stringify(tenant.config) : '{}',
      'X-Forwarded-By': 'frontend-client-server',
      'X-Original-Host': originalHeaders.host
    };

    // Only add content-type and accept if not FormData (FormData will set its own)
    if (!filteredHeaders['content-type']?.includes('multipart/form-data')) {
      baseHeaders['Content-Type'] = originalHeaders['content-type'] || 'application/json';
      baseHeaders['Accept'] = originalHeaders.accept || 'application/json';
    }

    return {
      ...filteredHeaders,
      ...baseHeaders
    };
  }

  /**
   * Replace placeholders in request data with tenant-specific values
   */
  replacePlaceholders(data, tenant) {
    if (!data || !tenant) return data;

    const placeholders = {
      '{{tenant_id}}': tenant.id,
      '{{tenant_domain}}': tenant.domain,
      '{{tenant_database}}': tenant.database,
      '{{tenant_schema}}': tenant.schema,
      '{{api_version}}': tenant.apiVersion || 'v1',
      '{{environment}}': process.env.NODE_ENV || 'development',
      ...tenant.placeholders // Custom tenant placeholders
    };

    return this.deepReplacePlaceholders(data, placeholders);
  }

  /**
   * Recursively replace placeholders in nested objects
   */
  deepReplacePlaceholders(obj, placeholders) {
    if (typeof obj === 'string') {
      let result = obj;
      Object.entries(placeholders).forEach(([placeholder, value]) => {
        result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
      });
      return result;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.deepReplacePlaceholders(item, placeholders));
    }

    if (obj && typeof obj === 'object') {
      const result = {};
      Object.entries(obj).forEach(([key, value]) => {
        result[key] = this.deepReplacePlaceholders(value, placeholders);
      });
      return result;
    }

    return obj;
  }

  /**
   * Build target URL with query parameters
   */
  buildTargetUrl(path, query) {
    let targetUrl = `${this.apiGatewayUrl}${path}`;
    
    if (query && Object.keys(query).length > 0) {
      const queryString = new URLSearchParams(query).toString();
      targetUrl += `?${queryString}`;
    }

    return targetUrl;
  }

  /**
   * Execute request with retry logic
   */
  async executeWithRetry(requestConfig, attempt = 1) {
    try {
      return await axios(requestConfig);
    } catch (error) {
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        logger.warn(`Request failed, retrying (${attempt}/${this.retryAttempts})`, {
          error: error.message,
          attempt,
          errorCode: error.code
        });
        
        await this.delay(this.retryDelay * attempt);
        return this.executeWithRetry(requestConfig, attempt + 1);
      }
      
      throw error;
    }
  }

  /**
   * Determine if request should be retried
   */
  shouldRetry(error) {
    // Don't retry file upload errors or client errors
    if (error.config?.data instanceof FormData) {
      return false;
    }

    // Retry on network errors or 5xx server errors
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
      return true;
    }
    
    if (error.response && error.response.status >= 500) {
      return true;
    }
    
    return false;
  }

  /**
   * Filter request headers (remove hop-by-hop headers)
   */
  filterRequestHeaders(headers) {
    const hopByHopHeaders = [
      'connection',
      'keep-alive',
      'proxy-authenticate',
      'proxy-authorization',
      'te',
      'trailers',
      'transfer-encoding',
      'upgrade',
      'host' // Remove original host
    ];

    const filtered = {};
    Object.entries(headers || {}).forEach(([key, value]) => {
      if (!hopByHopHeaders.includes(key.toLowerCase())) {
        filtered[key] = value;
      }
    });

    return filtered;
  }

  /**
   * Filter response headers
   */
  filterResponseHeaders(headers) {
    const allowedHeaders = [
      'content-type',
      'content-length',
      'content-disposition',
      'cache-control',
      'etag',
      'last-modified',
      'x-rate-limit-remaining',
      'x-rate-limit-reset',
      'access-control-allow-origin',
      'access-control-allow-methods',
      'access-control-allow-headers'
    ];

    const filtered = {};
    Object.entries(headers || {}).forEach(([key, value]) => {
      if (allowedHeaders.includes(key.toLowerCase()) || key.toLowerCase().startsWith('x-custom-')) {
        filtered[key] = value;
      }
    });

    return filtered;
  }

  /**
   * Handle forwarding errors
   */
  handleForwardingError(error, requestId, duration) {
    if (error.response) {
      // API Gateway returned an error response
      return {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: this.filterResponseHeaders(error.response.headers),
        requestId,
        duration,
        error: true
      };
    }

    // Network or other error
    let status = 502;
    let message = 'API Gateway request failed';

    if (error.code === 'ETIMEDOUT') {
      status = 408;
      message = 'Request timeout';
    } else if (error.code === 'ENOTFOUND') {
      status = 502;
      message = 'API Gateway not found';
    } else if (error.code === 'ECONNREFUSED') {
      status = 503;
      message = 'API Gateway connection refused';
    }

    return {
      status,
      statusText: 'Gateway Error',
      data: {
        error: message,
        message: error.message,
        code: error.code
      },
      headers: {},
      requestId,
      duration,
      error: true
    };
  }

  /**
   * Generate unique request ID
   */
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Promise-based delay utility
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Health check for API Gateway connectivity
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${this.apiGatewayUrl}/health`, {
        timeout: 5000
      });
      return {
        status: 'healthy',
        gateway: response.status === 200,
        responseTime: response.headers['x-response-time'] || 'unknown'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        gateway: false,
        error: error.message,
        code: error.code
      };
    }
  }

  /**
   * Get forwarder statistics
   */
  getStats() {
    return {
      apiGatewayUrl: this.apiGatewayUrl,
      timeout: this.timeout,
      retryAttempts: this.retryAttempts,
      retryDelay: this.retryDelay,
      maxFileSize: this.maxFileSize
    };
  }
}

module.exports = new RequestForwarder();
