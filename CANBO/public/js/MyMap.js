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
    center = { lat: 10.7625216, lng: 106.6823262 }; // default center at HCMUS

    constructor(activeInfoMarker) {
        this.apiKey = 'AIzaSyAZP9odw7JOw7LqqIJXcfNxZIh4qxpEK6I';
        this.activeInfoMarker = activeInfoMarker;
    }

    initMapViewOnly(Element, coords) {
        this.map = new Map(Element, {
            zoom: 16,
            center: coords || this.center,
            mapId: '4fde48b8a0296373',
            disableDoubleClickZoom: true,
            draggable: false,
            keyboardShortcuts: false,
            navigationControl: false,
            scaleControl: false,
            scrollwheel: false,
            streetViewControl: false,
            disableDefaultUI: true,
            draggableCursor: 'auto',
            streetView: false,
            streetViewCotrol: false,
            streetViewControlOptions: false,
            clickableIcons: false
        });

        // Client icon set
        this.clientMarker = new AdvancedMarkerElement({
            map: this.map,
            position: coords || this.center,
            zIndex: google.maps.Marker.MAX_ZINDEX
        });
    }

    async initMap(Element) {
        this.center = await getClientLocation();

        this.map = new Map(Element, {
            zoom: 17,
            minZoom: 12,
            maxZoom: 22,
            center: this.center,
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
            position: this.center,
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
                ...coords,
                locationName: data.name,
                address: data.address,
                ward: data.ward,
                district: data.district
            };
            const content = `
            <div class="d-flex align-items-center column-gap-2 info-board mb-2">
                <svg width="20" height="33" viewBox="0 0 29 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g>
                    <path id="" d="M26.5455 14.2727C26.5455 23.8182 14.2727 32 14.2727 32C14.2727 32 2 23.8182 2 14.2727C2 11.0178 3.29302 7.89618 5.5946 5.5946C7.89618 3.29302 11.0178 2 14.2727 2C17.5277 2 20.6493 3.29302 22.9509 5.5946C25.2524 7.89618 26.5455 11.0178 26.5455 14.2727Z" stroke="var(--Green2)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path id="" d="M14.2727 18.3636C16.532 18.3636 18.3636 16.5321 18.3636 14.2727C18.3636 12.0134 16.532 10.1818 14.2727 10.1818C12.0133 10.1818 10.1818 12.0134 10.1818 14.2727C10.1818 16.5321 12.0133 18.3636 14.2727 18.3636Z" stroke="var(--Green2)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                </svg>
                <div class="d-flex flex-column">
                    <h6 class="mb-1">${location.locationName}</h6>
                    <p>Phường <b>${location.ward}</b>\t Quận <b>${location.district}</b></p>
                </div>
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

export class MarkerManager {
    myMarkers = [];
    adsPoints = [];
    map;
    clusterer;
    activeMarker = { marker: null };

    constructor(myMap, adPoints) {
        this.map = myMap.map;

        // Set list markers
        this.adPoints = adPoints;

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

    initSearchBox(bindToMap = true) {
        const options = {
            componentRestrictions: { country: 'vn' },
            fields: ['address_components', 'geometry', 'name', 'formatted_address', 'place_id'],
            strictBounds: false
        };

        this.autocomplete = new google.maps.places.Autocomplete(this.input, options);

        // Set bounds automatically
        bindToMap && this.autocomplete.bindTo('bounds', this.map);

        // Add event listener
        this.autocomplete.addListener('place_changed', () => {
            const place = this.autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) {
                window.alert("Không tìm thấy địa chỉ với địa chỉ: '" + place.name + "'");
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
            this.activeInfoMarker.marker.open();
            this.input.setAttribute('data-lat', place.geometry.location.lat());
            this.input.setAttribute('data-lng', place.geometry.location.lng());
        });
    }
}
