const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');

router.post('/mark', attendanceController.markAttendance);
router.get('/status', attendanceController.getDailyStatus);
router.get('/history', attendanceController.getAttendanceHistory);
router.get('/summary', attendanceController.getMonthlySummary);
router.put('/update', attendanceController.updateAttendance); 
router.get('/getCheckinCheckoutTime',attendanceController.getCheckinCheckoutTime)
router.get('/getCheckinCheckoutHistory',attendanceController.getCheckinCheckoutHistory)

module.exports = router;
