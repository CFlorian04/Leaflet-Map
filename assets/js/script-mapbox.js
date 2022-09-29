mapboxgl.accessToken = 'pk.eyJ1IjoiZ2liZ2FiIiwiYSI6ImNsOG11cDBhODBhZDQzdW9hYjF5bjBuZXEifQ.r1lIsNWyoRbVwZy87Zzr4w';


var markers = [];
var vehicule = [];

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

async function addMarker(Coords)
{
    var id;
    if(markers.length == 0) { id = 0; } 
    else { id = markers[markers.length-1]._id + 1; }
    myMarker = new mapboxgl.Marker().setLngLat(Coords).addTo(map);
    myMarker._id = id;
    markers.push(myMarker);
}

function getLastMarkersID() {
  return markers[markers.length-1]._id;
}


map.on('click', (e) => {
  if($('#checkboxClickMap').is(':checked'))
  {
    id = addMarker(e.lngLat.wrap());
    isRoute();
  }
});
 

function isRoute() {

  if(getLastMarkersID() % 2 == 1)
  {
    console.log("Route créée !");
    getRoute(markers[getLastMarkersID()-1],markers[getLastMarkersID()]);
  }

}


/*------Routing-------*/
async function getRoute(start,end) {

var routeCoords =  start._lngLat.lng + ',' + start._lngLat.lat + ';' + end._lngLat.lng + ',' + end._lngLat.lat ;

const query = await fetch(
  `https://api.mapbox.com/directions/v5/mapbox/driving/` + routeCoords + `?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
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
      'line-color': '#3887be',
      'line-width': 5,
      'line-opacity': 0.75
    }
  });
}
// add turn instructions here at the end
}

function addVehicule() {

  let marker1 = new mapboxgl.Marker(el)
  .setLngLat([-99, 30])
  .addTo(map);
}
