const express = require('express');
const router = express.Router();
const {
    getAllReports,
    getAllReportsByAssignedArea,
    getSingleReport,
    getAllReportsByWardAndDistrict,
    createReport,
    updateReport
} = require('../../controllers/WardAndDistrict/reportProcessingController');

router.route('/').get(getAllReports);
router.route('/area/:area').get(getAllReportsByAssignedArea);
router.route('/ward/:ward').get(getAllReportsByWardAndDistrict);
router.route('/:id').get(getSingleReport);
router.route('/').post(createReport);
router.route('/:id').patch(updateReport);

module.exports = router;
