const express = require('express');

const router = express.Router();
// const { createReport } = require('../controllers/report');
const { authenticateResident } = require('../middleware/authentication');
const { getAllReports, getAllReportsByAssignedArea, createReportProcessing } = require('../controllers/report');

router.route('/').get(getAllReports);
// router.route('/').post(authenticateResident, createReport);
router.route('/').get(getAllReportsByAssignedArea);
router.route('/').get(createReportProcessing);

module.exports = router;
