import getLocation from '/public/utils/getClientLocation.js';
import { getAllLocations, getSingleAdsPoint } from '/public/utils/getData.js';
import { getWardFromAddress, getDistrictFromAddress } from '/public/utils/getAddressComponents.js';

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
let markers = null;

async function initMap() {
    // Request needed libraries.
    await google.maps.importLibrary('places');

    // The markers of all locations
    const { locations } = await getAllLocations();

    markers = Array(locations.length);

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

    locations.forEach((item, index) => {
        if (item.adsPoint == undefined) return;

        // Create the marker
        markers[index] = new AdvancedMarkerElement({
            map: map,
            position: {
                lat: item.coords.lat,
                lng: item.coords.lng
            },
            content: buildContent(item),
            title: item.title
        });

        // Add event listener to the marker
        markers[index].addListener('click', () =>
            handleMarkerClick(
                markers[index],
                item.adsPoint,
                item.locationName,
                item.ward,
                item.district
            )
        );
    });

    // Previous Marker
    let prevMarker = null;

    function handleMarkerClick(markerView, adsPoint, name, ward, district) {
        if (markerView.content.classList.contains('highlight')) {
            markerView.content.classList.remove('highlight');
            markerView.zIndex = 1;
            prevMarker = null;
        } else {
            markerView.content.classList.add('highlight');
            if (prevMarker && prevMarker.content.classList.contains('highlight'))
                prevMarker.content.classList.remove('highlight');
            markerView.zIndex = google.maps.Marker.MAX_ZINDEX + 100;
            prevMarker = markerView;

            // Add data to left bar
            $('#boards-container').empty();
            adsPoint.adsBoard.forEach((board, index) => {
                $('#boards-container').append(`
            <!-- Adboard${index} -->
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
                  <h5 class="card-title" style="font-size: 20px; font-family: Inter; font-weight: 600; margin-bottom: 4px;">${board.adsBoardType}</h5>
                  <p class="card-text-location" style="font-size: 16px; font-family: Inter; font-weight: 500; color: #999999; padding-bottom: 10px;">${name}</p>
                  <p class="card-text">
                    <span class="label">Kích thước:</span>
                    <span class="value" style="font-size: 16px; font-family: Inter; font-weight: 700;">${board.size.width}m x ${board.size.height}m</span>
                  </p>
                  <p class="card-text">
                    <span class="label">Số lượng:</span>
                    <span class="value" style="font-size: 16px; font-family: Inter; font-weight: 700;">${board.quantity} trụ / bảng</span>
                  </p>
                  <p class="card-text">
                    <span class="label">Hình thức:</span>
                    <span class="value" style="font-size: 16px; font-family: Inter; font-weight: 700;">${adsPoint.adsFormat}</span>
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
                    onclick="reportButtonHandler(event)"
                    data-relatedToType="AdsBoard"
                    data-relatedTo="${board._id}"
                    data-ward="${ward}"
                    data-district="${district}"
                    style="display: flex; justify-content: center; align-items: center;"
                  >
                    <div style="display: flex; justify-content: center; align-items: center; column-gap: 7px;" id="reportIcon">
                      <img src='public/assets/icons/Report_icon.svg' fill="none"/>
                      <span id="buttonNamePlaceholder" style="font-size: 14px; font-family: Inter; font-weight: 600; text-align: center; padding-top: 2px;">
                        Báo cáo
                      </span>
                    </div>
                  </button>
                </div>
              </div>
          `);
            });
        }
    }

    function buildContent(item) {
        let markerContent = $(
            `<div class="d-flex adpointInfo adPoint${
                item.adsPoint.planningStatus === 'Đã quy hoạch' ? 'Blue' : 'Red'
            }"></div>`
        );
        markerContent.html(`
      <img src="/public/assets/icons/QC${
          item.adsPoint.planningStatus === 'Đã quy hoạch' ? 'Blue' : 'Red'
      }.svg" class="markerPlaceholder" alt="" srcset="">
      <img src="/public/assets/icons/Info_icon_${
          item.adsPoint.planningStatus === 'Đã quy hoạch' ? 'Blue' : 'Red'
      }.svg" class="icon" alt="" srcset="">
      <div class="details">
          <div class="d-flex justify-content-between align-items-center column-gap-3">

            <!-- location.locationName -->
            <h5>${item.locationName}</h5>
            <meta name="planningStatus" content="${item.adsPoint.planningStatus}"></meta>
            <!-- Button to trigger the modal -->
            <button
                type="button"
                class="btn btn-outline-danger"
                data-relatedToType="AdsPoint"
                data-relatedTo="${item.adsPoint._id}"
                data-ward="${item.ward}"
                data-district="${item.district}"
                onclick="reportButtonHandler(event)"
                style="display: flex; justify-content: center; align-items: center; column-gap: 7px; width:fit-content; min-width: 111px"
            >
                <img src='public/assets/icons/Report_icon.svg' fill="none"/>
                <span id="buttonNamePlaceholder" style="font-size: 14px; font-family: Inter; font-weight: 600; text-align: center; padding-top: 2px;">
                    Báo cáo
                </span>
            </button>

          </div>
          <!-- adsPoint.locationType -->
          <h6>${item.adsPoint.locationType}</h6>
          <!-- location.address -->
          <p>Phường <b>${item.ward}</b>\t Quận <b>${item.district}</b></p>
      </div>`);

        return markerContent[0];
    }

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
    new markerClusterer.MarkerClusterer({ markers, map, renderer: ClusterRenderrer });

    initAutocomplete();
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
                    let ward, district;

                    // Extract ward and district from address components
                    for (const result of response.results) {
                        for (const addrComponent of result.address_components) {
                            // Get the ward
                            if (addrComponent.types.includes('administrative_area_level_3')) {
                                ward = addrComponent.long_name;
                            } else {
                                // console.log('[Google Maps API] Fail to find ward in ', address);
                                ward = getWardFromAddress(address);
                            }

                            // Get the district
                            if (addrComponent.types.includes('administrative_area_level_2')) {
                                district = addrComponent.long_name;
                            } else {
                                // console.log('[Google Maps API] Fail to find district in ', address);
                                district = getDistrictFromAddress(address);
                            }
                        }

                        // Break the loop if both ward and district are found
                        if (ward !== undefined && district !== undefined) break;
                    }

                    // Create a Location object
                    let location = {
                        ...latlng.toJSON(),
                        locationName: address,
                        address: address,
                        ward: ward,
                        district: district
                    };

                    let place_request = {
                        placeId: address_id,
                        fields: ['name']
                    };

                    // getDetails to get the name of the place
                    place_service.getDetails(place_request, function (result, status) {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            location.locationName = result.name;
                            place_info.setContent(`
              <div class="d-flex align-items-center column-gap-2 info-board mb-2">
                <svg width="20" height="33" viewBox="0 0 29 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path id="" d="M26.5455 14.2727C26.5455 23.8182 14.2727 32 14.2727 32C14.2727 32 2 23.8182 2 14.2727C2 11.0178 3.29302 7.89618 5.5946 5.5946C7.89618 3.29302 11.0178 2 14.2727 2C17.5277 2 20.6493 3.29302 22.9509 5.5946C25.2524 7.89618 26.5455 11.0178 26.5455 14.2727Z" stroke="var(--Green2)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path id="" d="M14.2727 18.3636C16.532 18.3636 18.3636 16.5321 18.3636 14.2727C18.3636 12.0134 16.532 10.1818 14.2727 10.1818C12.0133 10.1818 10.1818 12.0134 10.1818 14.2727C10.1818 16.5321 12.0133 18.3636 14.2727 18.3636Z" stroke="var(--Green2)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                </svg>
                <div class="d-flex flex-column">
                    <h6 class="mb-1">${result.name}</h6>
                    <p>Phường <b>${ward}</b>\t Quận <b>${district}</b></p>
                </div>
              </div>
              <!-- Button to trigger the modal -->
              <button
                  type="button"
                  class="btn btn-outline-danger"
                  onclick="reportButtonHandler(event)"
                  data-relatedToType="Location"
                  data-relatedTo='${JSON.stringify(location)}'
                  style="display: flex; justify-content: center; align-items: center; column-gap: 7px; width: fit-content;"
              >
                  <img src='public/assets/icons/Report_icon.svg' fill="none"/>
                  <span id="buttonNamePlaceholder" style="font-size: 14px; font-family: Inter; font-weight: 600; text-align: center; padding-top: 2px;">
                      Báo cáo
                  </span>
              </button>
              `);
                            place_info.open({ map: map, shouldFocus: false }, place_marker);
                        } else {
                            place_info.setContent(address);
                            place_info.open({ map: map, shouldFocus: false }, place_marker);
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
                const bool =
                    marker.content.querySelector('meta[name="planningStatus"]').content ===
                    'Đã quy hoạch';
                marker.setMap(bool ? null : map);
            });
    });
});
