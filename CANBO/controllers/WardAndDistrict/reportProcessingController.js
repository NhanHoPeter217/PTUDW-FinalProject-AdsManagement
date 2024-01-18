const { StatusCodes } = require('http-status-codes');
const ReportProcessing = require('../../models/WardAndDistrict/ReportProcessing');
const Location = require('../../models/Location');
const AdsPoint = require('../../models/AdsPoint');
const AdsBoard = require('../../models/AdsBoard');
const District = require('../../models/Department/District');
const CustomError = require('../../errors');
const sendEmail = require('../../utils/sendEmail');
const fs = require('fs');
const path = require('path');
const { getImageData } = require('../../utils/getImageData');

const { AUTH_EMAIL } = process.env;

// const getAllReportsByResident = async (req, res) => {
//     try {
//         if (!req.residentID) {
//             res.status(StatusCodes.OK).json({ reports: [] });
//         }
//         else {
//             const reports = await ReportProcessing.find({ residentID: req.residentID }).sort(
//                 'createdAt'
//             );
//             res.status(StatusCodes.OK).json({ reports });
//         }
//     } catch (error) {
//         throw new CustomError.BadRequestError(error.message);
//     }
// };

const getAllReportsByResident = async (req, res) => {
    try {
        if (!req.residentID) {
            res.status(StatusCodes.OK).json({ reports: [] });
        } else {
            const reports = await ReportProcessing.find({ residentID: req.residentID }).sort(
                'createdAt'
            );

            const reportsWithImages = await Promise.all(
                reports.map(async (report) => {
                    const images = await Promise.all(
                        report.images.map(async (imagePath) => {
                            const absolutePath = path.join(__dirname, '../..', imagePath);

                            const imageData = getImageData(absolutePath, imagePath);

                            return imageData;
                        })
                    );

                    return { ...report.toObject(), images };
                })
            );

            res.status(StatusCodes.OK).json({ reports: reportsWithImages });
        }
    } catch (error) {
        throw new CustomError.BadRequestError(error.message);
    }
};

const getAllReportsByDepartmentOfficer = async (req, res) => {
    try {
        const reportAdsBoard = await ReportProcessing.find({ relatedToType: 'AdsBoard' })
            .populate([
                {
                    path: 'relatedTo',
                    model: 'AdsBoard',
                    populate: {
                        path: 'adsPoint',
                        model: 'AdsPoint',
                        populate: {
                            path: 'location',
                            model: 'Location'
                        }
                    }
                },
                {
                    path: 'reportFormat',
                    model: 'ReportFormat'
                }
            ])
            .lean();

        const reportAdsPoint = await ReportProcessing.find({ relatedToType: 'AdsPoint' })
            .populate([
                {
                    path: 'relatedTo',
                    model: 'AdsPoint',
                    populate: {
                        path: 'location',
                        model: 'Location'
                    }
                },
                {
                    path: 'reportFormat',
                    model: 'ReportFormat'
                }
            ])
            .lean();

        const reportLocation = await ReportProcessing.find({ relatedToType: 'Location' })
            .populate([
                {
                    path: 'relatedTo',
                    model: 'Location'
                },
                {
                    path: 'reportFormat',
                    model: 'ReportFormat'
                }
            ])
            .lean();

        const reports = reportAdsBoard
            .concat(reportAdsPoint)
            .concat(reportLocation)
            .sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
        const districts = await District.find({}).sort({ districtName: 1 }).lean();

        res.render('vwReport/listReport', {
            reports,
            reportsEmpty: reports.length === 0,
            authUser: req.user,
            districts: districts
        });
        // res.status(StatusCodes.OK).json({ reports, count: reports.length });
    } catch (error) {
        throw new CustomError.BadRequestError(error.message);
    }
};

