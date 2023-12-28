const express = require('express');
const router = express.Router();
const {
    createLocation,
    deleteLocation
} = require('../../controllers/Department/adsBoardController');

router.route('/').post(createLocation);
router.route('/:id').delete(deleteLocation);

module.exports = router;
