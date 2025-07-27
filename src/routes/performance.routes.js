const express = require('express');
const performanceController = require('../controllers/performance.controller');
const router = express.Router();

router.post('/:empId/self-evaluation', performanceController.submitSelfEvaluation);
router.get('/:empId/feedback', performanceController.getFeedback);
router.post('/:empId/manager-feedback', performanceController.submitManagerFeedback);
router.get('/:empId/reviews', performanceController.getPerformanceReviews);
router.post('/:empId/goals', performanceController.createPerformanceGoal);
router.put('/:empId/goals/:goalId', performanceController.updatePerformanceGoal);
router.get('/:empId/goals', performanceController.getPerformanceGoals);
router.get('/:empId/metrics', performanceController.getPerformanceMetrics);
router.get('/:empId/peer-feedback', performanceController.getPeerFeedback);
router.post('/:empId/peer-feedback', performanceController.submitPeerFeedback);
router.post('/:empId/generate-report', performanceController.generatePerformanceReport);

module.exports = router;
