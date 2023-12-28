const express = require('express');

const router = express.Router();

router.route('/list').get(function (req, res) {
    console.log('abc');
    res.render('vwAdsPoint/list');
});

module.exports = router;