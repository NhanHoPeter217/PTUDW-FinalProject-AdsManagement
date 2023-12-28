const express = require('express');
const router = express.Router();
const {
    createAdsInfoEditingRequest,
    getAllAdsInfoEditingRequests,
    getSingleAdsInfoEditingRequest,
    updateAdsInfoEditingRequest
} = require('../../controllers/WardAndDistrict/adsInfoEditingRequestController');

router.route('/').get(getAllAdsInfoEditingRequests);
router.route('/').post(createAdsInfoEditingRequest);
router.route('/:id').get(getSingleAdsInfoEditingRequest);
router.route('/:id').patch(updateAdsInfoEditingRequest);

module.exports = router;
