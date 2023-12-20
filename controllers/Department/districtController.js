const { StatusCodes } = require('http-status-codes');
const District = require('../../models/District');
const CustomError = require('../../errors');

const getAllDistricts = async (req, res) => {
  try {
    const districts = await District.find({});
    res.status(StatusCodes.OK).json({ districts, count: districts.length });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};

const createDistrict = async (req, res) => {
  try {
    const district = await District.create(req.body);
    res.status(StatusCodes.CREATED).json({ district });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};

const updateDistrict = async (req, res) => {
  try {
    const { id: districtId } = req.params;
    const district = await District.findOneAndUpdate({ _id: districtId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!district) {
      throw new CustomError.NotFoundError(`No district with id : ${districtId}`);
    }

    res.status(StatusCodes.OK).json({ district });
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
  createDistrict,
  updateDistrict,
  deleteDistrict,
};
