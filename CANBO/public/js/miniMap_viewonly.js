import { MyMap } from '/public/js/MyMap.js';

export default function initMapViewOnly(parentModals) {
    for (let modal of parentModals) {
        modal.addEventListener('shown.bs.modal', async function (event) {
            // Get the map element
            const mapElement = modal.getElementsByClassName('map-view-only')[0];
            // Get the coords
            const lat = parseFloat(modal.getAttribute('data-lat'));
            const lng = parseFloat(modal.getAttribute('data-lng'));

            // Init the map
            const map = new MyMap();
            map.initMapViewOnly(mapElement, { lat, lng });
        });
    }
}
