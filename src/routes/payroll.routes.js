const express = require('express');
const payrollController = require('../controllers/payroll.controller');
const router = express.Router();

router.get('/:empId/payslip', payrollController.getPayslip);
router.get('/:empId/history', payrollController.getPayslipHistory);
router.put('/:empId/bank-details', payrollController.updateBankDetails);
router.get('/:empId/payslip/:payslipId/download', payrollController.downloadPayslip);
router.get('/:empId/salary-breakdown', payrollController.getSalaryBreakdown);
router.get('/:empId/tax-documents', payrollController.getTaxDocuments);
router.get('/:empId/summary', payrollController.getPayrollSummary);
router.get('/:empId/bank-details', payrollController.getBankDetails);
router.post('/admin/generate-report', payrollController.generatePayrollReport);
router.put('/:empId/salary-structure', payrollController.updateSalaryStructure);

module.exports = router;
