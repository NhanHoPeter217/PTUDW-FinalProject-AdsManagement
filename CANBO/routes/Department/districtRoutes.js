const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../../middleware/authentication');
const {
    getAllDistricts,
    apiGetAllDistricts,
    createDistrict,
    updateDistrict,
    deleteDistrict
} = require('../../controllers/Department/districtController');

router.use(authenticateUser);
// router.use(authorizePermissions('Sở VH-TT'));

router.get('/', (req, res) => res.redirect('/district/1'));
router.get('/:distName', getAllDistricts);
router.get('/api/v1', apiGetAllDistricts);

router.route('/').post(createDistrict);
router.route('/').patch(updateDistrict);
router.route('/:id').delete(deleteDistrict);

module.exports = router;
