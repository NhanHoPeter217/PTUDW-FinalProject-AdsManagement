const express = require('express');
const router = express.Router();
const {
    createLocation,
    deleteLocation
} = require('../controllers/locationController');

const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

router.route('/').post(createLocation);
router.route('/:id').delete(authenticateUser, authorizePermissions('Sở VH-TT'), deleteLocation);

module.exports = router;
