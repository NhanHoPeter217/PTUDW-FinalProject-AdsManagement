const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const districtOfficerSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  assignedAreas: [{ type: String }],
  role: { type: String, default: "Quận" },
});

const DistrictOfficer = mongoose.model(
  "DistrictOfficer",
  districtOfficerSchema,
);

module.exports = DistrictOfficer;
