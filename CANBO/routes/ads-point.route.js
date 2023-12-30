const express = require('express');

const router = express.Router();

router.route('/list').get(function (req, res) {
    res.render('vwAdsPoint/listAdsPoint');
});

router.route('/list/manage').get(function (req, res) {
    res.render('vwAdsPoint/manageAdsPoint');
});

module.exports = router;
