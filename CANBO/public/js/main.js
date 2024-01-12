import { MyMap, MarkerManager, MySearchBox } from "./MyMap.js";

let markerManager = null;


async function main(){
    if (typeof google === 'object' && typeof google.maps === 'object'){
        // get the map element
        const mapElement = document.getElementById('map');
    
        // Public Marker for Map Click Event and SearchBox
        let activeInfoMarker = {
            marker: null
        }
        
        // create the map
        const map = new MyMap(activeInfoMarker);
        await map.initMap(mapElement)
        
        // get all locations element
        const adPointElements = document.getElementsByClassName('adpointInfo');
        
        // Hide all ad-board
        for (let item of document.getElementsByClassName('ad-board')){
            item.style.display = 'none';
        }

        // Init Marker Manager
        markerManager =  new MarkerManager(map, adPointElements);
    
        // Init Filter Switch
        $('#filterButton').change(function () {
            if ($(this).is(':checked')){
                markerManager =  new MarkerManager(map, adPointElements);
            }
            else{
                markerManager.destroy();
            }
        });
    
        // Init Search Box
        const searchBox = new MySearchBox(map, document.getElementById('searchInput'), activeInfoMarker);
        searchBox.initSearchBox();
    }
}
main();