const express = require('express');
const router = express.Router();
const {
    getAllAdsFormats,
    createAdsFormat,
    updateAdsFormat,
    deleteAdsFormat
} = require('../../controllers/Department/adsFormatController');


router.route('/').get(getAllAdsFormats);
router.route('/').post(createAdsFormat);
router.route('/:id').patch(updateAdsFormat);
router.route('/:id').delete(deleteAdsFormat);

module.exports = router;