const AdsBoard = require('../models/AdsBoard');
const { StatusCodes } = require('http-status-codes');
const AdsFormat = require('../models/Department/AdsFormat');
const District = require('../models/Department/District');

const getAllAdsBoardsByAdsPointId = async (req, res) => {
    const { id: adsPointId } = req.params;
    const query = req.query;
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
        const licenseRequestedAdsBoardNotEmpty = [];
        const verified = [];
        
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

        for (let i = 0; i < adsBoards.length; i++) {
            if (adsBoards[i].licenseRequestedAdsBoard.length > 0) {
                licenseRequestedAdsBoardNotEmpty.push(true);
            } else {
                licenseRequestedAdsBoardNotEmpty.push(false);
            }

            verified.push(false);

            for (let j = 0; j < adsBoards[i].licenseRequestedAdsBoard.length; j++) {
                if (adsBoards[i].licenseRequestedAdsBoard[j].adsLicenseRequest[0].requestApprovalStatus === 'Đã được duyệt') {
                    verified[i] = true;
                    break;
                }
            }
        }

        // console.log(adsBoards[0].licenseRequestedAdsBoard);

        res.render('vwLicense/license', {
            adsBoard: adsBoards[query.adsBoard_order],
            adsBoardEmpty: adsBoards.length === 0,
            adsPoint: adsPoint,
            adsBoardTypes: adsBoardTypes,
            districts: districts,
            authUser: req.user,
            licenseRequestedAdsBoardEmpty: licenseRequestedAdsBoardNotEmpty[query.adsBoard_order] === false,
            verified: verified[query.adsBoard_order],
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

module.exports = {
    getAllAdsBoardsByAdsPointId,
};