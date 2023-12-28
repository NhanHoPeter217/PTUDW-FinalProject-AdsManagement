const express = require('express');
const router = express.Router();
const {
    createAdsPoint,
    getAllAdsPoints,
    getAllAdsPointsByAssignedArea,
    getSingleAdsPoint,
    updateAdsPoint,
    deleteAdsPoint
} = require('../../controllers/Department/adsPointController');

router.route('/').post(createAdsPoint);
router.route('/').get(getAllAdsPoints);
router.route('/area/:area').get(getAllAdsPointsByAssignedArea);
router.route('/:id').get(getSingleAdsPoint);
router.route('/:id').patch(updateAdsPoint);
router.route('/:id').delete(deleteAdsPoint);

module.exports = router;
