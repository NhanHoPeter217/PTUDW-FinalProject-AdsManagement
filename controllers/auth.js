const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { username: user.username }, token });
};

const login = async (req, res) => {
  const { account, password } = req.body;

  if (!account || !password) {
    throw new BadRequestError("Please provide account/email and password");
  }

  // Tìm user theo username hoặc email
  const user = await User.findOne({
    $or: [{ username: account }, { email: account }],
  });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  // So sánh password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  // Tạo token và trả về kết quả
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { username: user.username }, token });
};

module.exports = {
  register,
  login,
};
