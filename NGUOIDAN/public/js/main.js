import { MyMap, InfoMarker, AdPointMarker, MarkerManager } from "./MyMap.js";

let activeMarker = null;

async function main(){
    // get the map element
    const mapElement = $('#map');

    // create the map
    const map = new MyMap();
    await map.initMap(mapElement[0])

    // get all locations element
    const locations = $('.adpointInfo');

    // create all markers
    let mymarkers = [];

    for (let i = 0; i < locations.length; i++) {
        const location = locations[i];

        const coords = {
            lat: parseFloat(location.getAttribute('data-lat')),
            lng: parseFloat(location.getAttribute('data-lng'))
        };
        const content = location;

        const adPointMarker = new AdPointMarker({
            map,
            coords,
            content,
        });
        mymarkers.push(adPointMarker);
    }

    // Init Manager
    const manager = new MarkerManager({map: map, markers: mymarkers});
}

main();