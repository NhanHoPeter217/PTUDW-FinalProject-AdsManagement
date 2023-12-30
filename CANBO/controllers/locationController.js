// locationController.js
const Location = require('../models/Location');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find({}).populate({
            path: 'adsPoint',
            model: 'AdsPoint',
            populate: {
                path: 'adsBoard',
                model: 'AdsBoard'
            }
        });
        res.status(StatusCodes.OK).json({ locations, count: locations.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getSingleLocation = async (req, res) => {
    try {
        const { id: locationId } = req.params;
        const location = await Location.findOne({ _id: locationId }).populate({
            path: 'adsPoint',
            model: 'AdsPoint',
            populate: {
                path: 'adsBoard',
                model: 'AdsBoard'
            }
        });

        if (!location) {
            throw new CustomError.NotFoundError(`No location with id: ${locationId}`);
        }

        res.status(StatusCodes.OK).json({ location });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllLocationsByAssignedArea = async (req, res) => {
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

        const adsInfo = await Location.find(query).populate({
            path: 'adsPoint',
            model: 'AdsPoint',
            populate: {
                path: 'adsBoard',
                model: 'AdsBoard'
            }
        });

        res.status(StatusCodes.OK).json({ adsInfo, count: adsInfo.length});
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllLocationsByWardList = async (req, res) => {
    const { assignedArea } = req.user;
    const district = assignedArea.district;
    const wardList = req.body.wardList;
    try {
        const locations = await Location.find({
            district,
            ward: { $in: wardList }
        }).populate({
            path: 'adsPoint',
            model: 'AdsPoint',
            populate: {
                path: 'adsBoard',
                model: 'AdsBoard'
            }
        });

        res.status(StatusCodes.OK).json({ locations, count: locations.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllLocationsByWardAndDistrict = async (req, res) => {
    const { wardId, distId } = req.params;
    try {
        const locations = await Location.find({ ward: wardId, district: distId }).populate({
            path: 'adsPoint',
            model: 'AdsPoint',
            populate: {
                path: 'adsBoard',
                model: 'AdsBoard'
            }
        });
        res.status(StatusCodes.OK).json({ locations, count: locations.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const createLocation = async (req, res) => {
    try {
        const location = await Location.create(req.body);
        res.status(StatusCodes.CREATED).json({ location });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const updateLocation = async (req, res) => {
    try {
        const { id: locationId } = req.params;
        const location = await Location.findOneAndUpdate({ _id: locationId }, req.body, {
            new: true,
            runValidators: true
        });

        if (!location) {
            throw new CustomError.NotFoundError(`No location with id: ${locationId}`);
        }

        res.status(StatusCodes.OK).json({ location });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const deleteLocation = async (req, res) => {
    try {
        const { id: locationId } = req.params;
        const location = await Location.findOne({ _id: locationId });

        if (!location) {
            throw new CustomError.NotFoundError(`No location with id: ${locationId}`);
        }

        await location.remove();
        res.status(StatusCodes.OK).json({ msg: 'Success! Location removed.' });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

module.exports = {
    getAllLocations,
    getSingleLocation,
    getAllLocationsByAssignedArea,
    getAllLocationsByWardAndDistrict,
    getAllLocationsByWardList,
    createLocation,
    updateLocation,
    deleteLocation
};
