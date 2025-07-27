const express = require('express');
const managerController = require('../controllers/manager.controller');
const router = express.Router();

router.get('/:managerId/team', managerController.getTeam);
router.post('/bulk-approve', managerController.bulkApprove);
router.get('/:managerId/pending-approvals', managerController.getPendingApprovals);
router.get('/:managerId/team/:empId', managerController.getTeamMemberDetails);
router.get('/:managerId/dashboard', managerController.getManagerDashboard);
router.get('/:managerId/team/attendance-summary', managerController.getTeamAttendanceSummary);
router.get('/:managerId/team/search', managerController.searchTeamMembers);
router.post('/:managerId/assign-task', managerController.assignTask);
router.put('/:managerId/team/:empId', managerController.updateTeamMember);
router.get('/:managerId/team/performance', managerController.getTeamPerformance);

module.exports = router;
