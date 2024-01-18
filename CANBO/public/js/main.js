import { MyMap, MarkerManager, MySearchBox, ReportMarkerManager } from './MyMap.js';

let markerManager = null;
let reportMarkerManager = null;

async function main() {
    if (typeof google === 'object' && typeof google.maps === 'object') {
        // get the map element
        const mapElement = document.getElementById('map');

        // Public Marker for Map Click Event and SearchBox
        let activeInfoMarker = {
            marker: null
        };

        // create the map
        const map = new MyMap(activeInfoMarker);
        await map.initMap(mapElement);

        // get all locations element
        const adPointElements = document.querySelectorAll('.adpointInfo');

        // Hide all ad-board
        for (let item of document.getElementsByClassName('ad-board')) {
            item.style.display = 'none';
        }

        // Init Marker Manager
        markerManager = new MarkerManager(map, adPointElements);

        // Init Report Marker Manager
        const reportElements = $('.report-element');
        if (reportElements)
            reportMarkerManager = new ReportMarkerManager(map, reportElements);

        // Init Offcanvas
        const offcanvas_btn = document.getElementById('report-canvas-button');
        const offcanvas = document.getElementById('report-canvas');
        offcanvas_btn.addEventListener('click', function () {
            reportElements.show();
        });
        offcanvas.addEventListener('hidden.bs.offcanvas', function () {
            reportElements.attr('style', 'display: none !important')
        });
        

        // Init Filter Switch
        $('#filterButton').change(function () {
            if ($(this).is(':checked')) {
                markerManager = new MarkerManager(map, adPointElements);
            } else {
                markerManager.destroy();
            }
        });
        $('#reportFilterButton').change(function () {
            if ($(this).is(':checked')) {
                reportMarkerManager = new ReportMarkerManager(map, reportElements);
            } else {
                reportMarkerManager.destroy();
            }
        });

        // Init Search Box
        const searchBox = new MySearchBox(
            map,
            document.getElementById('searchInput'),
            activeInfoMarker
        );
        searchBox.initSearchBox();
    }
}
main();