const getAllReportsByAssignedArea = async (req, res) => {
    const { assignedArea } = req.user;
    const role = req.user.role;
    var wardAssigned, districtAssigned;
    var districtList, wardList;
    districtList = await District.find({}).sort({ districtName: 1 }).lean();
    try {
        if (role === 'Sở VH-TT') {
            // district = *, ward = *
            wardAssigned = req.query.ward;
            districtAssigned = req.query.dist || '*';
            districtAssigned &&
                (wardList = districtList.find(
                    (district) => district.districtName == districtAssigned
                )?.wards);
        } else if (role === 'Quận') {
            // district assigned, ward = *
            districtAssigned = assignedArea.district;
            wardAssigned = req.query.ward || '*';
            wardList = districtList.find((district) => district.districtName == districtAssigned).wards;
        } else if (role === 'Phường') {
            // district assigned, ward assigned
            districtAssigned = assignedArea.district;
            wardAssigned = assignedArea.ward;
        } else throw new CustomError.BadRequestError('Invalid role');

        const mongooseQuery = {};

        if (districtAssigned && districtAssigned !== '*') mongooseQuery.district = districtAssigned;

        if (wardAssigned && wardAssigned !== '*') mongooseQuery.ward = wardAssigned;

        console.log('The Query: ', mongooseQuery);

        const reportAdsBoard = await ReportProcessing.find({
            ...mongooseQuery,
            relatedToType: 'AdsBoard'
        })
            .populate([
                {
                    path: 'relatedTo',
                    model: 'AdsBoard',
                    populate: {
                        path: 'adsPoint',
                        model: 'AdsPoint',
                        populate: {
                            path: 'location',
                            model: 'Location'
                        }
                    }
                },
                {
                    path: 'reportFormat',
                    model: 'ReportFormat'
                }
            ])
            .lean();

        const reportAdsPoint = await ReportProcessing.find({
            ...mongooseQuery,
            relatedToType: 'AdsPoint'
        })
            .populate([
                {
                    path: 'relatedTo',
                    model: 'AdsPoint',
                    populate: {
                        path: 'location',
                        model: 'Location'
                    }
                },
                {
                    path: 'reportFormat',
                    model: 'ReportFormat'
                }
            ])
            .lean();

        const reportLocation = await ReportProcessing.find({
            ...mongooseQuery,
            relatedToType: 'Location'
        })
            .populate([
                {
                    path: 'relatedTo',
                    model: 'Location'
                },
                {
                    path: 'reportFormat',
                    model: 'ReportFormat'
                }
            ])
            .lean();

        const reports = reportAdsBoard
            .concat(reportAdsPoint)
            .concat(reportLocation)
            .sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

        reports.forEach((report) => {
            for (let i = 0; i < report.images.length; i++) {
                report.images[i] = report.images[i].replace(/\\/g, '/');
            }
        });

        res.render('vwReport/listReport', {
            reports,
            reportsEmpty: reports.length === 0,
            districtList,
            wardList,
            districtAssigned,
            wardAssigned,
            authUser: req.user
        });
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).send(
            '[ReportProcessingController.js Error]' + error.message
        );
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
        req.body.images = req.files.map((file) => file.path);
        if (req.body.relatedToType === 'Location') {
            let locationData = JSON.parse(req.body.relatedTo);
            const location = await Location.create({ ...locationData, reportRelated: true });
            req.body.relatedTo = location._id;
            req.body.coords = locationData.coords;
        } else if (req.body.relatedToType === 'AdsPoint') {
            const adsPoint = await AdsPoint.findById(req.body.relatedTo).populate({
                path: 'location',
                model: 'Location'
            });
            req.body.coords = adsPoint.location.coords;
        } else if (req.body.relatedToType === 'AdsBoard') {
            const adsBoard = await AdsBoard.findById(req.body.relatedTo).populate({
                path: 'adsPoint',
                model: 'AdsPoint',
                populate: {
                    path: 'location',
                    model: 'Location',
                    select: 'coords'
                }
            });
            req.body.coords = adsBoard.adsPoint.location.coords;
        }

        req.body.residentID = req.residentID;
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

        const htmlContent = fs.readFileSync(
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
            .replace('{{relatedTo}}', relatedToType)
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
