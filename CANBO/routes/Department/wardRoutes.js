const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../../middleware/authentication');
const {
    getAllWards,
    createWard,
    updateWard,
    deleteWard
} = require('../../controllers/Department/wardController');

router.use(authenticateUser);
router.use(authorizePermissions('Sở VH-TT'));

router.route('/').get(getAllWards);
router.route('/').post(createWard);
router.route('/:id').patch(updateWard);
router.route('/:id').delete(deleteWard);

module.exports = router;
