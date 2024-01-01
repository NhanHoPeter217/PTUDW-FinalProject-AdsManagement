const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../../middleware/authentication');
const {
    getAllReportFormats,
    createReportFormat,
    updateReportFormat,
    deleteReportFormat
} = require('../../controllers/Department/reportFormatController');

// Người dân có thể lấy ReportFormat
router.route('/').get(getAllReportFormats);

router.use(authenticateUser);
router.use(authorizePermissions('Sở VH-TT'));

router.route('/').post(createReportFormat);
router.route('/:id').patch(updateReportFormat);
router.route('/:id').delete(deleteReportFormat);

module.exports = router;
