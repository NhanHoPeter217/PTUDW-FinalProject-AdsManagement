const AdsBoard = require('../../models/AdsBoard');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../../errors');
const AdsFormat = require('../../models/Department/AdsFormat');
const District = require('../../models/Department/District');

const createAdsBoard = async (req, res) => {
    try {
        req.body = JSON.parse(req.body.data);
        if (req.files) req.body.adsBoardImages = req.files.map((file) => file.path);
        console.log(req.body);
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
        const adsBoards = await AdsBoard.find({ adsPoint: adsPointId })
            .populate({
                path: 'adsPoint',
                populate: [
                    {
                        path: 'location',
                        model: 'Location'
                    },
                    {
                        path: 'adsFormat',
                        model: 'AdsFormat'
                    }
                ]
            })
            .populate({
                path: 'licenseRequestedAdsBoard',
                populate: [
                    {
                        path: 'adsLicenseRequest',
                        model: 'AdsLicenseRequest'
                    }
                ]
            })
            .lean();

        const adsPoint = adsBoards[0].adsPoint;
        const adsFormats = await AdsFormat.find({}).lean();
        const districts = await District.find({}).sort({ districtName: 1 }).lean();

        const adsBoardTypes = [
            'Trụ bảng hiflex',
            'Trụ màn hình điện tử LED',
            'Trụ hộp đèn',
            'Bảng hiflex ốp tường',
            'Màn hình điện tử ốp tường',
            'Trụ treo băng rôn dọc',
            'Trụ treo băng rôn ngang',
            'Trụ/Cụm pano',
            'Cổng chào',
            'Trung tâm thương mại'
        ];

        console.log(adsBoards[0].licenseRequestedAdsBoard);

        res.render('vwAdsBoard/listAdsBoard', {
            adsBoards: adsBoards,
            empty: adsBoards.length === 0,
            adsFormats: adsFormats,
            adsPoint: adsPoint,
            adsBoardTypes: adsBoardTypes,
            districts: districts,
            authUser: req.user
        });
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
        req.body = JSON.parse(req.body.data);
        if (req.files) req.body.adsBoardImages = req.files.map((file) => file.path);
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
