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

const { authenticateResident, authenticateUser, authorizePermissions } = require('../../middleware/authentication');

router.use(authenticateUser);

router.route('/').get(authorizePermissions('Sở VH-TT'), getAllReports);
router.route('/').get(authorizePermissions('Phường', 'Quận'), getAllReportsByAssignedArea);
router.route('dist/:dist/ward/:ward').get(authorizePermissions('Sở VH-TT'), getAllReportsByWardAndDistrict);
router.route('/:id').get(authorizePermissions('Sở VH-TT'), getSingleReport);
router.route('/').post(createReport);
router.route('/:id').patch(authorizePermissions('Phường', 'Quận'), updateReport);

module.exports = router;
