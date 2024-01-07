const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../../middleware/authentication');
const {
    getAllAdsFormats,
    createAdsFormat,
    updateAdsFormat,
    deleteAdsFormat
} = require('../../controllers/Department/adsFormatController');

// Người dân có thể lấy AdsFormat
router.route('/').get(getAllAdsFormats);

// Người dân có thể lấy AdsFormat
router.route('/').get(getAllAdsFormats);

// router.use(authenticateUser);
// router.use(authorizePermissions('Sở VH-TT'));

router.route('/').post(createAdsFormat);
router.route('/:id').patch(updateAdsFormat);
router.route('/:id').delete(deleteAdsFormat);

module.exports = router;
