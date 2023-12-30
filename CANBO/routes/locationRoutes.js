const express = require('express');
const router = express.Router();
const {
    getAllLocations,
    getSingleLocation,
    getAllLocationsByAssignedArea,
    getAllLocationsByWardAndDistrict,
    getAllLocationsByWardList,
    createLocation,
    updateLocation,
    deleteLocation
} = require('../controllers/locationController');

const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

router.route('/allLocations').get(getAllLocations);

router.route('/:id').get(getSingleLocation);

router
    .route('/assignedArea')
    .get(authenticateUser, authorizePermissions('Phường', 'Quận'), getAllLocationsByAssignedArea);

router
    .route('/dist/:distId/ward/:wardId')
    .get(authenticateUser, authorizePermissions('Sở VH-TT'), getAllLocationsByWardAndDistrict);

router
    .route('/wardList')
    .post(authenticateUser, authorizePermissions('Quận'), getAllLocationsByWardList);

router.route('/').post(authenticateUser, authorizePermissions('Sở VH-TT'), createLocation);

router.route('/:id').patch(authenticateUser, authorizePermissions('Sở VH-TT'), updateLocation);

router.route('/:id').delete(authenticateUser, authorizePermissions('Sở VH-TT'), deleteLocation);

module.exports = router;
