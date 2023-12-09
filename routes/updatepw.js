const express = require("express");

const router = express.Router();
const { updatePassword } = require("../controllers/updatepw");

router.route("/").patch(updatePassword);

module.exports = router;
