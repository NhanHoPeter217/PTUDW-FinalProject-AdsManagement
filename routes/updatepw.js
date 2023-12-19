const express = require("express");
const router = express.Router();
const { updatePassword } = require("../controllers/updatepw");
const { authenticateUser } = require("../middleware/authentication");

router.route("/").patch(authenticateUser, updatePassword);

module.exports = router;
