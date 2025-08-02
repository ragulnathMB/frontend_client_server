const express = require('express');
const flightTicketController = require('../controllers/flightTicket.controller');
const router = express.Router();

router.get('/getFlightTicketRequestDetails',flightTicketController.getFlightTicketRequestDetails)
router.get('/getFlightTicketTransactions',flightTicketController.getFlightTicketTransactions)
router.post('/submitFlightTicketRequest',flightTicketController.submitFlightTicketRequest)
router.post('/submitFlightTicketRequestOnBehalf',flightTicketController.submitFlightTicketRequestOnBehalf)
router.patch('/editFlightTicketRequest',flightTicketController.editFlightTicketRequest)
router.post('/draftSaveFlightTicketRequest',flightTicketController.draftSaveFlightTicketRequest)
router.post('/delegateFlightTicketApproval',flightTicketController.delegateFlightTicketApproval)
router.patch('/changeFlightRequestApproval',flightTicketController.changeFlightTicketApproval)
router.patch('/approveRejectFlightTicketRequest',flightTicketController.approveRejectFlightTicketRequest)
router.get('/getPendingFlightTicketRequestDetails',flightTicketController.getPendingFlightTicketRequestsDetails)
router.get('/getPendingFlightTicketRequests',flightTicketController.getPendingFlightTicketRequests)

module.exports = router;
