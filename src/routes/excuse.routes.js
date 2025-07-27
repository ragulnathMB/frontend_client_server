const express = require('express');
const multer = require('multer');
const excuseController = require('../controllers/excuse.controller');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/submit', upload.single('attachment'), excuseController.submitExcuse);
router.get('/history/:empId', excuseController.getExcuseHistory);
router.get('/status/:empId', excuseController.getExcuseStatus);
router.put('/:excuseId/action', excuseController.approveRejectExcuse);
router.get('/pending/:managerId', excuseController.getPendingExcuses);
router.delete('/:excuseId/cancel', excuseController.cancelExcuse);
router.get('/types', excuseController.getExcuseTypes);
router.get('/:excuseId', excuseController.getExcuseById);
router.get('/:excuseId/attachment/:attachmentId', excuseController.downloadExcuseAttachment);

module.exports = router;
