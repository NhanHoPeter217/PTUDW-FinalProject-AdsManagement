const express = require('express');

const router = express.Router();

router.route('/list').get(function (req, res) {
    res.render('vwAdsBoard/listAdsBoard');
});

router.route('/license/list').get(function (req, res) {
    res.render('vwAdsBoard/listLicenseAdsBoard');
});
router.route('/list/manage').get(function (req, res) {
    res.render('vwAdsBoard/manageAdsBoard');
});

module.exports = router;
