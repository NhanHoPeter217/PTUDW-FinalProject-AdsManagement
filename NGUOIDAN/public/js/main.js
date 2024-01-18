import { MyMap, MarkerManager, MySearchBox, ReportMarkerManager } from '/public/js/MyMap.js';
import { getAllAdsPoints, getAllReports } from '/public/utils/getData.js';

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
        const { adBoardElements, adPointElements } = await getAllAdsPoints();

        // Hide all ad-board
        for (let item of adBoardElements) {
            item.style.display = 'none';
        }

        // Init Marker Manager
        markerManager = new MarkerManager(map, adPointElements);

        // Init Report Marker Manager
        const reportProcessings = await getAllReports();
        if (reportProcessings)
            reportMarkerManager = new ReportMarkerManager(map, reportProcessings);

        // Init Filter Switches
        $('#filterButton').change(function () {
            if ($(this).is(':checked')) {
                markerManager = new MarkerManager(map, adPointElements);
            } else {
                markerManager.destroy();
            }
        });
        $('#reportFilterButton').change(function () {
            if ($(this).is(':checked')) {
                reportMarkerManager = new ReportMarkerManager(map, reportProcessings);
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

document.addEventListener('DOMContentLoaded', function() {
    const leftBar = document.getElementById('left-bar');
    const map = document.getElementById('map');
    const toggleButton = document.getElementById('toggleLeftBar');
    const openButton = document.getElementById('openLeftBar');

    toggleButton.addEventListener('click', function() {
        if (leftBar.style.left === '-250px') {
            leftBar.style.left = '0';
            map.style.marginLeft = '250px';
        } else {
            leftBar.style.left = '-250px';
            map.style.marginLeft = '0';
        }
    });

    openButton.addEventListener('click', function() {
        leftBar.style.left = '0';
        map.style.marginLeft = '250px';
    });
});

