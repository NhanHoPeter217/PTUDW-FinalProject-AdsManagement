import locations from "./locations.js"

// dynamic import gg map API
(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
  key: "AIzaSyD6ALcSgO0gSbi49A6J0njXYvwatQ-7kf0",
  v: "weekly",
  language: "vi"
  // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
  // Add other bootstrap parameters as needed, using camel case.
});

// Initialize and add the map
let map;

const mstyle = [
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
];


const center_position = { lat: 10.773815, lng: 106.697059};



async function initMap() {
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at center_position
  map = new Map(document.getElementById("map"), {
    zoom: 17,
    minZoom: 13,
    maxZoom: 19,
    center: center_position,
    keyboardShortcuts: false,
    disableDefaultUI: true,
    streetView: false,
    streetViewCotrol: false,
    streetViewControlOptions: false,
    styles: mstyle // Why this isnt working
  });

  // The markers of all locations
  let markers = Array(locations.length);

  locations.map((location, index) =>{
    markers[index] = new AdvancedMarkerElement({
      map: map,
      position: location.coords,
      title: location.title
    });
  })
}

initMap();
