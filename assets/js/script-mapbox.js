mapboxgl.accessToken = 'pk.eyJ1IjoiZ2liZ2FiIiwiYSI6ImNsOG11cDBhODBhZDQzdW9hYjF5bjBuZXEifQ.r1lIsNWyoRbVwZy87Zzr4w';


var markers = [];
var vehicule = [];
var feuTricolore = [];

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/gibgab/cl8mxqbqy00ai16piczjoxpmz?optimize=true', 
    center: [2.27587,48.85407], 
    zoom: 13, 
    projection: 'mercator', 
    optimizeForTerrain : true
});



$(
  function() {

    $('#checkboxClickMap').click( function() {
      if($('#checkboxClickMap').is(':checked')) { $('canvas').css('cursor','crosshair'); }
      else { $('canvas').css('cursor', 'auto'); }
    });

  }
);

async function addMarker(Coords,type,table)
{
    var id;
    if(table.length == 0) { id = 0;} 
    else { id = table[table.length-1]._id + 1; }
    var markerColor;
    switch (type)
    {
      case 0 : markerColor = 'red'; break;
      case 1 : markerColor = 'blue'; break;
      case 2 : markerColor = 'green'; break;
      case 3 : markerColor = 'yellow'; break;
      default : markerColor = 'red'; break;
    }

    myMarker = new mapboxgl.Marker({color: markerColor}).setLngLat(Coords).addTo(map);
    myMarker._id = id;

    console.log(myMarker);

    table.push(myMarker);
}

function getLastMarkersTableID(table) {
  return table[table.length-1]._id;
}


map.on('click', (e) => {
  if($('#checkboxClickMap').is(':checked'))
  {
    id = addMarker(e.lngLat.wrap(),0,markers);
    isRoute();
  }
});
 

function isRoute() {

  if(getLastMarkersTableID(markers) % 2 == 1)
  {
    getRoute(markers[getLastMarkersTableID(markers)-1],markers[getLastMarkersTableID(markers)]);
    addVehicule(markers[getLastMarkersTableID(markers)-1]);
  }



}


/*------Routing-------*/
async function getRoute(start,end) {

var routeCoords =  start._lngLat.lng + ',' + start._lngLat.lat + ';' + end._lngLat.lng + ',' + end._lngLat.lat ;

const query = await fetch(
  `https://api.mapbox.com/directions/v5/mapbox/driving/` + routeCoords + `?steps=true&geometries=geojson&access_token=` + mapboxgl.accessToken,
  { method: 'GET' }
);
const json = await query.json();
const data = json.routes[0];
console.log(data);
const route = data.geometry.coordinates;
const geojson = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: route
  }
};
// if the route already exists on the map, we'll reset it using setData
if (map.getSource('route')) {
  map.getSource('route').setData(geojson);
}
// otherwise, we'll make a new request
else {
  map.addLayer({
    id: 'route',
    type: 'line',
    source: {
      type: 'geojson',
      data: geojson
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': 'green',
      'line-width': 5,
      'line-opacity': 0.75
    }
  });
}
// add turn instructions here at the end
}

function addVehicule(marker) {

  addMarker(marker._lngLat,1,vehicule);
  requestAnimationFrame(animateMarker);
}


/* MAPBOX GeoDecoder
const coordinatesGeocoder = function (query) {
  // Match anything which looks like
  // decimal degrees coordinate pair.
  const matches = query.match(
  /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
  );
  if (!matches) {
  return null;
  }
   
  function coordinateFeature(lng, lat) {
  return {
  center: [lng, lat],
  geometry: {
  type: 'Point',
  coordinates: [lng, lat]
  },
  place_name: 'Lat: ' + lat + ' Lng: ' + lng,
  place_type: ['coordinate'],
  properties: {},
  type: 'Feature'
  };
  }
   
  const coord1 = Number(matches[1]);
  const coord2 = Number(matches[2]);
  const geocodes = [];
   
  if (coord1 < -90 || coord1 > 90) {
  // must be lng, lat
  geocodes.push(coordinateFeature(coord1, coord2));
  }
   
  if (coord2 < -90 || coord2 > 90) {
  // must be lat, lng
  geocodes.push(coordinateFeature(coord2, coord1));
  }
   
  if (geocodes.length === 0) {
  // else could be either lng, lat or lat, lng
  geocodes.push(coordinateFeature(coord1, coord2));
  geocodes.push(coordinateFeature(coord2, coord1));
  }
   
  return geocodes;
  };



map.addControl(
  new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  localGeocoder: coordinatesGeocoder,
  zoom: 15,
  placeholder: 'Try: -40, 170',
  mapboxgl: mapboxgl,
  reverseGeocode: true
  })
);
*/

/*
function animateMarker(timestamp) {
  const radius = 0.1;
   
  vehicule[0].setLngLat([
  vehicule[0]._lngLat.lng + radius,
  vehicule[0]._lngLat.lat + radius
  ]);
  vehicule[0].addTo(map);
  requestAnimationFrame(animateMarker);
  }
  */
