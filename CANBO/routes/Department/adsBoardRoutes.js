const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../../middleware/authentication');
const {
    createAdsBoard,
    getAllAdsBoards,
    getAllAdsBoardsByAssignedArea,
    getAllAdsBoardsByAdsPointId,
    getSingleAdsBoard,
    updateAdsBoard,
    deleteAdsBoard
} = require('../../controllers/Department/adsBoardController');

router.route('/').post(authenticateUser, authorizePermissions('Sở VH-TT'), createAdsBoard);
router.route('/allBoards').get(getAllAdsBoards);
// router.route('/assignedArea').get(authenticateUser, authorizePermissions('Phường', 'Quận'), getAllAdsBoardsByAssignedArea);
router.route('/adsPoint/:id').get(authenticateUser, getAllAdsBoardsByAdsPointId);
router.route('/:id').get(getSingleAdsBoard);
router.route('/:id').patch(authenticateUser, authorizePermissions('Sở VH-TT'), updateAdsBoard);
router.route('/:id').delete(authenticateUser, authorizePermissions('Sở VH-TT'), deleteAdsBoard);

module.exports = router;
