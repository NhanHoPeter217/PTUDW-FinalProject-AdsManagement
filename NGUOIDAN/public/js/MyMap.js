import {
    Map,
    AdvancedMarkerElement,
    getDataFromLatLng,
    getWardFromAddress,
    getDistrictFromAddress
} from '/public/js/GeoService.mjs';
import getClientLocation from '/public/utils/getClientLocation.js';

export class MyMap {
    map;
    apiKey;
    clientMarker;
    activeInfoMarker;
    places_service;

    constructor(activeInfoMarker) {
        this.apiKey = 'HIDDEN_API_KEY';
        this.activeInfoMarker = activeInfoMarker;
    }

    async initMap(Element) {
        const center = await getClientLocation();

        this.map = new Map(Element, {
            zoom: 17,
            minZoom: 12,
            maxZoom: 100,
            center: center,
            mapId: '4fde48b8a0296373',
            keyboardShortcuts: false,
            disableDefaultUI: true,
            draggableCursor: 'auto',
            streetView: false,
            streetViewCotrol: false,
            streetViewControlOptions: false,
            clickableIcons: false
        });

        // Create Places Service
        this.places_service = new google.maps.places.PlacesService(this.map);

        // Client icon set
        this.clientMarker = new AdvancedMarkerElement({
            map: this.map,
            position: center,
            content: $(
                '<img src="\\public\\assets\\icons\\ClientLocation.svg" alt="client" width="30" height="30">'
            )[0],
            zIndex: google.maps.Marker.MAX_ZINDEX
        });

        // Add event listener
        this.map.addListener('click', async (event) => {
            const coords = event.latLng.toJSON();
            const location = await getDataFromLatLng(this.places_service, coords);

            // Return if no location found
            if (!location) return;

            // Clear current active info marker
            if (this.activeInfoMarker.marker) {
                this.activeInfoMarker.marker.close();
            }

            // Create InfoMarker
            this.activeInfoMarker.marker = new InfoMarker(this, location, coords);
            this.activeInfoMarker.marker.open();
        });
    }
}

class MyMarker {
    marker;
    map;
    constructor(marker, map) {
        this.marker = marker;
        this.map = map;
    }
    show() {
        this.marker.setMap(this.map);
    }
    hide() {
        this.marker.setMap(null);
    }
}

class AdPointMarker extends MyMarker {
    name;
    state;
    address;
    adPoint;

    constructor(myMap, content, coords, activeMarker) {
        const originalMarker = new AdvancedMarkerElement({
            map: myMap.map,
            position: new google.maps.LatLng(coords.lat, coords.lng),
            content: content,
            zIndex: 1
        });

        super(originalMarker, myMap.map);

        this.marker.addListener('click', handleMarkerClick);

        function handleMarkerClick() {
            let content = originalMarker.content;

            turnOnAdsBoard(content.getAttribute('data-id'));

            // Tắt
            if (content.classList.contains('highlight')) {
                content.classList.remove('highlight');
                originalMarker.zIndex = 1;
                activeMarker.marker = null;
            }

            // Bật
            else {
                content.classList.add('highlight');

                if (activeMarker.marker) {
                    activeMarker.marker.content.classList.remove('highlight');
                    activeMarker.marker.zIndex = 1;
                }

                activeMarker.marker = originalMarker;
                activeMarker.marker.zIndex = google.maps.Marker.MAX_ZINDEX;
            }
        }

        function turnOnAdsBoard(id) {
            const adsBoards = document.getElementsByClassName('ad-board');
            for (const adsBoard of adsBoards) {
                adsBoard.style.display = 'none';
            }

            document.querySelectorAll(`[data-adsPoint=id_${id}]`).forEach((element) => {
                element.style.display = 'flex';
            });
        }
    }
}

class InfoMarker extends MyMarker {
    name;
    address;
    ward;
    district;
    infoWindow;

    constructor(myMap, data, coords) {
        const originalMarker = new AdvancedMarkerElement({
            map: myMap.map,
            position: new google.maps.LatLng(coords.lat, coords.lng),
            zIndex: google.maps.Marker.MAX_ZINDEX + 1
        });
        super(originalMarker, myMap.map);

        this.infoWindow = new google.maps.InfoWindow({
            content: buildContent()
        });

        // Add event listener
        this.infoWindow.addListener('closeclick', () => {
            this.marker.setMap(null);
        });

        function buildContent() {
            // Create a Location object
            let location = {
                coords,
                locationName: data.name,
                address: data.address,
                ward: data.ward,
                district: data.district
            };
            const content = `
            <div class="info-board mb-2" style="display: flex; align-items: center; position: relative;">
            <svg width="20" height="33" viewBox="0 0 29 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 12 12"><path fill="#f33" d="M6 .5A4.5 4.5 0 0 1 10.5 5c0 1.863-1.42 3.815-4.2 5.9a.5.5 0 0 1-.6 0C2.92 8.815 1.5 6.863 1.5 5A4.5 4.5 0 0 1 6 .5m0 3a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3"/></svg>
                </g>
            </svg>
            <div style="flex-grow: 1; margin-left: 10px;">
                <h6 class="mb-1">${location.locationName}</h6>
                <p>Phường <b>${location.ward}</b> Quận <b>${location.district}</b></p>
            </div>
            <!-- Button to trigger the modal -->
            <button
                type="button"
                class="btn btn-outline-danger reportExclamation"
                onclick="reportButtonHandler(event)"
                data-relatedToType="Location"
                data-relatedTo='${JSON.stringify(location)}'
                data-ward="${location.ward}"
                data-district="${location.district}"
                style="min-width: 111px; width: fit-content; margin-left: 20px;"
            >
                <img src='public/assets/icons/Report_icon.svg' fill="none"/>
                <span style="font-size: 14px; font-family: Inter; font-weight: 600; text-align: center; padding-top: 2px;">BÁO CÁO</span>
            </button>
        </div>
            `;
            return content;
        }
    }

