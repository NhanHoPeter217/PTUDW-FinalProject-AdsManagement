import getLocation from '/public/utils/getClientLocation.js';
import { locations } from './locations.js';

// dynamic import gg map API
((g) => {
    var h,
        a,
        k,
        p = 'The Google Maps JavaScript API',
        c = 'google',
        l = 'importLibrary',
        q = '__ib__',
        m = document,
        b = window;
    b = b[c] || (b[c] = {});
    var d = b.maps || (b.maps = {}),
        r = new Set(),
        e = new URLSearchParams(),
        u = () =>
            h ||
            (h = new Promise(async (f, n) => {
                await (a = m.createElement('script'));
                e.set('libraries', [...r] + '');
                for (k in g)
                    e.set(
                        k.replace(/[A-Z]/g, (t) => '_' + t[0].toLowerCase()),
                        g[k]
                    );
                e.set('callback', c + '.maps.' + q);
                a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
                d[q] = f;
                a.onerror = () => (h = n(Error(p + ' could not load.')));
                a.nonce = m.querySelector('script[nonce]')?.nonce || '';
                m.head.append(a);
            }));
    d[l]
        ? console.warn(p + ' only loads once. Ignoring:', g)
        : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
})({
    key: 'AIzaSyAZP9odw7JOw7LqqIJXcfNxZIh4qxpEK6I',
    v: 'weekly',
    language: 'vi'
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
});

// Initialize and add the map
let map;
// The markers of all locations
let markers = Array(locations.length);

