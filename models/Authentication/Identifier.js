const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Identifier = new mongoose.Schema(
  {
    residentID: {
      type: String,
      required: true,
    },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    isValid: { type: Boolean, default: true },
  },
  { timestamps: true },
);



module.exports = mongoose.model("Identifier", Identifier);