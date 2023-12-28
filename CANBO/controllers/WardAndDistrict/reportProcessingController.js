const { StatusCodes } = require('http-status-codes');
const ReportProcessing = require('../../models/WardAndDistrict/ReportProcessing');
const Location = require('../../models/Location');
const CustomError = require('../../errors');
const { handleFileUpload } = require('../utils/handleFileUpload');

const getAllReports = async (req, res) => {
    try {
        const reports = await ReportProcessing.find({ residentID: req.residentID }).sort(
            'createdAt'
        );
        res.status(StatusCodes.OK).json({ reports });
    } catch (error) {
        throw new CustomError.BadRequestError(error.message);
    }
};

const getAllReportsByAssignedArea = async (req, res) => {
    const { assignedArea } = req.user.assignedArea;
    const { ward, district } = assignedArea;
    try {
        const reports = await Report.find({
            'wardAndDistrict.ward': ward,
            'wardAndDistrict.district': district
        });
        res.status(StatusCodes.OK).json({ reports, count: reports.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllReportsByWardAndDistrict = async (req, res) => {
    const { ward, district } = req.params;

    try {
        const reportProcessings = await ReportProcessing.find({
            'wardAndDistrict.ward': ward,
            'wardAndDistrict.district': district
        });

        res.status(StatusCodes.OK).json({ reportProcessings, count: reportProcessings.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getSingleReport = async (req, res) => {
    try {
        const { id: reportId } = req.params;
        const report = await ReportProcessing.findOne({ _id: reportId });

        if (!report) {
            throw new CustomError.NotFoundError(`No Report with id: ${reportId}`);
        }

        res.status(StatusCodes.OK).json({ report });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const createReport = async (req, res) => {
    try {
        const image1 = handleFileUpload(req, 'image1', 'public/uploads/reportImages');
        const image2 = handleFileUpload(req, 'image2', 'public/uploads/reportImages');
        req.body.image1 = image1;
        req.body.image2 = image2;

        if (req.body.relatedToType === 'Location') {
            const location = await Location.create(req.body.relatedTo);
            req.body.relatedTo = location._id;
        }

        const reportProcessing = await ReportProcessing.create(req.body);

        res.status(StatusCodes.CREATED).json({ message: 'Report created successfully' });
    } catch (error) {
        throw new CustomError.BadRequestError(error.message);
    }
};

const updateReport = async (req, res) => {
    try {
        const { id: reportProcessingId } = req.params;
        const reportProcessing = await ReportProcessing.findOneAndUpdate(
            { _id: reportProcessingId },
            { processingStatus: req.body.processingStatus, processingMethods: req.body.processingMethods },
            { new: true, runValidators: true }
        );

        if (!reportProcessing) {
            throw new CustomError.NotFoundError(`No report processing with id: ${reportProcessingId}`);
        }

        res.status(StatusCodes.OK).json({ reportProcessing });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

// const deleteReport = async (req, res) => {
//     const { id: reportProcessingId } = req.params;

//     try {
//         const reportProcessing = await ReportProcessing.findOne({ _id: reportProcessingId });

//         if (!reportProcessing) {
//             throw new CustomError.NotFoundError(`No ReportProcessing with id : ${reportProcessingId}`);
//         }

//         await reportProcessing.remove();
//         res.status(StatusCodes.OK).json({ msg: 'Success! ReportProcessing removed.' });
//     } catch (error) {
//         res.status(StatusCodes.BAD_REQUEST).send(error.message);
//     }
// };

module.exports = {
    getAllReports,
    getAllReportsByAssignedArea,
    getSingleReport,
    getAllReportsByWardAndDistrict,
    createReport,
    updateReport,
    // deleteReport
};
