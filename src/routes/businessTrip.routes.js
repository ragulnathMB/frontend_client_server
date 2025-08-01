const express = require('express');
const router = express.Router();
const businessTripController = require('../controllers/bussinessTrip.controller');

router.get('/getBusinessTripRequestDetails',businessTripController.getBusinessTripRequestDetails)
router.get('/getBusinessTripTransactions',businessTripController.getBusinessTripTransactions)
router.post('/submitBusinessTripRequest',businessTripController.submitBusinessTripRequest)
router.post('/submitBusinessTripRequestOnBehalf',businessTripController.submitBusinessTripRequestOnBehalf)

module.exports = router;