async function initMap() {
    // Request needed libraries.
    //@ts-ignore
    await google.maps.importLibrary('places');
    // await google.maps.importLibrary("core");

    const { Map } = await google.maps.importLibrary('maps');
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

    let clientLat = 0;
    let clientLng = 0;
    await getLocation()
        .then(({ latitude, longitude }) => {
            clientLat = latitude;
            clientLng = longitude;
        })
        .catch((error) => {
            console.error(error);
        });

    const parser = new DOMParser();
    // Current location of the client
    const clientLocation = { lat: clientLat, lng: clientLng };
    let clientMarkerElement = document.createElement('img');
    clientMarkerElement.src = 'public/assets/icons/ClientLocation.svg';

    let clientMarker = new AdvancedMarkerElement({
        position: clientLocation,
        content: clientMarkerElement
    });

    // The map, centered at center_position
    map = new Map(document.getElementById('map'), {
        zoom: 17,
        minZoom: 12,
        maxZoom: 100,
        center: clientLocation,
        mapId: '4fde48b8a0296373',
        keyboardShortcuts: false,
        disableDefaultUI: true,
        streetView: false,
        streetViewCotrol: false,
        streetViewControlOptions: false,
        clickableIcons: false
    });

    clientMarker.setMap(map);

    // Initial Infowindow for places
    let infoWindow = new google.maps.InfoWindow();

    locations.map((location, index) => {
        // Create the marker
        let img = document.createElement('img');
        img.src = `public/assets/icons/${location.status ? 'QCBlue.svg' : 'QCRed.svg'}`;

        markers[index] = new AdvancedMarkerElement({
            map: map,
            position: {
                lat: location.coords.lat,
                lng: location.coords.lng
            },
            content: img,
            title: location.title
        });

        markers[index].addListener('click', () => {
            // Close old Infowindow
            infoWindow.close();
            infoWindow = new google.maps.InfoWindow({
                content: `<style>
        .info-board {
          background-color: var(--LightGreen);
          font-family: Inter;
        }
      </style>
      
      <div class="card info-board" style="width: 300px;, min-height: 100px;">
        <div class="card-body d-flex flex-row justify-content-around">
          <svg width="29" height="34" viewBox="0 0 29 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path id="" d="M26.5455 14.2727C26.5455 23.8182 14.2727 32 14.2727 32C14.2727 32 2 23.8182 2 14.2727C2 11.0178 3.29302 7.89618 5.5946 5.5946C7.89618 3.29302 11.0178 2 14.2727 2C17.5277 2 20.6493 3.29302 22.9509 5.5946C25.2524 7.89618 26.5455 11.0178 26.5455 14.2727Z" stroke="var(--Green2)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path id="" d="M14.2727 18.3636C16.532 18.3636 18.3636 16.5321 18.3636 14.2727C18.3636 12.0134 16.532 10.1818 14.2727 10.1818C12.0133 10.1818 10.1818 12.0134 10.1818 14.2727C10.1818 16.5321 12.0133 18.3636 14.2727 18.3636Z" stroke="var(--Green2)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </svg>
      
          <div class="d-flex flex-column">
            <h5 class="card-title">Chưa có dữ liệu</h5>
            <p class="card-text">Vui lòng chọn địa điểm khác</p>
          </div>
        </div>
      
      </div>`,
                ariaLabel: location.title
            });

            infoWindow.open({
                anchor: markers[index],
                map
            });

            // Pan the map to the info window location
            map.panToBounds(map.getBounds(), 1500);
        });
    });

    // Add a marker clusterer to manage the markers.
    new markerClusterer.MarkerClusterer({ markers, map });

    initAutocomplete();

    // Add points to left bar
    locations.forEach((location, index) => {
        $('#points-container').append(`
    <!-- Adpoint${index} -->
    <style>
        #reportIcon {
            transition: filter 0.1s ease-in-out; /* Add a transition effect */
        }
    
        #reportIcon:hover {
            filter: brightness(0) invert(1); /* Adjust brightness and invert to change the color */
        }
  </style>
    <div
      class="card ad-board default-background primary-text"
      style="width: 20rem; padding: 17px 17px; gap: 40px; min-width: 350px;"
    >
      <div class="d-flex align-items-start">
        <div class="card-body ps-2" style="padding: 0px;">
          <h5 class="card-title" style="font-size: 20px; font-family: Inter; font-weight: 600; margin-bottom: 4px;">${location.title}</h5>
          <p class="card-text-location" style="font-size: 16px; font-family: Inter; font-weight: 500; color: #999999; padding-bottom: 10px;">${location.address}</p>
          <p class="card-text">
            <span class="label">Kích thước:</span>
            <span class="value" style="font-size: 16px; font-family: Inter; font-weight: 700;">${location.w}m x ${location.h}m</span>
          </p>
          <p class="card-text">
            <span class="label">Số lượng:</span>
            <span class="value" style="font-size: 16px; font-family: Inter; font-weight: 700;">${location.n} trụ / bảng</span>
          </p>
          <p class="card-text">
            <span class="label">Hình thức:</span>
            <span class="value" style="font-size: 16px; font-family: Inter; font-weight: 700;">${location.info}</span>
          </p>
          <p class="card-text">
            <span class="label">Phân loại:</span>
            <span class="value" style="font-size: 16px; font-family: Inter; font-weight: 700;">${location.type}</span>
          </p>
        </div>
      </div>


        <!-- Button to trigger the modal -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 31 30" fill="none">
            <path d="M14.2501 8.74994H16.7501V11.2499H14.2501V8.74994ZM14.2501 13.7499H16.7501V21.2499H14.2501V13.7499ZM15.5001 2.49994C8.60006 2.49994 3.00006 8.09994 3.00006 14.9999C3.00006 21.8999 8.60006 27.4999 15.5001 27.4999C22.4001 27.4999 28.0001 21.8999 28.0001 14.9999C28.0001 8.09994 22.4001 2.49994 15.5001 2.49994ZM15.5001 24.9999C9.98756 24.9999 5.50006 20.5124 5.50006 14.9999C5.50006 9.48744 9.98756 4.99994 15.5001 4.99994C21.0126 4.99994 25.5001 9.48744 25.5001 14.9999C25.5001 20.5124 21.0126 24.9999 15.5001 24.9999Z" fill="#1C89D0"/>
          </svg>
          <button
            type="button"
            class="btn btn-outline-danger"
            data-bs-toggle="modal"
            data-bs-target="#reportModal"
            style="display: flex; justify-content: center; align-items: center;"
          >
            <div style="display: flex; justify-content: center; align-items: center; column-gap: 7px;" id="reportIcon">
              <img src='public/assets/icons/Report_icon.svg' fill="none"/>
              <span id="buttonNamePlaceholder" style="font-size: 14px; font-family: Inter; font-weight: 600; text-align: center; padding-top: 2px;">
                BÁO CÁO VI PHẠM
              </span>
            </div>
          </button>
        </div>
      </div>
    `);
    });
}

