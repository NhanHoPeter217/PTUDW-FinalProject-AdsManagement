const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../../middleware/authentication');
const {
    createAdsBoard,
    getAllAdsBoards,
    getAllAdsBoardsByAssignedArea,
    getSingleAdsBoard,
    updateAdsBoard,
    deleteAdsBoard
} = require('../../controllers/Department/adsBoardController');

router.route('/').post(authenticateUser, authorizePermissions('Sở VH-TT'), createAdsBoard);
router.route('/').get(getAllAdsBoards);
router.route('/').get(authenticateUser, getAllAdsBoardsByAssignedArea);
router.route('/:id').get(getSingleAdsBoard);
router.route('/:id').patch(authenticateUser, authorizePermissions('Sở VH-TT'), updateAdsBoard);
router.route('/:id').delete(authenticateUser, authorizePermissions('Sở VH-TT'), deleteAdsBoard);

module.exports = router;
