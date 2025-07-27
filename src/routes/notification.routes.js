const express = require('express');
const notificationController = require('../controllers/notification.controller');
const router = express.Router();

router.get('/:empId', notificationController.getNotifications);
router.get('/:empId/unread', notificationController.getUnreadNotifications);
router.put('/:notificationId/read', notificationController.markAsRead);
router.put('/:empId/read-all', notificationController.markAllAsRead);
router.delete('/:notificationId', notificationController.deleteNotification);
router.post('/', notificationController.createNotification);
router.post('/broadcast', notificationController.broadcastNotification);
router.get('/admin/all', notificationController.getAllNotifications);
router.delete('/admin/:notificationId', notificationController.deleteNotificationAdmin);
router.get('/:empId/settings', notificationController.getNotificationSettings);
router.put('/:empId/settings', notificationController.updateNotificationSettings);
router.get('/details/:notificationId', notificationController.getNotificationById);
router.get('/:empId/stats', notificationController.getNotificationStats);

module.exports = router;