    open() {
        this.infoWindow.open({ map: this.map, shouldFocus: false, anchor: this.marker });
    }
    close() {
        this.infoWindow.close();
        this.marker.setMap(null);
    }
}

class ReportMarker extends MyMarker {
    reportProcessing;
    map;
    constructor(myMap, coords, reportProcessing) {
        const originalMarker = new AdvancedMarkerElement({
            map: myMap.map,
            position: new google.maps.LatLng(coords.lat, coords.lng),
            content: $(
                `<img src="public/assets/icons/triangle-danger-f.svg" alt="reportMarker">`
            )[0],
            zIndex: google.maps.Marker.MAX_ZINDEX + 2
        });
        super(originalMarker, myMap.map);
    }
}

export class ReportMarkerManager {
    reportMarkers = [];
    constructor(myMap, reportProcessings) {
        const bsOffcanvas = new bootstrap.Offcanvas('#report-canvas');

        reportProcessings.forEach((reportProcessing) => {
            const coords = reportProcessing.coords;
            const reportMarker = new ReportMarker(myMap, coords, reportProcessing);
            reportMarker.marker.addListener('click', () => bsOffcanvas.toggle());
            this.reportMarkers.push(reportMarker);
        });
    }
    destroy() {
        this.reportMarkers.forEach((reportMarker) => {
            reportMarker.hide();
        });
    }
}

export class MarkerManager {
    myMarkers = [];
    adsPoints = [];
    map;
    clusterer;
    activeMarker = { marker: null };

    constructor(myMap, adPoints) {
        this.map = myMap.map;

        // Set list markers
        this.adPoints = Array.from(adPoints);

        // Init markers
        for (const adPoint of this.adPoints) {
            const coords = {
                lat: parseFloat(adPoint.getAttribute('data-lat')),
                lng: parseFloat(adPoint.getAttribute('data-lng'))
            };

            const adPointMarker = new AdPointMarker(myMap, adPoint, coords, this.activeMarker);
            this.myMarkers.push(adPointMarker);
        }

        // Init clusterer
        const ClusterRenderrer = {
            render: function ({ count, position }, stats, map) {
                // change color if this cluster has more markers than the mean cluster
                const color =
                    count > Math.max(10, stats.clusters.markers.mean) ? '#ff0000' : '#0000ff';
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
        this.clusterer = new markerClusterer.MarkerClusterer({
            markers: this.myMarkers.map((myMarker) => myMarker.marker),
            map: this.map,
            renderer: ClusterRenderrer
        });
    }
    addMarker(marker) {
        this.myMarkers.push(marker);
    }
    setMarkerList(markers) {
        this.markers = markers;
    }
    showAll() {
        this.myMarkers.forEach((marker) => {
            marker.show();
        });
    }
    hideAll() {
        this.myMarkers.forEach((marker) => {
            marker.hide();
        });
    }
    destroy() {
        this.hideAll();
        this.clusterer.removeMarkers(this.myMarkers.map((marker) => marker.marker));
        this.clusterer = null;
    }
}

export class MySearchBox {
    map;
    input;
    autocomplete;
    activeInfoMarker;

    constructor(map, input, activeInfoMarker) {
        this.map = map.map;
        this.input = input;
        this.activeInfoMarker = activeInfoMarker;
    }

    async initSearchBox() {
        const options = {
            componentRestrictions: { country: 'vn' },
            fields: ['address_components', 'geometry', 'name', 'formatted_address', 'place_id'],
            strictBounds: false
        };

        this.autocomplete = new google.maps.places.Autocomplete(this.input, options);

        // Set bounds automatically
        this.autocomplete.bindTo('bounds', this.map);

        // Add event listener
        this.autocomplete.addListener('place_changed', () => {
            const place = this.autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) {
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            // Clear current active info marker
            if (this.activeInfoMarker.marker) {
                this.activeInfoMarker.marker.close();
            }

            // Create InfoMarker
            const location = {
                name: place.name,
                address: place.formatted_address,
                ward: '',
                district: ''
            };

            location.ward = getWardFromAddress(location.address);
            location.district = getDistrictFromAddress(location.address);
            if (location.district === '') {
                console.log('[Regex] Fail to get district');
                return;
            }

            this.activeInfoMarker.marker = new InfoMarker(
                this,
                location,
                place.geometry.location.toJSON()
            );

            this.map.setCenter(place.geometry.location);
            this.map.setZoom(17);
            
            this.activeInfoMarker.marker.open();
        });
    }
}
