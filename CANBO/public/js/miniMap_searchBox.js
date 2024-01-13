import { MyMap, MySearchBox } from '/public/js/MyMap.js';

export default function initMapWithSearchBox(parentModals) {
    for (let modal of parentModals) {
        modal.addEventListener('shown.bs.modal', async function (event) {
            // Get the map element
            const mapElement = modal.getElementsByClassName('map-search-box')[0];

            // Get the coords
            const lat = parseFloat(modal.getAttribute('data-lat'));
            const lng = parseFloat(modal.getAttribute('data-lng'));

            // Init the map
            const map = new MyMap();
            map.initMapViewOnly(mapElement, lat && lng ? { lat, lng } : null);

            // Get the search box element
            const searchBoxElement = modal.getElementsByClassName('search-box')[0];

            // Init the search box
            const searchBox = new MySearchBox(map, searchBoxElement, { marker: null });
            searchBox.initSearchBox();
        });
    }
}
