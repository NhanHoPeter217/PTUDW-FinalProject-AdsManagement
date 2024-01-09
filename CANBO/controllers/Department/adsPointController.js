const { StatusCodes } = require('http-status-codes');
const AdsPoint = require('../../models/AdsPoint');
const CustomError = require('../../errors');
const AdsFormat = require('../../models/Department/AdsFormat');
const District = require('../../models/Department/District');

const createAdsPoint = async (req, res) => {
    try {
        const adsPoint = await AdsPoint.create(req.body);
        res.status(StatusCodes.CREATED).json({ adsPoint });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllAdsPoints = async (req, res) => {
    try {
        const adsPoints = await AdsPoint.find({})
            .populate({
                path: 'adsBoard',
                model: 'AdsBoard'
            })
            .populate('adsFormat')
            .populate('location')
            .lean();

        const adsFormats = await AdsFormat.find({}).lean();
        const districts = await District.find({}).sort({ districtName: 1 }).lean();

        res.render('vwAdsPoint/listAdsPoint', {
            adsPoints: adsPoints,
            empty: adsPoints.length === 0,
            adsFormats: adsFormats,
            districts: districts,
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

// const getAllAdsPointsByAssignedArea = async (req, res) => {
//     const { assignedArea } = req.user;
//     const { ward, district } = assignedArea;
//     try {
//         let query = {
//             'adsBoard.location.district': district
//         };

//         if (ward !== '*') {
//             query['adsBoard.location.ward'] = ward;
//         }

//         const adsPoints = await AdsPoint.find(query);

//         res.status(StatusCodes.OK).json({ adsPoints, count: adsPoints.length });
//     } catch (error) {
//         res.status(StatusCodes.BAD_REQUEST).send(error.message);
//     }
// };

const getSingleAdsPoint = async (req, res) => {
    try {
        const { id: adsPointId } = req.params;
        const adsPoint = await AdsPoint.findOne({ _id: adsPointId }).populate({
            path: 'adsBoard',
            model: 'AdsBoard'
        });

        if (!adsPoint) {
            throw new CustomError.NotFoundError(`No ads point with id : ${adsPointId}`);
        }

        res.status(StatusCodes.OK).json({ adsPoint });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const updateAdsPoint = async (req, res) => {
    try {
        const { id: adsPointId } = req.params;
        const adsPoint = await AdsPoint.findOneAndUpdate({ _id: adsPointId }, req.body, {
            new: true,
            runValidators: true
        });

        if (!adsPoint) {
            throw new CustomError.NotFoundError(`No ads point with id : ${adsPointId}`);
        }

        res.status(StatusCodes.OK).json({ adsPoint });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const deleteAdsPoint = async (req, res) => {
    try {
        const { id: adsPointId } = req.params;
        const adsPoint = await AdsPoint.findOne({ _id: adsPointId });

        if (!adsPoint) {
            throw new CustomError.NotFoundError(`No ads point with id : ${adsPointId}`);
        }

        await adsPoint.remove();
        res.status(StatusCodes.OK).json({ msg: 'Success! Ads point removed.' });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

module.exports = {
    createAdsPoint,
    getAllAdsPoints,
    // getAllAdsPointsByAssignedArea,
    getSingleAdsPoint,
    updateAdsPoint,
    deleteAdsPoint
};
