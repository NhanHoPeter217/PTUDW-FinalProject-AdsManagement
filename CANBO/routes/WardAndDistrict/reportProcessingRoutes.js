const express = require('express');
const router = express.Router();
const {
    getAllReportsByResident,
    getAllReportsByDepartmentOfficer,
    getAllReportsByAssignedArea,
    getSingleReport,
    getAllReportsByWardAndDistrict,
    createReport,
    updateReport
} = require('../../controllers/WardAndDistrict/reportProcessingController');

const {
    authenticateResidentOfCreateReport,
    authenticateResidentOfGetAllReports,
    authenticateUser,
    authorizePermissions
} = require('../../middleware/authentication');

const handleFileUpload = require('../../utils/handleFileUpload');

router.route('/resident/api/v1').post(authenticateResidentOfCreateReport, handleFileUpload, createReport);

router.route('/resident/api/v1').get(authenticateResidentOfGetAllReports, getAllReportsByResident);

router
    .route('/dist/:distID/ward/:wardID')
    .get(authenticateUser, authorizePermissions('Sở VH-TT'), getAllReportsByWardAndDistrict);

router
    .route('/')
    .get(authenticateUser, authorizePermissions('Sở VH-TT'), getAllReportsByDepartmentOfficer);

router
    .route('/assignedArea')
    .get(authenticateUser, authorizePermissions('Phường', 'Quận'), getAllReportsByAssignedArea);

router.route('/:id').get(authenticateUser, getSingleReport);

router.route('/:id').patch(authenticateUser, authorizePermissions('Phường', 'Quận'), updateReport);

module.exports = router;
