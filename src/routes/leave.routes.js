const express = require('express');
const leaveController = require('../controllers/leave.controller');
const { route } = require('./dashboard.routes');
const router = express.Router();

router.post('/apply', leaveController.applyLeave);
router.get('/balance', leaveController.getLeaveBalance);
router.get('/history', leaveController.getLeaveHistory);
router.get('/types', leaveController.getLeaveTypes);
router.get('/status', leaveController.getLeaveStatus);
router.delete('/cancelLeave', leaveController.cancelLeave);
router.put('/action', leaveController.approveRejectLeave);
router.get('/getPendingLeaves', leaveController.getPendingLeaves);
router.get('/getLeavesById', leaveController.getLeaveById);
router.put('/updatedLeave', leaveController.updateLeave);
router.get('/getLeaveRequestTransactions',leaveController.getLeaveRequestTransactions)
router.get('/getLeaveRequestDetails',leaveController.getLeaveRequestDetails)
router.post('/submitLeave',leaveController.submitLeave)
router.post('/submitLeaveOnBehalf',leaveController.submitLeaveOnBehalf)
router.get('/getPendingLeaves',leaveController.getPendingLeaves)

module.exports = router;
