// locationController.js
const Location = require('../models/Location');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

// Get all locations
const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find({});
        res.status(StatusCodes.OK).json({ locations, count: locations.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

// Get all locations by assigned area
const getAllLocationsByAssignedArea = async (req, res) => {
    const { assignedArea } = req.user.assignedArea;
    const { ward, district } = assignedArea;

    try {
        const locations = await Location.find({ ward, district });
        res.status(StatusCodes.OK).json({ locations, count: locations.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

// Get single location
const getSingleLocation = async (req, res) => {
    try {
        const { id: locationId } = req.params;
        const location = await Location.findOne({ _id: locationId });

        if (!location) {
            throw new CustomError.NotFoundError(`No location with id: ${locationId}`);
        }

        res.status(StatusCodes.OK).json({ location });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

// Get all locations by ward and district
const getAllLocationsByWardAndDistrict = async (req, res) => {
    const { ward, district } = req.params;

    try {
        const locations = await Location.find({ ward, district });
        res.status(StatusCodes.OK).json({ locations, count: locations.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

// Create a new location
const createLocation = async (req, res) => {
    try {
        const location = await Location.create(req.body);
        res.status(StatusCodes.CREATED).json({ location });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

// Update a location
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

// Delete a location
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
    // getAllLocations,
    // getAllLocationsByAssignedArea,
    // getSingleLocation,
    // getAllLocationsByWardAndDistrict,
    createLocation,
    // updateLocation,
    deleteLocation
};
