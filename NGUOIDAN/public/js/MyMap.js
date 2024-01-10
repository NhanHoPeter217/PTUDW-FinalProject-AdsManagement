
import { getWardFromAddress, getDistrictFromAddress } from '/public/utils/getAddressComponents.js';
import { Map, AdvancedMarkerElement, getLocation, SearchBox } from '/public/js/GeoService.js';
import getClientLocation from '/public/utils/getClientLocation.js';

export class MyMap{
    map;
    apiKey;
    clientMarker;

    constructor(){
        this.apiKey = 'AIzaSyAZP9odw7JOw7LqqIJXcfNxZIh4qxpEK6I'
    }
    
    async initMap(Element){
        const center = await getClientLocation();
    
        this.map = new Map(Element, {
            zoom: 17,
            minZoom: 12,
            maxZoom: 100,
            center: center,
            mapId: '4fde48b8a0296373',
            keyboardShortcuts: false,
            disableDefaultUI: true,
            streetView: false,
            streetViewCotrol: false,
            streetViewControlOptions: false,
            clickableIcons: false
        });

        // Client icon set


    }
}

class MyMarker {
    marker;
    map;
    constructor(marker, map) {
        this.marker = marker;
        this.map = map;
    }
    show(){
        this.marker.setMap(this.map);
    }
    hide(){
        this.marker.setMap(null);
    }
}

export class AdPointMarker extends MyMarker{
    title;
    state;
    address;
    adPoint;

    constructor({...options}){
        
        const originalMarker = new AdvancedMarkerElement({
            // map là 1 MyMap object
            map: options.map.map,
            position: new google.maps.LatLng(options.coords.lat, options.coords.lng),
            content: options.content,
            zIndex: 1,
        });
        
        super(originalMarker, options.map.map);

        this.marker.addListener('click', handleMarkerClick);

        function handleMarkerClick(){
            console.log(this.marker);
            const content = this.marker.content;

            // Tắt
            if (content.classList.contains('highlight')) {
                content.classList.remove('highlight');
                activeMarker = null;

                this.marker.zIndex = 1;
            }

            // Bật
            else{
                content.classList.add('highlight');

                if (activeMarker){
                    activeMarker.content.classList.remove('highlight');
                    activeMarker.zIndex = 1;
                }

                activeMarker = this.marker;
                activeMarker.zIndex = google.maps.Marker.MAX_ZINDEX + 1000;
            }
        }
    }
}


export class InfoMarker extends MyMarker{
    title;
    address;
    ward;
    district;
    infoWindow;

    constructor({...options}){
        this.marker = new AdvancedMarkerElement({
            // map là 1 MyMap object
            map: options.map.map,
            position: new google.maps.LatLng(options.coords.lat, options.coords.lng),
            zIndex: google.maps.Marker.MAX_ZINDEX + 1,
        });

        this.infoWindow = new google.maps.InfoWindow({
            content: options.content,
            maxWidth: 300,
        });
    }
}


export class MarkerManager {
    markers = [];
    map;
    clusterer;

    constructor({...options}){
        this.map = options.map.map;

        // Set list markers
        this.markers = options.markers.map(marker => marker.marker);

        const ClusterRenderrer = {
            render: function ({ count, position }, stats, map) {
                // change color if this cluster has more markers than the mean cluster
                const color = count > Math.max(10, stats.clusters.markers.mean) ? '#ff0000' : '#0000ff';
                // create svg literal with fill color
                const svg = `<svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="50" height="50">
            <circle cx="120" cy="120" opacity=".6" r="70" />
            <circle cx="120" cy="120" opacity=".3" r="90" />
            <circle cx="120" cy="120" opacity=".2" r="110" />
            <text x="50%" y="50%" style="fill:#fff" text-anchor="middle" font-size="50" dominant-baseline="middle" font-family="roboto,arial,sans-serif">${count}</text>
            </svg>`;
                const title = `Cluster of ${count} markers`,
                    // adjust zIndex to be above other markers
                    zIndex = count;
    
                // create cluster SVG element
                const parser = new DOMParser();
                const svgEl = parser.parseFromString(svg, 'image/svg+xml').documentElement;
                svgEl.setAttribute('transform', 'translate(0 25)');
                const clusterOptions = {
                    map,
                    position,
                    zIndex,
                    title,
                    content: svgEl
                };
                return new google.maps.marker.AdvancedMarkerElement(clusterOptions);
            }
        };
    
        // Add a marker clusterer to manage the markers.
        this.clusterer = new markerClusterer.MarkerClusterer({ markers: this.markers, map: this.map, renderer: ClusterRenderrer });
    }
    addMarker(marker){
        this.markers.push(marker);
    }
    setMarkerList(markers){
        this.markers = markers;
    }
    showAll(){
        this.markers.forEach(marker => {
            marker.show();
        })
    }
    hideAll(){
        this.markers.forEach(marker => {
            marker.hide();
        })
    }
}
