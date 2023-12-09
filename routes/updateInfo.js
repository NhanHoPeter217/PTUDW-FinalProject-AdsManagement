const express = require("express");

const router = express.Router();
const { getUserInfo, updateUserInfo } = require("../controllers/updateInfo");

router.route("/").get(getUserInfo);
router.route("/").patch(updateUserInfo);

module.exports = router;
