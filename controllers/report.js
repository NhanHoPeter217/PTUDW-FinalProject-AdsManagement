const Report = require("../models/Resident/Report");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { handleFileUpload } = require("../utils/handleFileUpload");
const ReportProcessing = require("../models/WardAndDistrict/ReportProcessing");

const getAllReports = async (req, res) => {
  try {
    const reports = await ReportProcessing.find({ residentID: req.residentID }).sort("createdAt");
    res.status(StatusCodes.OK).json({ reports });
  } catch (error) {
    throw new CustomError.BadRequestError(error.message);
  }
};

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
  getAllReports,
  createReport,
};
