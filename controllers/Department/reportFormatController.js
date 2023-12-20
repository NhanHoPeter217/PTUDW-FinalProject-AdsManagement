const { StatusCodes } = require('http-status-codes');
const ReportFormat = require('../../models/ReportFormat');
const CustomError = require('../../errors');

const getAllReportFormats = async (req, res) => {
  try {
    const reportFormats = await ReportFormat.find({});
    res.status(StatusCodes.OK).json({ reportFormats, count: reportFormats.length });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};

const createReportFormat = async (req, res) => {
  try {
    const reportFormat = await ReportFormat.create(req.body);
    res.status(StatusCodes.CREATED).json({ reportFormat });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};

const updateReportFormat = async (req, res) => {
  try {
    const { id: reportFormatId } = req.params;
    const reportFormat = await ReportFormat.findOneAndUpdate({ _id: reportFormatId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!reportFormat) {
      throw new CustomError.NotFoundError(`No report format with id : ${reportFormatId}`);
    }

    res.status(StatusCodes.OK).json({ reportFormat });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};

const deleteReportFormat = async (req, res) => {
  try {
    const { id: reportFormatId } = req.params;
    const reportFormat = await ReportFormat.findOne({ _id: reportFormatId });

    if (!reportFormat) {
      throw new CustomError.NotFoundError(`No report format with id : ${reportFormatId}`);
    }

    await reportFormat.remove();
    res.status(StatusCodes.OK).json({ msg: 'Success! Report format removed.' });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};

module.exports = {
  getAllReportFormats,
  createReportFormat,
  updateReportFormat,
  deleteReportFormat,
};
