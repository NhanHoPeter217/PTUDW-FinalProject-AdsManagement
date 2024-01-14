const { StatusCodes } = require('http-status-codes');
const Location = require('../../models/Location');
const AdsPoint = require('../../models/AdsPoint');
const CustomError = require('../../errors');
const AdsFormat = require('../../models/Department/AdsFormat');
const District = require('../../models/Department/District');

const createAdsPoint = async (req, res) => {
    try {
        const location = await Location.create(req.body.location);
        req.body.location = location._id;
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

        const role = req.user.role;

        if (role === 'Sở VH-TT') {
            res.render('vwAdsPoint/listAdsPoint', {
                layout: 'canbo_So',
                adsPoints: adsPoints,
                empty: adsPoints.length === 0,
                adsFormats: adsFormats,
                districts: districts,
                authUser: req.user
            });
        } else {
            res.render('vwAdsPoint/listAdsPoint', {
                adsPoints: adsPoints,
                empty: adsPoints.length === 0,
                adsFormats: adsFormats,
                districts: districts,
                authUser: req.user
            });
        }
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllAdsPointsAPI = async (req, res) => {
    try {
        const adsPoints = await AdsPoint.find({})
            .populate({
                path: 'adsBoard',
                model: 'AdsBoard'
            })
            .populate({
                path: 'location',
                model: 'Location'
            });
        res.status(StatusCodes.OK).json({ adsPoints, count: adsPoints.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllAdsPointsByAssignedArea = async (req, res) => {
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
        const locationsID = await Location.find(query).select('_id');

        const adsPoints = await AdsPoint.find({ location: locationsID })
            .populate({
                path: 'adsBoard',
                model: 'AdsBoard'
            })
            .populate({
                path: 'location',
                model: 'Location'
            });
        res.status(StatusCodes.OK).json({ adsPoints, count: adsPoints.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

// const getAllAdsPointsByWardList = async (req, res) => {
//     const { assignedArea } = req.user;
//     const district = assignedArea.district;
//     const wardList = req.body.wardList;
//     try {
//         const locationsID = await Location.find({
//             district,
//             ward: { $in: wardList }
//         }).select('_id');
//         const adsPoints = await AdsPoint.find({'location': locationsID})
//         .populate({
//             path: 'location',
//             model: 'Location'
//         })
//         .populate({
//             path: 'adsBoard',
//             model: 'AdsBoard'
//         });
//         res.status(StatusCodes.OK).json({ adsPoints, count: adsPoints.length });
//     } catch (error) {
//         res.status(StatusCodes.BAD_REQUEST).send(error.message);
//     }
// };

const getAllAdsPointsByWardList = async (req, res) => {
    const { assignedArea } = req.user;
    const district = assignedArea.district;
    const wardList = req.body.wardList;
    try {
        const locationsID = await Location.find({
            district,
            ward: { $in: wardList }
        }).select('_id');
        const adsPoints = await AdsPoint.find({ location: locationsID })
            .populate({
                path: 'location',
                model: 'Location'
            })
            .populate({
                path: 'adsBoard',
                model: 'AdsBoard'
            });
        res.status(StatusCodes.OK).json({ adsPoints, count: adsPoints.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllAdsPointsByWardListAndDistrict = async (req, res) => {
    const district = req.body.district;
    const wardList = req.body.wardList;
    try {
        const locationsID = await Location.find({
            district,
            ward: { $in: wardList }
        }).select('_id');
        const adsPoints = await AdsPoint.find({ location: locationsID })
            .populate({
                path: 'location',
                model: 'Location'
            })
            .populate({
                path: 'adsBoard',
                model: 'AdsBoard'
            });
        res.status(StatusCodes.OK).json({ adsPoints, count: adsPoints.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllAdsPointByWardAndDistrict = async (req, res) => {
    const { wardId, distId } = req.params;
    try {
        const locationsID = await Location.find({ ward: wardId, district: distId }).select('_id');
        const adsPoints = await AdsPoint.find({ location: locationsID })
            .populate({
                path: 'location',
                model: 'Location'
            })
            .populate({
                path: 'adsBoard',
                model: 'AdsBoard'
            });
        res.status(StatusCodes.OK).json({ adsPoints, count: adsPoints.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getSingleAdsPoint = async (req, res) => {
    try {
        const { id: adsPointId } = req.params;
        const adsPoint = await AdsPoint.findOne({ _id: adsPointId })
            .populate({
                path: 'adsBoard',
                model: 'AdsBoard'
            })
            .populate({
                path: 'location',
                model: 'Location'
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
        const location = await Location.findOne({ _id: adsPoint.location });

        if (!adsPoint) {
            throw new CustomError.NotFoundError(`No ads point with id : ${adsPointId}`);
        }
        await location.remove();
        await adsPoint.remove();
        res.status(StatusCodes.OK).json({ msg: 'Success! Ads point removed.' });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

module.exports = {
    createAdsPoint,
    getAllAdsPoints,
    getAllAdsPointsAPI,
    getAllAdsPointsByAssignedArea,
    getAllAdsPointsByWardListAndDistrict,
    getAllAdsPointByWardAndDistrict,
    getAllAdsPointsByWardList,
    getSingleAdsPoint,
    updateAdsPoint,
    deleteAdsPoint
};
