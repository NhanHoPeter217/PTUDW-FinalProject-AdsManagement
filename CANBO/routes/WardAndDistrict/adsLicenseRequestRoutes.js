const express = require('express');
const router = express.Router();
const {
    createAdsLicenseRequest,
    getAllAdsLicenseRequests,
    getSingleAdsLicenseRequest,
    getAdsLicenseRequestsByAssignedArea,
    getAdsLicenseRequestsByWardAndDistrict,
    updateAdsLicenseRequest
} = require('../../controllers/WardAndDistrict/adsLicenseRequestController');

const { authenticateUser, authorizePermissions } = require('../../middleware/authentication');

router.use(authenticateUser);

router.route('/').get(authorizePermissions('Sở VH-TT'), getAllAdsLicenseRequests);
router.route('/:id').post(authorizePermissions('Phường', 'Quận'), createAdsLicenseRequest);
router.route('/:id').get(authorizePermissions('Sở VH-TT'), getSingleAdsLicenseRequest);
router
    .route('/area/:area')
    .get(authorizePermissions('Phường', 'Quận'), getAdsLicenseRequestsByAssignedArea);
router
    .route('/dist/:dist/ward/:ward')
    .get(authorizePermissions('Sở VH-TT'), getAdsLicenseRequestsByWardAndDistrict);
router.route('/:id').patch(updateAdsLicenseRequest);

module.exports = router;
