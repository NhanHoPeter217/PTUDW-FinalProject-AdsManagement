import getLocation from "/public/utils/getClientLocation.js";

// dynamic import gg map API
((g) => {
  var h,  
    a,
    k,
    p = "The Google Maps JavaScript API",
    c = "google",
    l = "importLibrary",
    q = "__ib__",
    m = document,
    b = window;
  b = b[c] || (b[c] = {});
  var d = b.maps || (b.maps = {}),
    r = new Set(),
    e = new URLSearchParams(),
    u = () =>
      h ||
      (h = new Promise(async (f, n) => {
        await (a = m.createElement("script"));
        e.set("libraries", [...r] + "");
        for (k in g)
          e.set(
            k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
            g[k],
          );
        e.set("callback", c + ".maps." + q);
        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
        d[q] = f;
        a.onerror = () => (h = n(Error(p + " could not load.")));
        a.nonce = m.querySelector("script[nonce]")?.nonce || "";
        m.head.append(a);
      }));
  d[l]
    ? console.warn(p + " only loads once. Ignoring:", g)
    : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
})({
  key: "AIzaSyAZP9odw7JOw7LqqIJXcfNxZIh4qxpEK6I",
  v: "weekly",
  language: "vi",
  // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
  // Add other bootstrap parameters as needed, using camel case.
});

// Initialize and add the map
let map;

