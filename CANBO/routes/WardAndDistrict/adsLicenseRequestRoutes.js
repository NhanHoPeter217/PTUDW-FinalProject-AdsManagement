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

router.route('/').get(getAllAdsLicenseRequests);
router.route('/').post(createAdsLicenseRequest);
router.route('/:id').get(getSingleAdsLicenseRequest);
router.route('/area/:area').get(getAdsLicenseRequestsByAssignedArea);
router.route('/ward/:ward').get(getAdsLicenseRequestsByWardAndDistrict);
router.route('/:id').patch(updateAdsLicenseRequest);

module.exports = router;
