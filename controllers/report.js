const Report = require("../models/People/Report");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { handleFileUpload } = require("../utils/handleFileUpload");

const createReport = async (req, res) => {
  try {
    const image1 = handleFileUpload(
      req,
      "image1",
      "public/uploads/reportImages",
    );
    const image2 = handleFileUpload(
      req,
      "image2",
      "public/uploads/reportImages",
    );
    req.body.image1 = image1;
    req.body.image2 = image2;
    const report = await Report.create(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Report created successfully" });
  } catch (error) {
    throw new CustomError.BadRequestError(error.message);
  }
};

module.exports = {
  createReport,
};
