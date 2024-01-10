const { StatusCodes } = require('http-status-codes');
const District = require('../../models/Department/District');
const CustomError = require('../../errors');
const textSort = require('../../utils/textSort');

const getAllDistricts = async (req, res) => {
    try {
        const districts = await District.find({}).sort({ districtName: 1 }).lean();
        const distName = req.params.distName;

        res.render('vwDepartment/manageWardDistrict.hbs', {
            layout: 'canbo_So',
            title: 'Quản lý Quận/Phường',
            currentDistName: distName,
            currentDistId: districts.find((dist) => dist.districtName === distName)._id,
            dists: districts,
            distNames: districts.map((dist) => dist.districtName),
            wards: districts.find((dist) => dist.districtName === distName).wards
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const apiGetAllDistricts = async (req, res) => {
    try {
        const districts = await District.find({});
        res.status(StatusCodes.OK).json({ districts, count: districts.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const createDistrict = async (req, res) => {
    try {
        await District.create(req.body);
        res.status(StatusCodes.CREATED).send();
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const updateDistrict = async (req, res) => {
    try {
        const _id = req.body._id;
        const district = await District.findOneAndUpdate(
            { _id: _id },
            {
                districtName: req.body.districtName,
                wards: textSort(req.body.wards)
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!district) {
            throw new CustomError.NotFoundError(`No district with name : ${_id}`);
        }

        res.status(StatusCodes.OK).send();
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const deleteDistrict = async (req, res) => {
    try {
        const { id: districtId } = req.params;
        const district = await District.findOne({ _id: districtId });

        if (!district) {
            throw CustomError.NotFoundError(`No district with id : ${districtId}`);
        }

        await district.remove();
        res.status(StatusCodes.OK).json({ msg: 'Success! District removed.' });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

module.exports = {
    getAllDistricts,
    apiGetAllDistricts,
    createDistrict,
    updateDistrict,
    deleteDistrict
};
