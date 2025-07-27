const express = require('express');
const multer = require('multer');
const documentController = require('../controllers/document.controller');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/:empId', documentController.getAllDocuments);
router.get('/:empId/:docId', documentController.getDocumentById);
router.get('/:empId/download/:docId', documentController.downloadDocument);
router.post('/:empId/upload', upload.single('document'), documentController.uploadDocument);
router.put('/:empId/:docId/metadata', documentController.updateDocumentMetadata);
router.delete('/:empId/:docId', documentController.deleteDocument);

module.exports = router;
