const express = require('express');
const router = express.Router();

const { authenticateUser, authorizePermissions } = require('../../middleware/authentication');
const {
    createAdsInfoEditingRequest,
    getAllAdsInfoEditingRequests,
    getSingleAdsInfoEditingRequest,
    updateAdsInfoEditingRequest
} = require('../../controllers/WardAndDistrict/adsInfoEditingRequestController');

router.use(authenticateUser);

const { configureUpload } = require('../../utils/handleFileUpload');
const folderName = 'public/uploads/adsInfoEditingRequestImages'; 
const maxImages = 5; 
const upload = configureUpload(folderName, maxImages);

router.route('/').get(authorizePermissions('Sở VH-TT'), getAllAdsInfoEditingRequests);
router.route('/').post(authorizePermissions('Phường', 'Quận'), upload, createAdsInfoEditingRequest);
// router.route('/').post(createAdsInfoEditingRequest);
router.route('/:id').get(getSingleAdsInfoEditingRequest);
router.route('/:id').patch(authorizePermissions('Sở VH-TT'), updateAdsInfoEditingRequest);

module.exports = router;
