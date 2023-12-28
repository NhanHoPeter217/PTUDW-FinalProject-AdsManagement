const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../../middleware/authentication');
const {
    getAllReportFormats,
    createReportFormat,
    updateReportFormat,
    deleteReportFormat
} = require('../../controllers/Department/reportFormatController');

router.use(authenticateUser);
router.use(authorizePermissions('Sở VH-TT'));

router.route('/').get(getAllReportFormats);
router.route('/').post(createReportFormat);
router.route('/:id').patch(updateReportFormat);
router.route('/:id').delete(deleteReportFormat);

module.exports = router;
