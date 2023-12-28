const express = require('express');

const router = express.Router();
// const { createReport } = require('../controllers/report');
const { authenticateResident } = require('../middleware/authentication');
const {
    getAllReports,
    getAllReportsByAssignedArea,
    getSingleReport,
    getAllReportsByWardAndDistrict,
    createReport,
    updateReport
} = require('../controllers/WardAndDistrict/reportProcessingController');

router.route('/').get(getAllReports);
// router.route('/').post(authenticateResident, createReport);
router.route('/').get(getAllReportsByAssignedArea);
router.route('/').get(createReport);

module.exports = router;
