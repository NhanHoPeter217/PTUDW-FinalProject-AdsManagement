const { StatusCodes } = require('http-status-codes');
const Ward = require('../../models/Ward');
const CustomError = require('../../errors');

const getAllWards = async (req, res) => {
    try {
        const wards = await Ward.find({});
        res.status(StatusCodes.OK).json({ wards, count: wards.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const createWard = async (req, res) => {
    try {
        const ward = await Ward.create(req.body);
        res.status(StatusCodes.CREATED).json({ ward });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const updateWard = async (req, res) => {
    try {
        const { id: wardId } = req.params;
        const ward = await Ward.findOneAndUpdate({ _id: wardId }, req.body, {
            new: true,
            runValidators: true
        });

        if (!ward) {
            throw new CustomError.NotFoundError(`No ward with id : ${wardId}`);
        }

        res.status(StatusCodes.OK).json({ ward });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const deleteWard = async (req, res) => {
    try {
        const { id: wardId } = req.params;
        const ward = await Ward.findOne({ _id: wardId });

        if (!ward) {
            throw new CustomError.NotFoundError(`No ward with id : ${wardId}`);
        }

        await ward.remove();
        res.status(StatusCodes.OK).json({ msg: 'Success! Ward removed.' });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

module.exports = {
    getAllWards,
    createWard,
    updateWard,
    deleteWard
};
