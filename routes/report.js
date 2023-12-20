const express = require("express");

const router = express.Router();
const { createReport } = require("../controllers/report");
const { authenticateResident } = require("../middleware/authentication");

router.route("/").get(authenticateResident, getAllReports);
router.route("/").post(authenticateResident, createReport);

module.exports = router;
