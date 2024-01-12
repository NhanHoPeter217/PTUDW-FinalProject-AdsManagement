const express = require('express');
const router = express.Router();
const axios = require('axios');

async function getAllAdsPoints() {
    try {
        var result = await axios.get(`http://localhost:4000/adsPoint/allPoints/api/v1`);
        let AdsPoints = result.data.adsPoints;
    
        let AdsBoards = [];

        AdsPoints.forEach((adsPoint) => {
            AdsBoards.push(...adsPoint.adsBoard)
        });
    
        return { AdsPoints, AdsBoards };
    }
    catch (err) {
        console.log(err);
    }
    
}

router.get('/', async (req, res) => {

    const { AdsPoints, AdsBoards } = await getAllAdsPoints();

    res.render('home', { AdsPoints, AdsBoards });
});
module.exports = router;
