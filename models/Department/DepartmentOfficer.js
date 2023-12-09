const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentOfficerSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, default: "SoVHTT" },
});

const DepartmentOfficer = mongoose.model(
  "DepartmentOfficer",
  departmentOfficerSchema,
);

module.exports = DepartmentOfficer;
