const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../../middleware/authentication');
const {
    getAllDistricts,
    createDistrict,
    updateDistrict,
    deleteDistrict
} = require('../../controllers/Department/districtController');

router.use(authenticateUser);
router.use(authorizePermissions('Sở VH-TT'));

router.route('/').get(getAllDistricts);
router.route('/').post(createDistrict);
router.route('/:id').patch(updateDistrict);
router.route('/:id').delete(deleteDistrict);

module.exports = router;
