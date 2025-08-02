// controllers/team.controller.js

const { forward } = require('../services/forwarder');
const logger = require('../utils/logger');

exports.getTeamHierarchy = async (req, res) => {
  try {
    const { userId } = req.params; // Current user's id to fetch hierarchy
    
    const result = await forward({
      method: 'GET',
      path: `/team/hierarchy/${userId}`,
      headers: req.headers,
      query: req.query,
      tenantId: req.tenant.id,
      userId: req.user?.id,
      tenant: req.tenant,
    });

    // Response is expected to be an array of employees:
    // [{ employeeId, name, position, department }, ...]

    Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
    res.set('X-Request-ID', result.requestId);
    res.set('X-Response-Time', `${result.duration}ms`);
  
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error('Failed to fetch team hierarchy:', error);
    res.status(500).json({
      error: 'Failed to fetch team hierarchy',
      requestId: error.requestId,
    });
  }
};

exports.getTeamCalendar = async (req, res) => {
  try {
    // Expects from and to dates in request body
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({ error: 'from and to dates are required' });
    }

    const result = await forward({
      method: 'POST',
      path: '/team/calendar',
      body: { from, to },
      headers: req.headers,
      tenantId: req.tenant.id,
      userId: req.user?.id,
      tenant: req.tenant,
    });

    // Response will include employees with their leave/excuse/business trip data within dates

    Object.entries(result.headers).forEach(([k, v]) => res.set(k, v));
    res.set('X-Request-ID', result.requestId);
    res.set('X-Response-Time', `${result.duration}ms`);

    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error('Failed to fetch team calendar:', error);
    res.status(500).json({
      error: 'Failed to fetch team calendar',
      requestId: error.requestId,
    });
  }
};