const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const {
    getAllAdsBoardsByAdsPointId
} = require('../controllers/licenseController');

router.route('/adsPoint/:id').get(authenticateUser, getAllAdsBoardsByAdsPointId);

module.exports = router;
