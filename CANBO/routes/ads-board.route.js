const express = require('express');

const router = express.Router();

router.route('/list').get(function (req, res) {
    res.render('vwAdsBoard/listAdsBoard');
});

module.exports = router;
