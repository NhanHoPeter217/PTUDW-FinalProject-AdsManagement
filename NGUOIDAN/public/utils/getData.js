async function getAllLocations() {
    const resLocation = await axios.get(`http://localhost:4000/api/v1/location/allLocations`);
    let locations = resLocation.data.locations;
    let count = resLocation.data.count;

    const formats = await axios.get(`http://localhost:4000/api/v1/adsFormat`);
    const formatList = formats.data.adsFormats;

    locations = locations.map((location) => {
        const format = formatList.find((format) => format._id === location.adsPoint.adsFormat);
        return { ...location, adsPoint: { ...location.adsPoint, adsFormat: format.name } };
    });
    return { locations, count };
}

async function getSingleAdsPoint(id) {
    const adsPoint = await axios.get(`http://localhost:4000/api/v1/adsPoint/${id}`);
    return adsPoint;
}

export { getAllLocations, getSingleAdsPoint };
