const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../../middleware/authentication');
const {
    createAdsBoard,
    getAllAdsBoards,
    // getAllAdsBoardsByAssignedArea,
    getAllAdsBoardsByAdsPointId,
    getSingleAdsBoard,
    updateAdsBoard,
    deleteAdsBoard
} = require('../../controllers/Department/adsBoardController');

const { configureUpload } = require('../../utils/handleFileUpload');
const folderName = 'public/uploads/adsBoardImages';
const maxImages = 5;
const upload = configureUpload(folderName, maxImages);

router.route('/').post(authenticateUser, authorizePermissions('Sở VH-TT'), upload, createAdsBoard);
router.route('/allBoards').get(getAllAdsBoards);
router.route('/adsPoint/:id').get(authenticateUser, getAllAdsBoardsByAdsPointId);
router.route('/:id').get(getSingleAdsBoard);

router
    .route('/:id')
    .patch(authenticateUser, authorizePermissions('Sở VH-TT'), upload, updateAdsBoard);
router.route('/:id').delete(authenticateUser, authorizePermissions('Sở VH-TT'), deleteAdsBoard);

module.exports = router;
