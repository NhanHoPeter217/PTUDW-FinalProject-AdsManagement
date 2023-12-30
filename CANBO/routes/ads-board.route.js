const express = require('express');

const router = express.Router();

router.route('/list').get(function (req, res) {
    res.render('vwAdsBoard/listAdsBoard');
});

router.route('/license/list').get(function (req, res) {
    res.render('vwAdsBoard/listLicenseAdsBoard');
});

module.exports = router;
