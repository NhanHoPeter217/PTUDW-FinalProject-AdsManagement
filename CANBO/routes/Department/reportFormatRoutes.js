const express = require('express');
const router = express.Router();
const {
    getAllReportFormats,
    createReportFormat,
    updateReportFormat,
    deleteReportFormat
} = require('../../controllers/Department/adsFormatController');

router.route('/').get(getAllReportFormats);
router.route('/').post(createReportFormat);
router.route('/:id').patch(updateReportFormat);
router.route('/:id').delete(deleteReportFormat);

module.exports = router;
