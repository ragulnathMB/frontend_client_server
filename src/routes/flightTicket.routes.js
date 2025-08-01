const express = require('express');
const flightTicketController = require('../controllers/flightTicket.controller');
const router = express.Router();

router.get('/getFlightTicketRequestDetails',flightTicketController.getFlightTicketRequestDetails)
router.get('/getFlightTicketTransactions',flightTicketController.getFlightTicketTransactions)
router.post('/submitFlightTicketRequest',flightTicketController.submitFlightTicketRequest)
router.post('/submitFlightTicketRequestOnBehalf',flightTicketController.submitFlightTicketRequestOnBehalf)

module.exports = router;
