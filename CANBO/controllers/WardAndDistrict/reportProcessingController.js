const { StatusCodes } = require('http-status-codes');
const ReportProcessing = require('../../models/WardAndDistrict/ReportProcessing');
const Location = require('../../models/Location');
const CustomError = require('../../errors');
const { handleFileUpload } = require('../../utils/handleFileUpload');
const sendEmail = require('../../utils/sendEmail');

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
    const { assignedArea } = req.user;
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
            const locationObj = {
                coords: {
                    lat: req.body.lat,
                    lng: req.body.lng
                },
                locationName: req.body.locationName,
                address: req.body.address,
                ward: req.body.ward,
                district: req.body.district
            };
            console.log(locationObj);
            const location = await Location.create(locationObj);
            req.body.relatedTo = location._id;
        }

        const reportProcessing = await ReportProcessing.create(req.body);

        res.status(StatusCodes.CREATED).json({ message: 'Report created successfully' });
    } catch (error) {
        throw new CustomError.BadRequestError(error.message);
    }
};

const sendReportStatusNotification = async (req, res) => {
    try {
        const { id: reportProcessingId } = req.params;
        const reportProcessing =
            await ReportProcessing.findById(reportProcessingId).populate('relatedTo reportFormat');

        const { relatedTo, relatedToType, reportFormat, senderName, email, phone, content } =
            reportProcessing;

        const subject = 'New announcement: The status and processing method of your report';

        const htmlContent = await fs.readFile(
            path.join(__dirname, '../../public/html/reportStatusNotificationEmail.html'),
            'utf8'
        );

        let locationName, address;

        if (relatedToType === 'Location') {
            ({ locationName, address } = relatedTo);
        } else if (relatedToType === 'AdsPoint') {
            ({ locationName, address } = relatedTo.location);
        } else if (relatedToType === 'AdsBoard') {
            ({ locationName, address } = relatedTo.adsPoint.location);
        }

        const replacedHTML = htmlContent
            .replace('{{locationName}}', locationName)
            .replace('{{address}}', address)
            .replace('{{reportFormat}}', reportFormat)
            .replace('{{senderName}}', senderName)
            .replace('{{phone}}', phone)
            .replace('{{content}}', content)
            .replace('{{processingStatus}}', req.body.processingStatus)
            .replace('{{processingMethod}}', req.body.processingMethod);

        const mailOptions = {
            from: AUTH_EMAIL,
            to: email,
            subject,
            html: replacedHTML
        };
        await sendEmail(mailOptions);

        if (!reportProcessing) {
            throw new CustomError.NotFoundError(
                `No ReportProcessing with id: ${reportProcessingId}`
            );
        }
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
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

        sendReportStatusNotification(req, res);

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
    updateReport
    // deleteReport
};
