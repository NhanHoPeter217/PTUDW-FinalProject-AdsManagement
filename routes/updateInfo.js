const express = require("express");
const router = express.Router();
const {
    authenticateUser,
} = require('../middleware/authentication');

const { getUserInfo, updateUserInfo } = require("../controllers/updateInfo");

router.route("/").get(authenticateUser, getUserInfo);
router.route("/").patch(authenticateUser, updateUserInfo);

module.exports = router;
