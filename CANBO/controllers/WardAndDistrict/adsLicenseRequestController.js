const { StatusCodes } = require('http-status-codes');
const AdsPoint = require('../../models/AdsPoint');
const AdsLicenseRequest = require('../../models/WardAndDistrict/AdsLicenseRequest');
const LicenseRequestedAdsBoard = require('../../models/WardAndDistrict/LicenseRequestedAdsBoard');
const AdsBoard = require('../../models/AdsBoard');
const CustomError = require('../../errors');
const District = require('../../models/Department/District');

const createAdsLicenseRequest = async (req, res) => {
    try {
        // const uploadedImages = handleFileUpload(req, 'public/uploads/adsLicenseRequestImages', 2);

        // Object.keys(uploadedImages).forEach((fieldName) => {
        //     req.body.licenseRequestedAdsBoard[fieldName] = Array.isArray(uploadedImages[fieldName])
        //         ? uploadedImages[fieldName]
        //         : [uploadedImages[fieldName]];
        // });

        const adsBoardId = req.params.id;
        const adsBoard = await AdsBoard.findOne({ _id: adsBoardId }).populate({
            path: 'adsPoint',
            model: 'AdsPoint',
            populate: {
                path: 'location',
                model: 'Location',
                select: 'ward district'
            }
        });

        req.body.wardAndDistrict = {
            ward: adsBoard.adsPoint.location.ward,
            district: adsBoard.adsPoint.location.district
        };

        req.body.licenseRequestedAdsBoard.adsBoard = req.params.id;

        const licenseRequestedAdsBoard = await LicenseRequestedAdsBoard.create(
            req.body.licenseRequestedAdsBoard
        );

        req.body.licenseRequestedAdsBoard = licenseRequestedAdsBoard._id;
        const adsLicenseRequest = await AdsLicenseRequest.create(req.body);
        res.status(StatusCodes.CREATED).json({ adsLicenseRequest });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllAdsLicenseRequests = async (req, res) => {
    try {
        const adsLicenseRequests = await AdsLicenseRequest.find({}).lean();
        // res.status(StatusCodes.OK).json({ adsLicenseRequests, count: adsLicenseRequests.length });

        const districts = await District.find({}).sort({ districtName: 1 }).lean();

        const adsLicenseRequests_array = adsLicenseRequests.filter(
            (adsLicenseRequest) => adsLicenseRequest.activeStatus === 'Đang tồn tại'
        );

        res.render('vwAdsBoard/listLicenseAdsBoard', {
            authUser: req.user,
            adsLicenseRequests: adsLicenseRequests_array,
            adsLicenseRequestsEmpty: adsLicenseRequests_array.length === 0,
            districts: districts
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getSingleAdsLicenseRequest = async (req, res) => {
    try {
        const { id: adsLicenseRequestId } = req.params;
        const adsLicenseRequest = await AdsLicenseRequest.findOne({ _id: adsLicenseRequestId });

        if (!adsLicenseRequest) {
            throw new CustomError.NotFoundError(
                `No AdsLicenseRequest with id: ${adsLicenseRequestId}`
            );
        }

        res.status(StatusCodes.OK).json({ adsLicenseRequest });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAdsLicenseByAssignedArea = async (req, res) => {
    const { assignedArea } = req.user;
    const { ward, district } = assignedArea;

    try {
        let query = {};

        if (ward !== '*') {
            query['wardAndDistrict.ward'] = ward;
        }

        if (district !== '*') {
            query['wardAndDistrict.district'] = district;
        }

        const adsLicenseRequests = await AdsLicenseRequest.find(query).lean();
        const districts = await District.find({}).sort({ districtName: 1 }).lean();

        const role = req.user.role;
        
        const adsLicenseRequests_array = adsLicenseRequests.filter(
            (adsLicenseRequest) => adsLicenseRequest.activeStatus === 'Đang tồn tại'
        );

        if (role === 'Quận') {
            res.render('vwAdsBoard/listLicenseAdsBoard', {
                authUser: req.user,
                adsLicenseRequests: adsLicenseRequests_array,
                adsLicenseRequestsEmpty: adsLicenseRequests_array.length === 0,
                districts: districts
            });
        } else {
            res.render('vwAdsBoard/listLicenseAdsBoard', {
                authUser: req.user,
                adsLicenseRequests: adsLicenseRequests_array,
                adsLicenseRequestsEmpty: adsLicenseRequests_array.length === 0,
            });
        }
        
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAllAdsLicenseByAssignedArea = async (req, res) => {
    const district = req.body.district;
    const wardList = req.body.wardList;

    console.log(district);
    console.log(wardList);

    try {
        var allAdsLicense = [];

        for (let i = 0; i < wardList.length; ++i) {
            let query = {};

            if (wardList[i] !== '*') {
                query['wardAndDistrict.ward'] = wardList[i];
            }

            if (district !== '*') {
                query['wardAndDistrict.district'] = district;
            }

            const adsLicenseRequests = await AdsLicenseRequest.find(query).lean();
            
            const adsLicenseRequests_array = adsLicenseRequests.filter(
                (adsLicenseRequest) => adsLicenseRequest.activeStatus === 'Đang tồn tại'
            );

            allAdsLicense.push(...adsLicenseRequests_array);
        }

        res.status(StatusCodes.OK).json({ allAdsLicense, count: allAdsLicense.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const getAdsLicenseRequestsByWardAndDistrict = async (req, res) => {
    const { wardID, distID } = req.params;

    try {
        const adsLicenseRequests = await AdsLicenseRequest.find({
            'wardAndDistrict.ward': wardID,
            'wardAndDistrict.district': distID
        });

        res.status(StatusCodes.OK).json({ adsLicenseRequests, count: adsLicenseRequests.length });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const updateAdsLicenseRequestByAssignedArea = async (req, res) => {
    const { id: adsLicenseRequestId } = req.params;
    let adsLicenseRequest;
    try {
        adsLicenseRequest = await AdsLicenseRequest.findOneAndUpdate(
            { _id: adsLicenseRequestId, requestApprovalStatus: { $ne: 'Đã được duyệt' } },
            req.body,
            { new: true, runValidators: true }
        );

        if (!adsLicenseRequest) {
            throw new CustomError.NotFoundError(
                `No Ads License Request can be updated with id: ${adsLicenseRequestId}`
            );
        }

        res.status(StatusCodes.OK).json({ adsLicenseRequest });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

const updateAdsLicenseRequestByDepartmentOfficier = async (req, res) => {
    const { id: adsLicenseRequestId } = req.params;

    try {
        const adsLicenseRequest = await AdsLicenseRequest.findOneAndUpdate(
            { _id: adsLicenseRequestId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!adsLicenseRequest) {
            throw new CustomError.NotFoundError(
                `No Ads License Request with id: ${adsLicenseRequestId}`
            );
        }

        if (adsLicenseRequest.requestApprovalStatus === 'Đã được duyệt') {
            const { quantity, adBoardImages, adsBoardType, size, contractEndDate, adsBoard } =
                await LicenseRequestedAdsBoard.findOne({
                    _id: adsLicenseRequest.licenseRequestedAdsBoard
                });

            const newAdsBoard = await AdsBoard.findByIdAndUpdate(adsBoard, {
                quantity: quantity,
                adsBoardImages: adBoardImages,
                adsBoardType: adsBoardType,
                size: size,
                contractEndDate: contractEndDate
            });
            res.status(StatusCodes.OK).json({ newAdsBoard });
        }

        res.status(StatusCodes.OK).json({ adsLicenseRequest });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};

// const deleteAdsLicenseRequest = async (req, res) => {
//     const { id: adsLicenseRequestId } = req.params;

//     try {
//         const adsLicenseRequest = await AdsLicenseRequest.findOne({ _id: adsLicenseRequestId });

//         if (!adsLicenseRequest) {
//             throw new CustomError.NotFoundError(`No AdsLicenseRequest with id : ${adsLicenseRequestId}`);
//         }

//         await adsLicenseRequest.remove();
//         res.status(StatusCodes.OK).json({ msg: 'Success! AdsLicenseRequest removed.' });
//     } catch (error) {
//         res.status(StatusCodes.BAD_REQUEST).send(error.message);
//     }
// };

module.exports = {
    createAdsLicenseRequest,
    getAllAdsLicenseRequests,
    getSingleAdsLicenseRequest,
    getAdsLicenseByAssignedArea,
    getAllAdsLicenseByAssignedArea,
    getAdsLicenseRequestsByWardAndDistrict,
    updateAdsLicenseRequestByAssignedArea,
    updateAdsLicenseRequestByDepartmentOfficier
    // deleteAdsLicenseRequest
};
