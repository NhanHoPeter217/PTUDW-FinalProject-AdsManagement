const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../../middleware/authentication');
const {
    createAdsPoint,
    getAllAdsPoints,
    getAllAdsPointsByAssignedArea,
    getAllAdsPointByWardAndDistrict,
    getAllAdsPointsByWardList,
    getSingleAdsPoint,
    updateAdsPoint,
    deleteAdsPoint
} = require('../../controllers/Department/adsPointController');

router.route('/').post(authenticateUser, authorizePermissions('Sở VH-TT'), createAdsPoint);
router.route('/allPoints').get(getAllAdsPoints);

router
    .route('/assignedArea')
    .get(authenticateUser, authorizePermissions('Phường', 'Quận'), getAllAdsPointsByAssignedArea);

router
    .route('/dist/:distId/ward/:wardId')
    .get(authenticateUser, authorizePermissions('Sở VH-TT'), getAllAdsPointByWardAndDistrict);

router
    .route('/wardList')
    .post(authenticateUser, authorizePermissions('Quận'), getAllAdsPointsByWardList);

router.route('/:id').get(getSingleAdsPoint);
router.route('/:id').patch(authenticateUser, authorizePermissions('Sở VH-TT'), updateAdsPoint);
router.route('/:id').delete(authenticateUser, authorizePermissions('Sở VH-TT'), deleteAdsPoint);

module.exports = router;
