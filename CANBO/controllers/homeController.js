const axios = require('axios');
const AdsPoint = require('../models/AdsPoint');
const ReportProcessing = require('../models/WardAndDistrict/ReportProcessing');
const District = require('../models/Department/District');

async function homeController (req, res) {
    const { assignedArea } = req.user;
    const role = req.user.role;
    var wardAssigned, districtAssigned;
    var districtList, wardList;
    districtList = await District.find({}).sort({ districtName: 1 }).lean();
    try {
        if (role === 'Sở VH-TT') {
            // district = *, ward = *
            wardAssigned = '*';
            districtAssigned = '*';
        } else if (role === 'Quận') {
            // district assigned, ward = *
            districtAssigned = assignedArea.district;
            wardAssigned = req.query.ward || '*';
            wardList = districtList.find((district) => district.districtName == districtAssigned).wards;
        } else if (role === 'Phường') {
            // district assigned, ward assigned
            districtAssigned = assignedArea.district;
            wardAssigned = assignedArea.ward;
        } else throw new CustomError.BadRequestError('Invalid role');

        const mongooseQuery = {};

        if (districtAssigned && districtAssigned !== '*') mongooseQuery.district = districtAssigned;

        if (wardAssigned && wardAssigned !== '*') mongooseQuery.ward = wardAssigned;

        console.log('The Query: ', mongooseQuery);

        const AdsPoints = await AdsPoint.find()
        .populate({
            path: 'adsBoard',
            model: 'AdsBoard'
        })
        .populate({
            path: 'location',
            model: 'Location'
        }).lean();
    
        let AdsBoards = [];
    
        AdsPoints.forEach((adsPoint) => {
            AdsBoards.push(...adsPoint.adsBoard);
        });

        const reportAdsBoard = await ReportProcessing.find({
            ...mongooseQuery,
            relatedToType: 'AdsBoard'
        })
            .populate([
                {
                    path: 'relatedTo',
                    model: 'AdsBoard',
                    populate: {
                        path: 'adsPoint',
                        model: 'AdsPoint',
                        populate: {
                            path: 'location',
                            model: 'Location'
                        }
                    }
                },
                {
                    path: 'reportFormat',
                    model: 'ReportFormat'
                }
            ])
            .lean();

        const reportAdsPoint = await ReportProcessing.find({
            ...mongooseQuery,
            relatedToType: 'AdsPoint'
        })
            .populate([
                {
                    path: 'relatedTo',
                    model: 'AdsPoint',
                    populate: {
                        path: 'location',
                        model: 'Location'
                    }
                },
                {
                    path: 'reportFormat',
                    model: 'ReportFormat'
                }
            ])
            .lean();
        if (role !== 'Sở VH-TT') {
            const reportLocation = await ReportProcessing.find({
                ...mongooseQuery,
                relatedToType: 'Location'
            })
                .populate([
                    {
                        path: 'relatedTo',
                        model: 'Location'
                    },
                    {
                        path: 'reportFormat',
                        model: 'ReportFormat'
                    }
                ])
                .lean();

            const Reports = reportAdsBoard
                .concat(reportAdsPoint)
                .concat(reportLocation)
                .sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });

            Reports.forEach((report) => {
                for (let i = 0; i < report.images.length; i++) {
                    report.images[i] = report.images[i].replace(/\\/g, '/');
                }
            });
        }
    
    
        res.render('home', {
            AdsPoints,
            AdsBoards,
            Reports,
            districtList,
            wardList,
            auth: req.user
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = homeController;