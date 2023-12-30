const AdsBoard = require('../../models/AdsBoard');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../errors');

const createAdsBoard = async (req, res) => {
    try {
        const adsBoard = await AdsBoard.create(req.body);
        res.status(StatusCodes.CREATED).json({ adsBoard });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllAdsBoards = async (req, res) => {
    try {
        const adsBoards = await AdsBoard.find({}).populate({
            path: 'adsPoint',
            model: 'AdsPoint',
            populate: {
                path: 'location',
                model: 'Location',
                select: 'ward district'
            }
        });

        res.status(StatusCodes.OK).json({ adsBoards, count: adsBoards.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllAdsBoardsByAdsPointId = async (req, res) => {
    const { id: adsPointId } = req.params;
    try {
        const adsBoards = await AdsBoard.find({ adsPoint: adsPointId }).populate({
            path: 'adsBoard',
            model: 'AdsBoard'
        });

        res.status(StatusCodes.OK).json({ adsBoards, count: adsBoards.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getSingleAdsBoard = async (req, res) => {
    try {
        const { id: adsBoardId } = req.params;
        const adsBoard = await AdsBoard.findOne({ _id: adsBoardId }).populate({
            path: 'adsPoint',
            model: 'AdsPoint',
            populate: {
                path: 'location',
                model: 'Location',
                select: 'ward district'
            }
        });

        if (!adsBoard) {
            throw new CustomError.NotFoundError(`No ads board with id : ${adsBoardId}`);
        }

        res.status(StatusCodes.OK).json({ adsBoard });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const updateAdsBoard = async (req, res) => {
    try {
        const { id: adsBoardId } = req.params;
        const adsBoard = await AdsBoard.findOneAndUpdate({ _id: adsBoardId }, req.body, {
            new: true,
            runValidators: true
        });

        if (!adsBoard) {
            throw new CustomError.NotFoundError(`No ads board with id : ${adsBoardId}`);
        }

        res.status(StatusCodes.OK).json({ adsBoard });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const deleteAdsBoard = async (req, res) => {
    try {
        const { id: adsBoardId } = req.params;
        const adsBoard = await AdsBoard.findOne({ _id: adsBoardId });

        if (!adsBoard) {
            throw new CustomError.NotFoundError(`No ads board with id : ${adsBoardId}`);
        }

        await adsBoard.remove();
        res.status(StatusCodes.OK).json({ msg: 'Success! Ads board removed.' });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

module.exports = {
    createAdsBoard,
    getAllAdsBoards,
    getAllAdsBoardsByAdsPointId,
    getSingleAdsBoard,
    updateAdsBoard,
    deleteAdsBoard
};
