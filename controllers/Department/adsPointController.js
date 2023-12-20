const { StatusCodes } = require('http-status-codes');
const AdsPoint = require('../../models/AdsPoint');
const CustomError = require('../../errors');

const createAdsPoint = async (req, res) => {
  try {
    const adsPoint = await AdsPoint.create(req.body);
    res.status(StatusCodes.CREATED).json({ adsPoint });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};

const getAllAdsPoints = async (req, res) => {
  try {
    const adsPoints = await AdsPoint.find({});
    res.status(StatusCodes.OK).json({ adsPoints, count: adsPoints.length });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};

const getAllAdsPointsByAssignedArea = async (req, res) => {
    const { assignedArea } = req.user.assignedArea;
    const { ward, district } = assignedArea;
    try {
      const adsPoints = await AdsPoint.find({ "location.wardAndDistrict.ward": ward, "location.wardAndDistrict.district": district });
      res.status(StatusCodes.OK).json({ adsPoints, count: adsPoints.length });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
  };

const getSingleAdsPoint = async (req, res) => {
  try {
    const { id: adsPointId } = req.params;
    const adsPoint = await AdsPoint.findOne({ _id: adsPointId });

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
      runValidators: true,
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

    if (!adsPoint) {
      throw new CustomError.NotFoundError(`No ads point with id : ${adsPointId}`);
    }

    await adsPoint.remove();
    res.status(StatusCodes.OK).json({ msg: 'Success! Ads point removed.' });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};

module.exports = {
  createAdsPoint,
  getAllAdsPoints,
  getAllAdsPointsByAssignedArea,
  getSingleAdsPoint,
  updateAdsPoint,
  deleteAdsPoint,
};
