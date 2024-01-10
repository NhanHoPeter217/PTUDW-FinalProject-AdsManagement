const { StatusCodes } = require('http-status-codes');
const AdsFormat = require('../../models/Department/AdsFormat');
const CustomError = require('../../errors');

const getAllAdsFormats = async (req, res) => {
    try {
        const adsFormats = await AdsFormat.find({}).lean();
        res.status(StatusCodes.OK).json({ adsFormats, count: adsFormats.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const createAdsFormat = async (req, res) => {
    try {
        const adsFormat = await AdsFormat.create(req.body);
        res.status(StatusCodes.CREATED).json({ adsFormat });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const updateAdsFormat = async (req, res) => {
    try {
        const { id: adsFormatId } = req.params;
        const adsFormat = await AdsFormat.findOneAndUpdate({ _id: adsFormatId }, req.body, {
            new: true,
            runValidators: true
        });

        if (!adsFormat) {
            throw new CustomError.NotFoundError(`No ads format with id : ${adsFormatId}`);
        }

        res.status(StatusCodes.OK).json({ adsFormat });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const deleteAdsFormat = async (req, res) => {
    try {
        const { id: adsFormatId } = req.params;
        const adsFormat = await AdsFormat.findOne({ _id: adsFormatId });

        if (!adsFormat) {
            throw new CustomError.NotFoundError(`No ads format with id : ${adsFormatId}`);
        }

        await adsFormat.remove();
        res.status(StatusCodes.OK).json({ msg: 'Success! Ads format removed.' });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

module.exports = {
    getAllAdsFormats,
    createAdsFormat,
    updateAdsFormat,
    deleteAdsFormat
};
