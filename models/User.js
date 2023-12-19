const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide name"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minLength: [6, "Password must be at least 6 characters long"],
    },
    fullName: {
      type: String,
      required: [true, "Please provide full name"],
    },
    dateOfBirth: {
      type: String,
      validate: {
        validator: function (value) {
          return moment(value, "DD/MM/YYYY", true).isValid();
        },
        message: "Invalid date format. Please use DD/MM/YYYY.",
      },
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: [true, "Email already exists"],
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Phường", "Quận", "Sở VH-TT"],
      required: [true, "Please provide role"],
    },
    assignedArea: {
      type: String,
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, username: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    },
  );
};

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
