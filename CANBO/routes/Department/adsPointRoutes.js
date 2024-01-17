const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../../middleware/authentication');
const {
    createAdsPoint,
    getAllAdsPoints,
    getAllAdsPointsAPI,
    getAllAdsPointsByAssignedArea,
    getAllAdsPointByWardAndDistrict,
    getAllAdsPointsByWardList,
    getAllAdsPointsByWardListAndDistrict,
    getSingleAdsPoint,
    updateAdsPoint,
    deleteAdsPoint
} = require('../../controllers/Department/adsPointController');

const { configureUpload } = require('../../utils/handleFileUpload');
const folderName = 'public/uploads/adsPointImages';
const maxImages = 5;
const upload = configureUpload(folderName, maxImages);

router.route('/').post(authenticateUser, authorizePermissions('Sở VH-TT'), upload, createAdsPoint);
router.route('/allPoints').get(authenticateUser, authorizePermissions('Sở VH-TT'), getAllAdsPoints);
router.route('/allPoints/api/v1').get(getAllAdsPointsAPI);

router.route('/assignedArea').get(authenticateUser, getAllAdsPointsByAssignedArea);

// router
//     .route('/dist/:distId/ward/:wardId')
//     .get(authenticateUser, authorizePermissions('Sở VH-TT'), getAllAdsPointByWardAndDistrict);

router
    .route('/wardList/api/v1')
    .post(authenticateUser, authorizePermissions('Quận'), getAllAdsPointsByWardList);

router
    .route('/wardList/byDistrict/api/v1')
    .post(
        authenticateUser,
        authorizePermissions('Sở VH-TT', 'Quận'),
        getAllAdsPointsByWardListAndDistrict
    );
// router
//     .route('/wardList/api/v1')
//     .post(getAllAdsPointsByWardList);

router.route('/:id').get(getSingleAdsPoint);
router
    .route('/:id')
    .patch(authenticateUser, authorizePermissions('Sở VH-TT'), upload, updateAdsPoint);
router.route('/:id').delete(authenticateUser, authorizePermissions('Sở VH-TT'), deleteAdsPoint);

module.exports = router;
