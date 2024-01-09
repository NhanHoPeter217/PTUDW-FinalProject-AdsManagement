const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../../middleware/authentication');

const {
    createAdsLicenseRequest,
    getAllAdsLicenseRequests,
    getSingleAdsLicenseRequest,
    getAdsLicenseRequestsByAssignedArea,
    getAdsLicenseRequestsByWardAndDistrict,
    updateAdsLicenseRequest
} = require('../../controllers/WardAndDistrict/adsLicenseRequestController');

router.use(authenticateUser);

router.route('/').get(authorizePermissions('Sở VH-TT'), getAllAdsLicenseRequests);

router
    .route('/assignedArea')
    .get(authorizePermissions('Phường', 'Quận'), getAdsLicenseRequestsByAssignedArea);
router
    .route('/dist/:distID/ward/:wardID')
    .get(authorizePermissions('Sở VH-TT'), getAdsLicenseRequestsByWardAndDistrict);

router.route('/:id').post(authorizePermissions('Phường', 'Quận'), createAdsLicenseRequest);
router.route('/:id').get(authorizePermissions('Sở VH-TT'), getSingleAdsLicenseRequest);
router.route('/:id').patch(updateAdsLicenseRequest);

module.exports = router;
