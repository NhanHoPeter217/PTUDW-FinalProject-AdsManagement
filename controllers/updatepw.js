const User = require("../models/Department/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { hashData } = require("../utils/hashData");

const updatePassword = async (req, res) => {
  const {
    body: { currentPassword, newPassword },
    user: { userId },
  } = req;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError(`No user with id ${userId}`);
    }

    const isPasswordCorrect = await user.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      throw new BadRequestError("Incorrect current password");
    }

    if (newPassword.length < 6) {
      throw new BadRequestError("Password is too short!");
    }

    user.password = newPassword;
    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ message: "Password updated successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

module.exports = {
  updatePassword,
};
