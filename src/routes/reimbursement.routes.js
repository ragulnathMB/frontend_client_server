const express = require('express');
const multer = require('multer');
const reimbursementController = require('../controllers/reimbursement.controller');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/submit', upload.single('receipt'), reimbursementController.submitReimbursement);
router.get('/history/:empId', reimbursementController.getReimbursementHistory);
router.get('/status/:empId', reimbursementController.getReimbursementStatus);
router.put('/:reimbursementId/action', reimbursementController.approveRejectReimbursement);
router.get('/types', reimbursementController.getReimbursementTypes);
router.get('/pending/:managerId', reimbursementController.getPendingReimbursements);
router.delete('/:reimbursementId/cancel', reimbursementController.cancelReimbursement);
router.get('/:reimbursementId', reimbursementController.getReimbursementById);
router.get('/:reimbursementId/receipt/:receiptId', reimbursementController.downloadReceipt);
router.get('/summary/:empId', reimbursementController.getReimbursementSummary);

module.exports = router;
