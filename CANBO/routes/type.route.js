const express = require('express');

const router = express.Router();

router.route('/list').get(function (req, res) {
    res.render('vwType/listType');
});

module.exports = router;
