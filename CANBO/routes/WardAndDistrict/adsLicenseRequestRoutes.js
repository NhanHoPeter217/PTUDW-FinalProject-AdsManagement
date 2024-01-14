const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../../middleware/authentication');

const {
    createAdsLicenseRequest,
    getAllAdsLicenseRequests,
    getSingleAdsLicenseRequest,
    getAdsLicenseByAssignedArea,
    getAllAdsLicenseByAssignedArea,
    getAdsLicenseRequestsByWardAndDistrict,
    updateAdsLicenseRequestByAssignedArea,
    updateAdsLicenseRequestByDepartmentOfficier
} = require('../../controllers/WardAndDistrict/adsLicenseRequestController');

router.use(authenticateUser);

router.route('/').get(authenticateUser, authorizePermissions('Sở VH-TT'), getAllAdsLicenseRequests);

router
    .route('/assignedArea')
    .get(authenticateUser, authorizePermissions('Phường', 'Quận'), getAdsLicenseByAssignedArea);

router
    .route('/assignedArea')
    .post(authenticateUser, authorizePermissions('Quận', 'Sở VH-TT'), getAllAdsLicenseByAssignedArea);

router
    .route('/dist/:distID/ward/:wardID')
    .get(authorizePermissions('Sở VH-TT'), getAdsLicenseRequestsByWardAndDistrict);

router.route('/assignedArea/:id').patch(updateAdsLicenseRequestByAssignedArea);
router.route('/department/:id').patch(updateAdsLicenseRequestByDepartmentOfficier);
router.route('/:id').post(authorizePermissions('Phường', 'Quận'), createAdsLicenseRequest);
router.route('/:id').get(getSingleAdsLicenseRequest);

module.exports = router;
