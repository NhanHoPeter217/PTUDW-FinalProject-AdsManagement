const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

const { getUserInfo, updateUserInfo, updatePassword } = require('../controllers/userController');
router.route('/').get(authenticateUser, getUserInfo);
router.route('/').patch(authenticateUser, updateUserInfo);
router.route('/').patch(authenticateUser, updatePassword);

module.exports = router;
