const express = require('express');

const router = express.Router();
const { createReport } = require('../controllers/report');

router.route('/').post(createReport);

module.exports = router;
