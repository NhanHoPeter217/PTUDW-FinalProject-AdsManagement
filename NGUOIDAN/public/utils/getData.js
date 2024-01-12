async function getAllAdsPoints() {
    const resLocation = await axios.get(`http://localhost:4000/adsPoint/allPoints/api/v1`);
    let adsPoints = resLocation.data.adsPoints;

    let adsBoards = [];
    adsPoints.forEach((adsPoint) => {
        adsBoards.push(...adsPoint.adsBoard);
    });
    return { adsPoints, adsBoards };
}

export default getAllAdsPoints;
