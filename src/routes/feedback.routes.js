const express = require('express');
const feedbackController = require('../controllers/feedback.controller');
const router = express.Router();

router.post('/submit', feedbackController.submitFeedback);
router.get('/history/:empId', feedbackController.getFeedbackHistory);
router.get('/received/:empId', feedbackController.getReceivedFeedback);
router.get('/:feedbackId', feedbackController.getFeedbackById);
router.put('/:feedbackId', feedbackController.updateFeedback);
router.delete('/:feedbackId', feedbackController.deleteFeedback);
router.get('/types', feedbackController.getFeedbackTypes);
router.get('/analytics/:empId', feedbackController.getFeedbackAnalytics);
router.post('/:feedbackId/respond', feedbackController.respondToFeedback);
router.put('/:feedbackId/read', feedbackController.markFeedbackAsRead);
router.get('/team/:managerId', feedbackController.getTeamFeedback);
router.post('/generate-report', feedbackController.generateFeedbackReport);

module.exports = router;
