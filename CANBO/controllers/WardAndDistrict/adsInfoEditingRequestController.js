const { StatusCodes } = require('http-status-codes');
const AdsInfoEditingRequest = require('../../models/WardAndDistrict/AdsInfoEditingRequest');
const AdsBoardRequestedEdit = require('../../models/WardAndDistrict/AdsBoardRequestedEdit');
const AdsPointRequestedEdit = require('../../models/WardAndDistrict/AdsPointRequestedEdit');
const Location = require('../../models/Location');
const CustomError = require('../../errors');
const AdsBoard = require('../../models/AdsBoard');
const AdsPoint = require('../../models/AdsPoint');

const sendEmail = require('../../utils/sendEmail');
const fs = require('fs').promises;
const path = require('path');

const { AUTH_EMAIL } = process.env;

const createAdsInfoEditingRequest = async (req, res) => {
    try {
        const { adsObject, adsType } = req.body;
        if (adsType === 'AdsBoard') {
            const adsBoard = await AdsBoard.findOne({ _id: adsObject });
            req.body.newInfo.adsPoint = adsBoard.adsPoint;
            adsBoardRequestedEdit = await AdsBoardRequestedEdit.create(req.body.newInfo);
            req.body.newInfo = adsBoardRequestedEdit._id;
        } else if (adsType === 'AdsPoint') {
            adsPointRequestedEdit = await AdsPointRequestedEdit.create(req.body.newInfo);
            req.body.newInfo = adsPointRequestedEdit._id;
        }
        const adsInfoEditingRequest = await AdsInfoEditingRequest.create(req.body);
        res.status(StatusCodes.CREATED).json({ adsInfoEditingRequest });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllAdsInfoEditingRequests = async (req, res) => {
    try {
        const adsInfoEditingRequests = await AdsInfoEditingRequest.find({})
            .populate('adsObject')
            .populate('newInfo');

        res.status(StatusCodes.OK).json({
            adsInfoEditingRequests,
            count: adsInfoEditingRequests.length
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllAdsInfoEditingRequestsByAssignedArea = async (req, res) => {
    const { assignedArea } = req.user;
    const { ward, district } = assignedArea;

    try {
        const adsInfoEditingRequests = await AdsInfoEditingRequest.find({
            'wardAndDistrict.ward': ward,
            'wardAndDistrict.district': district
        });

        res.status(StatusCodes.OK).json({
            adsInfoEditingRequests,
            count: adsInfoEditingRequests.length
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getSingleAdsInfoEditingRequest = async (req, res) => {
    try {
        const { id: adsInfoEditingRequestId } = req.params;
        const adsInfoEditingRequest = await AdsInfoEditingRequest.findOne({
            _id: adsInfoEditingRequestId
        })
            .populate('adsObject')
            .populate('newInfo');

        if (!adsInfoEditingRequest) {
            throw new CustomError.NotFoundError(
                `No AdsInfoEditingRequest with id: ${adsInfoEditingRequestId}`
            );
        }

        res.status(StatusCodes.OK).json({ adsInfoEditingRequest });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const sendReportStatusNotification = async (email, adsInfoEditingRequest) => {
    try {
        const {
            requestApprovalStatus,
            adsNewInfoType,
            newInfo,
            editRequestTime,
            editReason,
            createdAt
        } = adsInfoEditingRequest;

        const subject =
            'New announcement: Your request for adjusting information has been approved';

        let replacedHTML, htmlContent, locationName, address;

        if (adsNewInfoType === 'AdsPointRequestedEdit') {
            adsPointRequestedEdit = await AdsPointRequestedEdit.findById(newInfo);
            console.log(adsPointRequestedEdit);
            ``;
            htmlContent = await fs.readFile(
                path.join(
                    __dirname,
                    '../../public/html/adsPointRequestApprovalNotificationEmail.html'
                ),
                'utf8'
            );

            replacedHTML = htmlContent
                .replace('{{relatedTo}}', 'Ad point')
                .replace('{{planningStatus}}', adsPointRequestedEdit.planningStatus)
                .replace('{{locationType}}', adsPointRequestedEdit.locationType)
                .replace('{{adsFormat}}', adsPointRequestedEdit.adsFormat.name)
                .replace('{{locationName}}', adsPointRequestedEdit.locationName)
                .replace('{{address}}', adsPointRequestedEdit.address);
        } else if (adsNewInfoType === 'AdsBoardRequestedEdit') {
            adsBoardRequestedEdit = await AdsBoardRequestedEdit.findById(newInfo);
            adsPoint = await AdsPoint.findOne(adsBoardRequestedEdit.adsPoint).populate({
                path: 'location',
                model: 'Location',
                select: 'locationName address'
            });

            ({ locationName, address } = adsPoint.location);

            htmlContent = await fs.readFile(
                path.join(
                    __dirname,
                    '../../public/html/adsBoardRequestApprovalNotificationEmail.html'
                ),
                'utf8'
            );

            replacedHTML = htmlContent
                .replace('{{relatedTo}}', 'Ad board')
                .replace('{{quantity}}', adsBoardRequestedEdit.quantity)
                .replace('{{adsBoardType}}', adsBoardRequestedEdit.adsBoardType)
                .replace('{{width}}', adsBoardRequestedEdit.size.width)
                .replace('{{height}}', adsBoardRequestedEdit.size.height)
                .replace('{{contractEndDate}}', adsBoardRequestedEdit.contractEndDate)
                .replace('{{locationName}}', locationName)
                .replace('{{address}}', address);
        }

        replacedHTML = replacedHTML
            .replace('{{requestApprovalStatus}}', requestApprovalStatus)
            .replace('{{editRequestTime}}', editRequestTime)
            .replace('{{editReason}}', editReason)
            .replace('{{createdAt}}', createdAt);

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

const updateAdsInfoEditingRequest = async (req, res) => {
    const { email } = req.user;
    try {
        const { id: adsInfoEditingRequestId } = req.params;
        const adsInfoEditingRequest = await AdsInfoEditingRequest.findOneAndUpdate(
            { _id: adsInfoEditingRequestId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!adsInfoEditingRequest) {
            throw new CustomError.NotFoundError(
                `No AdsInfoEditingRequest with id: ${adsInfoEditingRequestId}`
            );
        }
        const { adsObject, adsType, newInfo } = adsInfoEditingRequest;
        if (adsType === 'AdsBoard') {
            const { quantity, adsBoardImages, adsBoardType, size, contractEndDate } =
                await AdsBoardRequestedEdit.findOne({ _id: newInfo });

            await AdsBoard.findOneAndUpdate(
                { _id: adsObject },
                { quantity, adsBoardImages, adsBoardType, size, contractEndDate },
                { new: true, runValidators: true }
            );
        } else if (adsType === 'AdsPoint') {
            const newAdsObject = await AdsPoint.findOne({ _id: adsObject });
            const newLocation = await Location.findOne({ _id: newAdsObject.location });
            const newInformation = await AdsPointRequestedEdit.findOne({ _id: newInfo });

            newAdsObject.locationImages = newInformation.locationImages;
            newAdsObject.planningStatus = newInformation.planningStatus;
            newAdsObject.locationType = newInformation.locationType;
            newAdsObject.adsFormat = newInformation.adsFormat;

            newLocation.locationName = newInformation.locationName;
            newLocation.coords = newInformation.coords;
            newLocation.address = newInformation.address;
            newLocation.ward = newInformation.ward;
            newLocation.district = newInformation.district;

            await newLocation.save();
            await newAdsObject.save();
        }

        const emailSent = await sendReportStatusNotification(email, adsInfoEditingRequest);

        if (emailSent) {
            res.status(StatusCodes.OK).json({ adsInfoEditingRequest });
        } else {
            throw new Error('Failed to send email notification');
        }
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

// const deleteAdsInfoEditingRequest = async (req, res) => {
//     try {
//         const { id: adsInfoEditingRequestId } = req.params;
//         const adsInfoEditingRequest = await AdsInfoEditingRequest.findOne({ _id: adsInfoEditingRequestId });

//         if (!adsInfoEditingRequest) {
//             throw new CustomError.NotFoundError(`No AdsInfoEditingRequest with id: ${adsInfoEditingRequestId}`);
//         }

//         await adsInfoEditingRequest.remove();
//         res.status(StatusCodes.OK).json({ msg: 'Success! AdsInfoEditingRequest removed.' });
//     } catch (error) {
//         res.status(StatusCodes.BAD_REQUEST).send(error.message);
//     }
// };

module.exports = {
    createAdsInfoEditingRequest,
    getAllAdsInfoEditingRequests,
    // getAllAdsInfoEditingRequestsByAssignedArea,
    getSingleAdsInfoEditingRequest,
    updateAdsInfoEditingRequest
    // deleteAdsInfoEditingRequest
};
