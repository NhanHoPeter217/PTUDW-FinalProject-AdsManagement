const express = require('express');
const router = express.Router();
const {
    createAdsBoard,
    getAllAdsBoards,
    getAllAdsBoardsByAssignedArea,
    getSingleAdsBoard,
    updateAdsBoard,
    deleteAdsBoard
} = require('../../controllers/Department/adsBoardController');

router.route('/').post(createAdsBoard);
router.route('/').get(getAllAdsBoards);
router.route('/area/:area').get(getAllAdsBoardsByAssignedArea);
router.route('/:id').get(getSingleAdsBoard);
router.route('/:id').patch(updateAdsBoard);
router.route('/:id').delete(deleteAdsBoard);

module.exports = router;
