const express = require('express');
const multer = require('multer');
const reimbursementController = require('../controllers/reimbursement.controller');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/submitReimbursement', upload.single('receipt'), reimbursementController.submitReimbursement);
router.get('/getReimbursementHistory', reimbursementController.getReimbursementHistory);
router.get('/getReimbursementStatus', reimbursementController.getReimbursementStatus);
router.put('/action', reimbursementController.approveRejectReimbursement);
router.get('/getReimbursementTypes', reimbursementController.getReimbursementTypes);
router.get('/getPendingReimbursements', reimbursementController.getPendingReimbursements);
router.delete('/cancelReibursement', reimbursementController.cancelReimbursement);
router.get('/getReimbursementById', reimbursementController.getReimbursementById);
router.get('/downloadReimbursementReceipt', reimbursementController.downloadReceipt);
router.get('/getReimbursementSummary', reimbursementController.getReimbursementSummary);
router.get('/getReimbursementTransactions',reimbursementController.getReimbursementTransactions)
router.get('/getReimbursementRequestDetails',reimbursementController.getReimbursementRequestDetails)
router.post('/submitReimbursementRequest',reimbursementController.submitReimbursementRequest)
router.post('/submitReimbursementRequestOnBehalf',reimbursementController.submitReimbursementRequestOnBehalf)

module.exports = router;
