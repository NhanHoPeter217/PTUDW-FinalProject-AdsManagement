// dynamic import gg map API
((g) => {
    var h,
        a,
        k,
        p = 'The Google Maps JavaScript API',
        c = 'google',
        l = 'importLibrary',
        q = '__ib__',
        m = document,
        b = window;
    b = b[c] || (b[c] = {});
    var d = b.maps || (b.maps = {}),
        r = new Set(),
        e = new URLSearchParams(),
        u = () =>
            h ||
            (h = new Promise(async (f, n) => {
                await (a = m.createElement('script'));
                e.set('libraries', [...r] + '');
                for (k in g)
                    e.set(
                        k.replace(/[A-Z]/g, (t) => '_' + t[0].toLowerCase()),
                        g[k]
                    );
                e.set('callback', c + '.maps.' + q);
                a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
                d[q] = f;
                a.onerror = () => (h = n(Error(p + ' could not load.')));
                a.nonce = m.querySelector('script[nonce]')?.nonce || '';
                m.head.append(a);
            }));
    d[l]
        ? console.warn(p + ' only loads once. Ignoring:', g)
        : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
})({
    key: 'AIzaSyAZP9odw7JOw7LqqIJXcfNxZIh4qxpEK6I',
    v: 'weekly',
    language: 'vi'
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
});

const { Map, InfoWindow } = await google.maps.importLibrary('maps');
const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
const { SearchBox } = await google.maps.importLibrary('places');

import { getWardFromAddress, getDistrictFromAddress } from '/public/utils/getAddressComponents.js';

async function geocode(latlng){
    // Define data to return
    let place_id = '', address = '', ward = '', district = '';

    // Get places on click
    let geocoder = new google.maps.Geocoder();
    
    // Use the Geocoder to get the place name and address
    // Geocoder is async
    await geocoder.geocode({ location: latlng })
    .then((response) => {
            const results = response.results;

            if (results[0]) {
                place_id = results[0].place_id;
                address = results[0].formatted_address;
                ward = getWardFromAddress(address);
                district = getDistrictFromAddress(address);
                
            } else {
                window.alert("No results found");
            }
        })
    .catch((error) => {
        alert('[Google Maps API] Fail to Geocode from latlng1', error);
    });
    
    return { place_id, address, ward, district };
}

async function placeDetails(place_service, place_id){
    let place_request = {
        placeId: place_id,
        fields: ['name']
    };

    // getDetails to get the name of the place
    // Places API is block, not async
    let returnPromise = new Promise((resolve, reject) => {
        place_service.getDetails(place_request, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                resolve(place.name);
            } else {
                reject('[Google Maps API] Fail to get name from place_id', place_id);
            }
        });
    });
    return returnPromise;
}

async function getDataFromLatLng(map, latlng){
    // Call above 2 functions

    // Get place_id, address, ward, district
    const { place_id, address, ward, district } = await geocode(latlng);
    if (place_id == '' || address == '' || district == ''){
        if (place_id == '') console.log('[Google Maps API] Fail to get place_id from latlng', latlng);
        if (address == '') console.log('[Google Maps API] Fail to get address from latlng', latlng);
        if (district == '') console.log('[Google Maps API] Fail to get district from latlng', latlng);
        return null;
    }


    // Get place name
    let name = await placeDetails(map, place_id);
    if (address.includes(name)){
        console.log('[Google Maps API] Fail to get name from place_id', place_id);
        name = `Địa điểm chưa có tên<br>${name}`;
    }
    if (ward === '')
        ward = "Không xác định";
    return { name, address, ward, district };
}


export { Map, AdvancedMarkerElement, SearchBox, InfoWindow, getDataFromLatLng, getWardFromAddress, getDistrictFromAddress };