const express = require('express');
const multer = require('multer');
const profileController = require('../controllers/profile.controller');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/:empId', profileController.getProfile);
router.put('/:empId', profileController.updateProfile);
router.post('/:empId/photo', upload.single('photo'), profileController.uploadPhoto);
router.get('/:empId/photo', profileController.getPhoto);
router.delete('/:empId/photo', profileController.deletePhoto);
router.get('/:empId/employment-summary', profileController.getEmploymentSummary);
router.get('/:empId/personal-info', profileController.getPersonalInfo);
router.put('/:empId/personal-info', profileController.updatePersonalInfo);
router.get('/:empId/contact-info', profileController.getContactInfo);
router.put('/:empId/contact-info', profileController.updateContactInfo);

module.exports = router;
