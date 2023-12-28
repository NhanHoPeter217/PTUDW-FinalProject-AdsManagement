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
        const adsBoards = await AdsBoard.find({});
        res.status(StatusCodes.OK).json({ adsBoards, count: adsBoards.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllAdsBoardsByAssignedArea = async (req, res) => {
    const { assignedArea } = req.user.assignedArea;
    const { ward, district } = assignedArea;

    try {
        let query = {
            'adsPoint.location.district': district
        };

        if (ward !== '*') {
            query['adsPoint.location.ward'] = ward;
        }

        const adsBoards = await AdsBoard.find(query);
        res.status(StatusCodes.OK).json({ adsBoards, count: adsBoards.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getSingleAdsBoard = async (req, res) => {
    try {
        const { id: adsBoardId } = req.params;
        const adsBoard = await AdsBoard.findOne({ _id: adsBoardId });

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
    getAllAdsBoardsByAssignedArea,
    getSingleAdsBoard,
    updateAdsBoard,
    deleteAdsBoard
};
