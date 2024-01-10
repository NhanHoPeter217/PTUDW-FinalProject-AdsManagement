const { StatusCodes } = require('http-status-codes');
const AdsPoint = require('../../models/AdsPoint');
const AdsLicenseRequest = require('../../models/WardAndDistrict/AdsLicenseRequest');
const LicenseRequestedAdsBoard = require('../../models/WardAndDistrict/LicenseRequestedAdsBoard');
const AdsBoard = require('../../models/AdsBoard');
const CustomError = require('../../errors');

const createAdsLicenseRequest = async (req, res) => {
    try {
        const adsBoardId = req.params.id;
        const adsBoard = await AdsBoard.findOne({ _id: adsBoardId }).populate({
            path: 'adsPoint',
            model: 'AdsPoint',
            populate: {
                path: 'location',
                model: 'Location',
                select: 'ward district'
            }
        });

        req.body.wardAndDistrict = { ward: adsBoard.adsPoint.location.ward, district: adsBoard.adsPoint.location.district };
        
        req.body.licenseRequestedAdsBoard.adsBoard = req.params.id;

        const licenseRequestedAdsBoard = await LicenseRequestedAdsBoard.create(
            req.body.licenseRequestedAdsBoard);

        req.body.licenseRequestedAdsBoard = licenseRequestedAdsBoard._id;
        const adsLicenseRequest = await AdsLicenseRequest.create(req.body);
        res.status(StatusCodes.CREATED).json({ adsLicenseRequest });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllAdsLicenseRequests = async (req, res) => {
    try {
        const adsLicenseRequests = await AdsLicenseRequest.find({});
        res.status(StatusCodes.OK).json({ adsLicenseRequests, count: adsLicenseRequests.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getSingleAdsLicenseRequest = async (req, res) => {
    try {
        const { id: adsLicenseRequestId } = req.params;
        const adsLicenseRequest = await AdsLicenseRequest.findOne({ _id: adsLicenseRequestId});

        if (!adsLicenseRequest) {
            throw new CustomError.NotFoundError(
                `No AdsLicenseRequest with id: ${adsLicenseRequestId}`
            );
        }

        res.status(StatusCodes.OK).json({ adsLicenseRequest });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAdsLicenseRequestsByAssignedArea = async (req, res) => {
    const { assignedArea } = req.user;
    const { ward, district } = assignedArea;

    try {
        let query = {};

        if (ward !== '*') {
            query['wardAndDistrict.ward'] = ward;
        }

        if (district !== '*') {
            query['wardAndDistrict.district'] = district;
        }
        
        const adsLicenseRequests = await AdsLicenseRequest.find(query);

        res.status(StatusCodes.OK).json({ adsLicenseRequests, count: adsLicenseRequests.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAdsLicenseRequestsByWardAndDistrict = async (req, res) => {
    const { wardID, distID } = req.params;

    try {
        const adsLicenseRequests = await AdsLicenseRequest.find({
            'wardAndDistrict.ward': wardID,
            'wardAndDistrict.district': distID,
        });

        res.status(StatusCodes.OK).json({ adsLicenseRequests, count: adsLicenseRequests.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const updateAdsLicenseRequestByAssignedArea = async (req, res) => {
    const { id: adsLicenseRequestId } = req.params;
    let adsLicenseRequest;
    try {
        adsLicenseRequest = await AdsLicenseRequest.findOneAndUpdate(
            { _id: adsLicenseRequestId, requestApprovalStatus: { $ne: 'Đã được duyệt' } },
            req.body,
            { new: true, runValidators: true }
        );

        if (!adsLicenseRequest) {
            throw new CustomError.NotFoundError(
                `No Ads License Request can be updated with id: ${adsLicenseRequestId}`
            );
        }

        res.status(StatusCodes.OK).json({ adsLicenseRequest });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const updateAdsLicenseRequestByDepartmentOfficier = async (req, res) => {
    const { id: adsLicenseRequestId } = req.params;

    try {
        const adsLicenseRequest = await AdsLicenseRequest.findOneAndUpdate(
            { _id: adsLicenseRequestId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!adsLicenseRequest) {
            throw new CustomError.NotFoundError(
                `No Ads License Request with id: ${adsLicenseRequestId}`
            );
        }

        if(adsLicenseRequest.requestApprovalStatus === 'Đã được duyệt'){
            const {quantity, adBoardImages, adsBoardType, size, contractEndDate, adsBoard} = await LicenseRequestedAdsBoard.findOne({ 
                _id: adsLicenseRequest.licenseRequestedAdsBoard });

            const newAdsBoard = await AdsBoard.findByIdAndUpdate(
                adsBoard,
            {
                quantity: quantity,
                adsBoardImages: adBoardImages,
                adsBoardType: adsBoardType,
                size: size,
                contractEndDate: contractEndDate,
            });
            res.status(StatusCodes.OK).json({ newAdsBoard });
        }

        res.status(StatusCodes.OK).json({ adsLicenseRequest });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

// const deleteAdsLicenseRequest = async (req, res) => {
//     const { id: adsLicenseRequestId } = req.params;

//     try {
//         const adsLicenseRequest = await AdsLicenseRequest.findOne({ _id: adsLicenseRequestId });

//         if (!adsLicenseRequest) {
//             throw new CustomError.NotFoundError(`No AdsLicenseRequest with id : ${adsLicenseRequestId}`);
//         }

//         await adsLicenseRequest.remove();
//         res.status(StatusCodes.OK).json({ msg: 'Success! AdsLicenseRequest removed.' });
//     } catch (error) {
//         res.status(StatusCodes.BAD_REQUEST).send(error.message);
//     }
// };

module.exports = {
    createAdsLicenseRequest,
    getAllAdsLicenseRequests,
    getSingleAdsLicenseRequest,
    getAdsLicenseRequestsByAssignedArea,
    getAdsLicenseRequestsByWardAndDistrict,
    updateAdsLicenseRequestByAssignedArea,
    updateAdsLicenseRequestByDepartmentOfficier
    // deleteAdsLicenseRequest
};
