const Report = require("../models/People/Report");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const createReport = async (req, res) => {
  const report = await Report.create(req.body);
  res.status(StatusCodes.CREATED).json({ report });
};

module.exports = {
  createReport,
};
