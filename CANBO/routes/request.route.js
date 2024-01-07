const express = require('express');

const router = express.Router();

router.route('/list').get(function (req, res) {
    res.render('vwRequest/listRequest');
});

module.exports = router;