async function initMap() {
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
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

  // The map, centered at center_position
  map = new Map(document.getElementById("map"), {
    zoom: 17,
    minZoom: 12,
    maxZoom: 100,
    center: clientLocation,
    mapId: "4fde48b8a0296373",
    keyboardShortcuts: false,
    disableDefaultUI: true,
    streetView: false,
    streetViewCotrol: false,
    streetViewControlOptions: false,
  });

  // The markers of all locations
  let markers = Array(locations.length);

  const parser = new DOMParser();

  // Ads' locations have been planned already
  const QCBlueSvgString =
    '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="17.5" fill="#0057FF" stroke="white"/><path d="M13.1676 20.1705H14.4631L15.375 21.3594L15.8054 21.8878L17.2585 23.7841H15.9119L14.9403 22.5185L14.608 22.0582L13.1676 20.1705ZM17.5398 18.6364C17.5398 19.5682 17.3693 20.3693 17.0284 21.0398C16.6875 21.7074 16.2202 22.2216 15.6264 22.5824C15.0355 22.9403 14.3636 23.1193 13.6108 23.1193C12.8551 23.1193 12.1804 22.9403 11.5866 22.5824C10.9957 22.2216 10.5298 21.706 10.1889 21.0355C9.84801 20.3651 9.67756 19.5653 9.67756 18.6364C9.67756 17.7045 9.84801 16.9048 10.1889 16.2372C10.5298 15.5668 10.9957 15.0526 11.5866 14.6946C12.1804 14.3338 12.8551 14.1534 13.6108 14.1534C14.3636 14.1534 15.0355 14.3338 15.6264 14.6946C16.2202 15.0526 16.6875 15.5668 17.0284 16.2372C17.3693 16.9048 17.5398 17.7045 17.5398 18.6364ZM16.2358 18.6364C16.2358 17.9261 16.1207 17.3281 15.8906 16.8423C15.6634 16.3537 15.3509 15.9844 14.9531 15.7344C14.5582 15.4815 14.1108 15.3551 13.6108 15.3551C13.108 15.3551 12.6591 15.4815 12.2642 15.7344C11.8693 15.9844 11.5568 16.3537 11.3267 16.8423C11.0994 17.3281 10.9858 17.9261 10.9858 18.6364C10.9858 19.3466 11.0994 19.946 11.3267 20.4347C11.5568 20.9205 11.8693 21.2898 12.2642 21.5426C12.6591 21.7926 13.108 21.9176 13.6108 21.9176C14.1108 21.9176 14.5582 21.7926 14.9531 21.5426C15.3509 21.2898 15.6634 20.9205 15.8906 20.4347C16.1207 19.946 16.2358 19.3466 16.2358 18.6364ZM26.43 17.1108H25.1005C25.0494 16.8267 24.9542 16.5767 24.815 16.3608C24.6758 16.1449 24.5053 15.9616 24.3036 15.8111C24.1019 15.6605 23.8761 15.5469 23.6261 15.4702C23.3789 15.3935 23.1161 15.3551 22.8377 15.3551C22.3349 15.3551 21.8846 15.4815 21.4869 15.7344C21.092 15.9872 20.7795 16.358 20.5494 16.8466C20.3221 17.3352 20.2085 17.9318 20.2085 18.6364C20.2085 19.3466 20.3221 19.946 20.5494 20.4347C20.7795 20.9233 21.0934 21.2926 21.4911 21.5426C21.8888 21.7926 22.3363 21.9176 22.8335 21.9176C23.109 21.9176 23.3704 21.8807 23.6175 21.8068C23.8675 21.7301 24.0934 21.6179 24.2951 21.4702C24.4968 21.3224 24.6673 21.142 24.8065 20.929C24.9485 20.7131 25.0465 20.4659 25.1005 20.1875L26.43 20.1918C26.359 20.6207 26.2212 21.0156 26.0167 21.3764C25.815 21.7344 25.555 22.044 25.2369 22.3054C24.9215 22.5639 24.5607 22.7642 24.1545 22.9062C23.7482 23.0483 23.305 23.1193 22.8249 23.1193C22.0692 23.1193 21.396 22.9403 20.805 22.5824C20.2141 22.2216 19.7482 21.706 19.4073 21.0355C19.0692 20.3651 18.9002 19.5653 18.9002 18.6364C18.9002 17.7045 19.0707 16.9048 19.4116 16.2372C19.7525 15.5668 20.2184 15.0526 20.8093 14.6946C21.4002 14.3338 22.0721 14.1534 22.8249 14.1534C23.288 14.1534 23.7198 14.2202 24.1204 14.3537C24.5238 14.4844 24.886 14.6776 25.207 14.9332C25.5281 15.1861 25.7937 15.4957 26.0039 15.8622C26.2141 16.2259 26.3562 16.642 26.43 17.1108Z" fill="white"/></svg>';

  // Ads' locations haven't been planned yet
  const QCRedSvgString =
    '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="17.5" fill="#D03535" stroke="white"/><path d="M13.1676 20.1705H14.4631L15.375 21.3594L15.8054 21.8878L17.2585 23.7841H15.9119L14.9403 22.5185L14.608 22.0582L13.1676 20.1705ZM17.5398 18.6364C17.5398 19.5682 17.3693 20.3693 17.0284 21.0398C16.6875 21.7074 16.2202 22.2216 15.6264 22.5824C15.0355 22.9403 14.3636 23.1193 13.6108 23.1193C12.8551 23.1193 12.1804 22.9403 11.5866 22.5824C10.9957 22.2216 10.5298 21.706 10.1889 21.0355C9.84801 20.3651 9.67756 19.5653 9.67756 18.6364C9.67756 17.7045 9.84801 16.9048 10.1889 16.2372C10.5298 15.5668 10.9957 15.0526 11.5866 14.6946C12.1804 14.3338 12.8551 14.1534 13.6108 14.1534C14.3636 14.1534 15.0355 14.3338 15.6264 14.6946C16.2202 15.0526 16.6875 15.5668 17.0284 16.2372C17.3693 16.9048 17.5398 17.7045 17.5398 18.6364ZM16.2358 18.6364C16.2358 17.9261 16.1207 17.3281 15.8906 16.8423C15.6634 16.3537 15.3509 15.9844 14.9531 15.7344C14.5582 15.4815 14.1108 15.3551 13.6108 15.3551C13.108 15.3551 12.6591 15.4815 12.2642 15.7344C11.8693 15.9844 11.5568 16.3537 11.3267 16.8423C11.0994 17.3281 10.9858 17.9261 10.9858 18.6364C10.9858 19.3466 11.0994 19.946 11.3267 20.4347C11.5568 20.9205 11.8693 21.2898 12.2642 21.5426C12.6591 21.7926 13.108 21.9176 13.6108 21.9176C14.1108 21.9176 14.5582 21.7926 14.9531 21.5426C15.3509 21.2898 15.6634 20.9205 15.8906 20.4347C16.1207 19.946 16.2358 19.3466 16.2358 18.6364ZM26.43 17.1108H25.1005C25.0494 16.8267 24.9542 16.5767 24.815 16.3608C24.6758 16.1449 24.5053 15.9616 24.3036 15.8111C24.1019 15.6605 23.8761 15.5469 23.6261 15.4702C23.3789 15.3935 23.1161 15.3551 22.8377 15.3551C22.3349 15.3551 21.8846 15.4815 21.4869 15.7344C21.092 15.9872 20.7795 16.358 20.5494 16.8466C20.3221 17.3352 20.2085 17.9318 20.2085 18.6364C20.2085 19.3466 20.3221 19.946 20.5494 20.4347C20.7795 20.9233 21.0934 21.2926 21.4911 21.5426C21.8888 21.7926 22.3363 21.9176 22.8335 21.9176C23.109 21.9176 23.3704 21.8807 23.6175 21.8068C23.8675 21.7301 24.0934 21.6179 24.2951 21.4702C24.4968 21.3224 24.6673 21.142 24.8065 20.929C24.9485 20.7131 25.0465 20.4659 25.1005 20.1875L26.43 20.1918C26.359 20.6207 26.2212 21.0156 26.0167 21.3764C25.815 21.7344 25.555 22.044 25.2369 22.3054C24.9215 22.5639 24.5607 22.7642 24.1545 22.9062C23.7482 23.0483 23.305 23.1193 22.8249 23.1193C22.0692 23.1193 21.396 22.9403 20.805 22.5824C20.2141 22.2216 19.7482 21.706 19.4073 21.0355C19.0692 20.3651 18.9002 19.5653 18.9002 18.6364C18.9002 17.7045 19.0707 16.9048 19.4116 16.2372C19.7525 15.5668 20.2184 15.0526 20.8093 14.6946C21.4002 14.3338 22.0721 14.1534 22.8249 14.1534C23.288 14.1534 23.7198 14.2202 24.1204 14.3537C24.5238 14.4844 24.886 14.6776 25.207 14.9332C25.5281 15.1861 25.7937 15.4957 26.0039 15.8622C26.2141 16.2259 26.3562 16.642 26.43 17.1108Z" fill="white"/></svg>';

  locations.map((location, index) => {
    const QC = parser.parseFromString(
      location.status ? QCBlueSvgString : QCRedSvgString,
      "image/svg+xml",
    ).documentElement;

    markers[index] = new AdvancedMarkerElement({
      map: map,
      position: {
        lat: Number(location.coords.lat),
        lng: Number(location.coords.lng),
      },
      content: QC,
      title: location.title,
    });
  });

  // Add a marker clusterer to manage the markers.
  new markerClusterer.MarkerClusterer({ markers, map });

  initAutocomplete();
}

function initAutocomplete() {
  // Create the search box and link it to the UI element.
  const input = document.getElementById("searchInput");
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place. 
  searchBox.addListener("places_changed", () => {
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
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        }),
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
}

initMap();