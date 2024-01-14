const express = require('express');
const multer = require('multer');

const router = express.Router();
const {
    getAllReportsByResident,
    getAllReportsByDepartmentOfficer,
    getAllReportsByAssignedArea,
    getSingleReport,
    getAllReportsByWardAndDistrict,
    createReport,
    updateReport
} = require('../../controllers/WardAndDistrict/reportProcessingController');

const {
    authenticateResidentOfCreateReport,
    authenticateResidentOfGetAllReports,
    authenticateUser,
    authorizePermissions
} = require('../../middleware/authentication');

const { getFormattedDate } = require('../../utils/handleFileUpload');

const handleFileUpload = (req, res, next) => {
    const folderName = 'public/uploads/reportImages';
    const maxImages = 2;
    try {
        var uploadedImages = {};
        var body = null;

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, folderName);
            },
            filename: function (req, file, cb) {
                const fileName = `${getFormattedDate()}_${file.originalname}`;
                cb(null, fileName);
            }
        });

        const upload = multer({ storage: storage, limits: { files: maxImages } }).any();

        upload(req, res, (err) => {
            if (err) {
                throw new Error(`Error uploading file: ${err}`);
            }

            req.files.forEach((file) => {
                uploadedImages[file.fieldname] = file.path;
            });

            res.locals.uploadedImages = uploadedImages;

            createReport(req, res);
        });
    } catch (error) {
        throw error;
    }
};

router.route('/resident/api/v1').post(authenticateResidentOfCreateReport, handleFileUpload);

router.route('/resident/api/v1').get(authenticateResidentOfGetAllReports, getAllReportsByResident);

router
    .route('/dist/:distID/ward/:wardID')
    .get(authenticateUser, authorizePermissions('Sở VH-TT'), getAllReportsByWardAndDistrict);

router
    .route('/')
    .get(authenticateUser, authorizePermissions('Sở VH-TT'), getAllReportsByDepartmentOfficer);

router
    .route('/assignedArea')
    .get(authenticateUser, authorizePermissions('Phường', 'Quận'), getAllReportsByAssignedArea);

router.route('/:id').get(authenticateUser, getSingleReport);

router.route('/:id').patch(authenticateUser, authorizePermissions('Phường', 'Quận'), updateReport);

module.exports = router;
