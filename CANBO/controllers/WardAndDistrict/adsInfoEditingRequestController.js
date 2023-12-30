const { StatusCodes } = require('http-status-codes');
const AdsInfoEditingRequest = require('../../models/WardAndDistrict/AdsInfoEditingRequest');
const CustomError = require('../../errors');

const createAdsInfoEditingRequest = async (req, res) => {
    try {
        const adsInfoEditingRequest = await AdsInfoEditingRequest.create(req.body);
        res.status(StatusCodes.CREATED).json({ adsInfoEditingRequest });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllAdsInfoEditingRequests = async (req, res) => {
    try {
        const adsInfoEditingRequests = await AdsInfoEditingRequest.find({});
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
        });

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

const updateAdsInfoEditingRequest = async (req, res) => {
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

        res.status(StatusCodes.OK).json({ adsInfoEditingRequest });
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
