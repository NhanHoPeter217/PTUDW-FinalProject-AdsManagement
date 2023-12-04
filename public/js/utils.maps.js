import locations from "./locations.js"

// dynamic import gg map API
(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
  key: "AIzaSyAZP9odw7JOw7LqqIJXcfNxZIh4qxpEK6I",
  v: "weekly",
  language: "vi"
  // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
  // Add other bootstrap parameters as needed, using camel case.
});

// Initialize and add the map
let map;

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
    mapId: "4fde48b8a0296373",
    keyboardShortcuts: false,
    disableDefaultUI: true,
    streetView: false,
    streetViewCotrol: false,
    streetViewControlOptions: false,
  });

  // The markers of all locations
  let markers = Array(locations.length);
  let infoWindows = Array(locations.length);

  locations.map((location, index) =>{
    markers[index] = new AdvancedMarkerElement({
      map: map,
      position: { lat: Number(location.coords.lat), lng: Number(location.coords.lng) },
      title: location.title
    });
    infoWindows[index] = new google.maps.InfoWindow({
      content: `<div class="row justify-content-end mt-3 me-1">
      <div class="card ad-board primary-background primary-text" style="width: 100%;">
          <div class="d-flex align-items-start">
              <span id="boot-icon" class="bi bi-info-circle mt-3 ms-1 me-1 primary-icon" style="font-size: 20px; -webkit-text-stroke-width: 1px;"></span>
              <div class="card-body ps-2">
                  <h5 class="card-title">Trụ, cụm pano</h5>
                  <p class="card-text-location">Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao), phường Bến Nghé, Quận 1</p>
                  <p class="card-text">
                      <span class="label">Kích thước:</span>
                      <span class="value">2.5m x 10m</span>
                  </p>
                  <p class="card-text">
                      <span class="label">Số lượng:</span>
                      <span class="value">1 trụ / bảng</span>
                  </p>
                  <p class="card-text">
                      <span class="label">Hình thức:</span>
                      <span class="value">Cổ động chính trị</span>
                  </p>
                  <p class="card-text">
                      <span class="label">Phân loại:</span>
                      <span class="value">Đất công / Công viên / Hành lang an toàn giao thông</span>
                  </p>
              </div>
          </div>
          <button href="#" type="button" class="btn btn-outline-danger mb-3 ms-5 me-5 report-background" >
              <i class="bi bi-info-circle-fill me-1" style="font-size: 20px;"></i>
              <span id="buttonName" class="button-font">Báo cáo vi phạm</span>
          </button>
      </div>
  </div>
  
  <script src="public/js/adBoard.js"></script>
  <link href="public/css/colors.css" rel="stylesheet">
  <link href="public/css/style.css" rel="stylesheet">`
    })

    markers[index].addListener("click", () => {
      // infoWindows[index].open({
      //   anchor: markers[index],
      //   map
      // })
    })
  })
}

initMap();
