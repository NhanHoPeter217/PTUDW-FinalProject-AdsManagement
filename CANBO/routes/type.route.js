const express = require('express');
const router = express.Router();
const {
    getAllTypes
} = require('../controllers/typeController');

router.route('/list').get(getAllTypes);

module.exports = router;
