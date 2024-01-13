const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../../middleware/authentication');
const {
    getAllAdsInfoEditingRequests
} = require('../../controllers/WardAndDistrict/adsInfoEditingRequestController');

router
    .route('/list')
    .get(authenticateUser, authorizePermissions('Sở VH-TT'), getAllAdsInfoEditingRequests);

module.exports = router;
