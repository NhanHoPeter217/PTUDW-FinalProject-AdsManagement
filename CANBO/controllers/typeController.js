const { StatusCodes } = require('http-status-codes');
const AdsFormat = require('../models/Department/AdsFormat');
const ReportFormat = require('../models/Department/ReportFormat');

const getAllTypes = async (req, res) => {
    try {
        const adsFormats = await AdsFormat.find({}).lean();
        const reportFormats = await ReportFormat.find({}).lean();

        res.render('vwType/listType', {
            layout: 'canbo_So',
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