const express = require('express');
const leaveController = require('../controllers/leave.controller');
const router = express.Router();

router.post('/apply', leaveController.applyLeave);
router.get('/balance/:empId', leaveController.getLeaveBalance);
router.get('/history/:empId', leaveController.getLeaveHistory);
router.get('/types', leaveController.getLeaveTypes);
router.get('/status/:empId', leaveController.getLeaveStatus);
router.delete('/:leaveId/cancel', leaveController.cancelLeave);
router.put('/:leaveId/action', leaveController.approveRejectLeave);
router.get('/pending/:managerId', leaveController.getPendingLeaves);
router.get('/:leaveId', leaveController.getLeaveById);
router.put('/:leaveId', leaveController.updateLeave);

module.exports = router;
