const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../../middleware/authentication');
const {
    createAdsPoint,
    getAllAdsPoints,
    // getAllAdsPointsByAssignedArea,
    getSingleAdsPoint,
    updateAdsPoint,
    deleteAdsPoint
} = require('../../controllers/Department/adsPointController');

router.route('/').post(authenticateUser, authorizePermissions('Sở VH-TT'), createAdsPoint);
router.route('/allPoints').get(getAllAdsPoints);
// router.route('/').get(authenticateUser, getAllAdsPointsByAssignedArea);
router.route('/:id').get(getSingleAdsPoint);
router.route('/:id').patch(authenticateUser, authorizePermissions('Sở VH-TT'), updateAdsPoint);
router.route('/:id').delete(authenticateUser, authorizePermissions('Sở VH-TT'), deleteAdsPoint);

module.exports = router;