function initAutocomplete() {
    // Create the search box and link it to the UI element.
    const input = document.getElementById('searchInput');
    const searchBox = new google.maps.places.SearchBox(input);

    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds());
    });

    let markers = [];

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach((marker) => {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();

        places.forEach((place) => {
            if (!place.geometry || !place.geometry.location) {
                console.log('Returned place contains no geometry');
                return;
            }

            const icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(
                new google.maps.Marker({
                    map,
                    icon,
                    title: place.name,
                    position: place.geometry.location
                })
            );

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

    // Get places on click
    let place_info = new google.maps.InfoWindow();
    let geocoder = new google.maps.Geocoder();
    let place_marker = new google.maps.Marker({
        map: null
    });
    let place_service = new google.maps.places.PlacesService(map);

    map.addListener('click', (event) => {
        place_marker.setMap(null);
        geocodeLatLng(geocoder, map, event.latLng);
    });

    function geocodeLatLng(geocoder, map, latlng) {
        // Geocode to find the place_id of the place
        geocoder
            .geocode({ location: latlng })
            .then((response) => {
                if (response.results[0]) {
                    place_marker.setMap(map);
                    place_marker.setPosition(latlng);

                    let address_id = response.results[0].place_id;
                    let address = response.results[0].formatted_address;

                    let place_request = {
                        placeId: address_id,
                        fields: ['name']
                    };

                    // getDetails to get the name of the place
                    place_service.getDetails(place_request, function (result, status) {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            place_info.setContent(`      <div class="card info-board" style="width: 200px;, min-height: 100px;">
              <div class="card-body d-flex flex-row justify-content-around">
                <svg width="29" height="34" viewBox="0 0 29 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path id="" d="M26.5455 14.2727C26.5455 23.8182 14.2727 32 14.2727 32C14.2727 32 2 23.8182 2 14.2727C2 11.0178 3.29302 7.89618 5.5946 5.5946C7.89618 3.29302 11.0178 2 14.2727 2C17.5277 2 20.6493 3.29302 22.9509 5.5946C25.2524 7.89618 26.5455 11.0178 26.5455 14.2727Z" stroke="var(--Green2)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path id="" d="M14.2727 18.3636C16.532 18.3636 18.3636 16.5321 18.3636 14.2727C18.3636 12.0134 16.532 10.1818 14.2727 10.1818C12.0133 10.1818 10.1818 12.0134 10.1818 14.2727C10.1818 16.5321 12.0133 18.3636 14.2727 18.3636Z" stroke="var(--Green2)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                </svg>
            
                <div class="d-flex flex-column">
                  <h6 class="card-title">${result.name}</h6>
                </div>
              </div>
            
            </div>`);
                            place_info.open(map, place_marker);
                        } else {
                            place_info.setContent(address);
                            place_info.open(map, place_marker);
                        }
                    });
                } else {
                    window.alert('Không tìm thấy địa chỉ cho điểm đã chọn');
                }
            })
            .catch((e) => window.alert('Geocoder failed due to: ' + e));
    }
}

initMap();

// Add event listener to the Filter button

$(document).ready(function () {
    // Add event listener to the switch
    $('#filterButton').change(function () {
        // Check if the switch is checked (on) or unchecked (off)
        if ($(this).is(':checked'))
            markers.forEach((marker) => {
                marker.setMap(map);
            });
        else
            markers.forEach((marker, index) => {
                // Hide Quy hoach markers
                marker.setMap(locations[index].status ? null : map);
            });
    });
});
