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

        // Init Filter Switch
        $('#filterButton').change(function () {
            if ($(this).is(':checked')) {
                markerManager = new MarkerManager(map, adPointElements);
            } else {
                markerManager.destroy();
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
