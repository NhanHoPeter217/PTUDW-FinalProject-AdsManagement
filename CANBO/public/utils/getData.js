async function getAllLocations() {
    const resLocation = await axios.get(`/api/v1/location/allLocations`);
    let locations = resLocation.data.locations;

    const formats = await axios.get(`/api/v1/adsFormat`);
    const formatList = formats.data.adsFormats;

    locations = locations
        .filter((location) => location.adsPoint)
        .map((location) => {
            const format = formatList.find((format) => format._id === location.adsPoint.adsFormat);
            return { ...location, adsPoint: { ...location.adsPoint, adsFormat: format.name } };
        });
    return { locations };
}

async function getSingleAdsPoint(id) {
    const adsPoint = await axios.get(`/api/v1/adsPoint/${id}`);
    return adsPoint;
}

export { getAllLocations, getSingleAdsPoint };
