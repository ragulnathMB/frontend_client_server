const express = require('express');
const multer = require('multer');
const documentController = require('../controllers/document.controller');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/getAllDocuments', documentController.getAllDocuments);
router.get('/getDocumentById', documentController.getDocumentById);
router.get('/downloadDocument', documentController.downloadDocument);
router.post('/uploadDocument', upload.single('document'), documentController.uploadDocument);
router.put('/updateDocumentById', documentController.updateDocumentMetadata);
router.delete('/deleteDocument', documentController.deleteDocument);

module.exports = router;
