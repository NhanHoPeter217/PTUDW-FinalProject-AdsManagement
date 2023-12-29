const express = require('express');

const router = express.Router();

router.route('/ward/:wardId/dist/:distId').get(function (req, res) {
    res.render('vwReport/listReport');
});

module.exports = router;
