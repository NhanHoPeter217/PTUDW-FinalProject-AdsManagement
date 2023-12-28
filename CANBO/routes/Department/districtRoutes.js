const express = require('express');
const router = express.Router();
const {
    getAllDistricts,
    createDistrict,
    updateDistrict,
    deleteDistrict
} = require('../../controllers/Department/districtController');

router.route('/').get(getAllDistricts);
router.route('/').post(createDistrict);
router.route('/:id').patch(updateDistrict);
router.route('/:id').delete(deleteDistrict);

module.exports = router;
