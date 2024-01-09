const { StatusCodes } = require('http-status-codes');
const AdsFormat = require('../models/Department/AdsFormat');
const reportFormat = require('../models/Department/ReportFormat');

const getAllTypes = async (req, res) => {
    try {
        const adsFormats = await AdsFormat.find({}).lean();
        const reportFormats = await reportFormat.find({}).lean();
        res.render('vwType/listType', {
            adsFormats: adsFormats,
            reportFormats: reportFormats,
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
}

module.exports = {
    getAllTypes
};