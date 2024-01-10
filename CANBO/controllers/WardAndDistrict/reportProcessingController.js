const { StatusCodes } = require('http-status-codes');
const ReportProcessing = require('../../models/WardAndDistrict/ReportProcessing');
const Location = require('../../models/Location');
const CustomError = require('../../errors');
const { handleFileUpload } = require('../../utils/handleFileUpload');
const sendEmail = require('../../utils/sendEmail');
const fs = require('fs').promises;
const path = require('path');

const { AUTH_EMAIL } = process.env;

const getAllReportsByResident = async (req, res) => {
    try {
        const reports = await ReportProcessing.find({ residentID: req.residentID }).sort(
            'createdAt'
        );
        res.status(StatusCodes.OK).json({ reports });
    } catch (error) {
        throw new CustomError.BadRequestError(error.message);
    }
};

const getAllReportsByDepartmentOfficer = async (req, res) => {
    try {
        const reports = await ReportProcessing.find({}).sort('createdAt');
        res.status(StatusCodes.OK).json({ reports, count: reports.length });
    } catch (error) {
        throw new CustomError.BadRequestError(error.message);
    }
};

const getAllReportsByAssignedArea = async (req, res) => {
    const { assignedArea } = req.user;
    const { ward, district } = assignedArea;
    try {
        let query = {};

        if (ward !== '*') {
            query['ward'] = ward;
        }

        if (district !== '*') {
            query['district'] = district;
        }
        const reports = await ReportProcessing.find(query).sort('createdAt');

        res.status(StatusCodes.OK).json({ reports, count: reports.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllReportsByWardAndDistrict = async (req, res) => {
    const { wardID, distID } = req.params;
    console.log(wardID, distID);
    try {
        const reportProcessings = await ReportProcessing.find({
            ward: wardID,
            district: distID
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
        if (req.files) {
            const uploadedImages = handleFileUpload(req, 'public/uploads/reportImages');

            Object.keys(uploadedImages).forEach((fieldName) => {
                req.body[fieldName] = Array.isArray(uploadedImages[fieldName])
                    ? uploadedImages[fieldName]
                    : [uploadedImages[fieldName]];
            });
        }

        if (req.body.relatedToType === 'Location') {
            const location = await Location.create(req.body.relatedTo);
            req.body.relatedTo = location._id;
        }
        const reportProcessing = await ReportProcessing.create(req.body);

        res.status(StatusCodes.CREATED).json({ reportProcessing });
    } catch (error) {
        throw new CustomError.BadRequestError(error.message);
    }
};

const sendReportStatusNotification = async (reportProcessing) => {
    try {
        const { relatedToType, reportFormat, senderName, email, phone, content, createdAt } =
            reportProcessing;

        const subject = 'New announcement: The status and processing method of your report';

        const htmlContent = await fs.readFile(
            path.join(__dirname, '../../public/html/reportStatusNotificationEmail.html'),
            'utf8'
        );

        let locationName, address;
        if (relatedToType === 'Location') {
            ({ locationName, address } = reportProcessing.relatedTo);
        } else if (relatedToType === 'AdsPoint') {
            relatedTo = 'Ad point';
            reportProcessing = await ReportProcessing.findById(reportProcessing._id).populate({
                path: 'relatedTo',
                model: 'AdsPoint',
                populate: {
                    path: 'location',
                    model: 'Location',
                    select: 'locationName address'
                }
            });
            ({ locationName, address } = reportProcessing.relatedTo.location);
        } else if (relatedToType === 'AdsBoard') {
            relatedTo = 'Ad board';
            reportProcessing = await ReportProcessing.findById(reportProcessing._id).populate({
                path: 'relatedTo',
                model: 'AdsBoard',
                populate: {
                    path: 'adsPoint',
                    model: 'AdsPoint',
                    populate: {
                        path: 'location',
                        model: 'Location',
                        select: 'locationName address'
                    }
                }
            });
            ({ locationName, address } = reportProcessing.relatedTo.adsPoint.location);
        }

        const replacedHTML = htmlContent
            .replace('{{senderName}}', senderName)
            .replace('{{phone}}', phone)
            .replace('{{content}}', content)
            .replace('{{relatedTo}}', relatedTo)
            .replace('{{locationName}}', locationName)
            .replace('{{address}}', address)
            .replace('{{createdAt}}', createdAt)
            .replace('{{reportFormat}}', reportFormat.name)
            .replace('{{processingStatus}}', reportProcessing.processingStatus)
            .replace('{{processingMethod}}', reportProcessing.processingMethod);

        const mailOptions = {
            from: AUTH_EMAIL,
            to: email,
            subject,
            html: replacedHTML
        };

        await sendEmail(mailOptions);

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const updateReport = async (req, res) => {
    try {
        const { id: reportProcessingId } = req.params;
        const reportProcessing = await ReportProcessing.findOneAndUpdate(
            { _id: reportProcessingId },
            {
                processingStatus: req.body.processingStatus,
                processingMethod: req.body.processingMethod
            },
            { new: true, runValidators: true }
        );

        if (!reportProcessing) {
            throw new CustomError.NotFoundError(
                `No report processing with id: ${reportProcessingId}`
            );
        }
        const emailSent = await sendReportStatusNotification(reportProcessing);

        if (emailSent) {
            res.status(StatusCodes.OK).json({ reportProcessing });
        } else {
            throw new Error('Failed to send email notification');
        }
    } catch (error) {
        console.error(error);
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
    getAllReportsByResident,
    getAllReportsByDepartmentOfficer,
    getAllReportsByAssignedArea,
    getSingleReport,
    getAllReportsByWardAndDistrict,
    createReport,
    updateReport
    // deleteReport
};
