const { StatusCodes } = require('http-status-codes');
const AdsLicenseRequest = require('../../models/WardAndDistrict/AdsLicenseRequest');
const CustomError = require('../../errors');

const createAdsLicenseRequest = async (req, res) => {
    try {
        const adsLicenseRequestData = req.body;
        const adsLicenseRequest = await AdsLicenseRequest.create(adsLicenseRequestData);
        res.status(StatusCodes.CREATED).json({ adsLicenseRequest });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllAdsLicenseRequests = async (req, res) => {
    try {
        const adsLicenseRequests = await AdsLicenseRequest.find({ ActiveStatus: 'Đang tồn tại' });
        res.status(StatusCodes.OK).json({ adsLicenseRequests, count: adsLicenseRequests.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getSingleAdsLicenseRequest = async (req, res) => {
    try {
        const { id: adsLicenseRequestId } = req.params;
        const adsLicenseRequest = await AdsLicenseRequest.findOne({ _id: adsLicenseRequestId });

        if (!adsLicenseRequest) {
            throw new CustomError.NotFoundError(`No AdsLicenseRequest with id: ${adsLicenseRequestId}`);
        }

        res.status(StatusCodes.OK).json({ adsLicenseRequest });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAdsLicenseRequestsByAssignedArea = async (req, res) => {
    const { assignedArea } = req.user.assignedArea;
    const { ward, district } = assignedArea;

    try {
        const adsLicenseRequests = await AdsLicenseRequest.find({
            'wardAndDistrict.ward': ward,
            'wardAndDistrict.district': district
        });

        res.status(StatusCodes.OK).json({ adsLicenseRequests, count: adsLicenseRequests.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAdsLicenseRequestsByWardAndDistrict = async (req, res) => {
    const { ward, district } = req.params;

    try {
        const adsLicenseRequests = await AdsLicenseRequest.find({
            'wardAndDistrict.ward': ward,
            'wardAndDistrict.district': district
        });

        res.status(StatusCodes.OK).json({ adsLicenseRequests, count: adsLicenseRequests.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const updateAdsLicenseRequest = async (req, res) => {
    const { id: adsLicenseRequestId } = req.params;

    try {
        const adsLicenseRequest = await AdsLicenseRequest.findOneAndUpdate(
            { _id: adsLicenseRequestId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!adsLicenseRequest) {
            throw new CustomError.NotFoundError(`No Ads License Request with id: ${adsLicenseRequestId}`);
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
    updateAdsLicenseRequest,
    // deleteAdsLicenseRequest
};