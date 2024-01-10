const getLocation = () => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            }, reject);
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
};

export default getLocation;
