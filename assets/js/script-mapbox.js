

/* LIENS

https://activebridge.org/blog/how-to-build-uber-car-animation-using-mapbox-markers-76a9aa42-82b5-4a3d-bd65-c96cf2b9d0cf

*/

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2liZ2FiIiwiYSI6ImNsOG11cDBhODBhZDQzdW9hYjF5bjBuZXEifQ.r1lIsNWyoRbVwZy87Zzr4w';


var markers = []; //Contient tous les marqueurs posés par l'utilisateur
var vehicule = []; //Contient tous les marqueurs de vehicule
var feuTricolore = []; //Contient tous les marqueurs de feu tricolore
var routeVehiculeSteps = []; //Contient toutes les coordonnées de routes pour chaque trajet
var indexRoute = []; //Contient l'avancement de chaque trajet de chaque vehicule 
var routeVehiculeData = []; //Contient chaque durée relatives à l'avancement de indexRoute[]
var lastvehicule = null; //Contient l'ID du dernier marqueurs vehicule[]


//Creation de la carte
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/gibgab/cl8mxqbqy00ai16piczjoxpmz?optimize=true',
  center: [2.339576040473537, 48.858435486415374],
  zoom: 12,
  projection: 'mercator',
  //optimizeForTerrain: true
});


$(
  function () {

    //Permet de changer le curseur en fonction de l'état de la case à cocher
    $('#checkboxClickMap').click(function () {
      if ($('#checkboxClickMap').is(':checked')) { $('canvas').css('cursor', 'crosshair'); }
      else { $('canvas').css('cursor', 'auto'); }
    });

  }
);

//Permet d'ajouter un marqueur en indiquant ces coordonnées, son type de marqueurse et son tableau de destination
async function addMarker(Coords, type, table) {
  var id;
  //Attribut soit l'ID 0 au marqueur ou bien l'incrementation de 1 du dernier ID de son tableau
  if (table.length == 0) { id = 0; }
  else { id = table[table.length - 1]._id + 1; }

  var el = document.createElement('div');
  el.className = 'car_marker';

  //Création du marqueur
  if (type != "Voiture") {
    myMarker = new mapboxgl.Marker({ color: 'red', anchor: 'center', justify: 'center' }).setLngLat(Coords).addTo(map);
  }
  else if (type == "Voiture") {
    myMarker = new mapboxgl.Marker(el, { anchor: 'center', justify: 'center' }).setLngLat(Coords).addTo(map);
  }

  myMarker._id = id;

  //Met le marqueur dans sa table choisi
  table.push(myMarker);


}

//Permet de recupérer la valeur du dernier ID d'une table
function getLastMarkersTableID(table) {
  return table[table.length - 1]._id;
}

//Place un marqueur à l'endroit du clique si la case est cocher
map.on('click', (e) => {
  if ($('#checkboxClickMap').is(':checked')) {
    addMarker(e.lngLat.wrap(), "", markers);
    createRoute();
  }
});


//Place un marqueur avec ces coordonnées via le formulaire d'ajout
$('#addMarker').on('click', (e) => {
  if ($('#cooX').val() != null && $('#cooX').val() >= -90 && $('#cooX').val() <= 90 && $('#cooY').val() != null && $('#cooY').val() >= -90 && $('#cooY').val() <= 90) {
    addMarker([$('#cooY').val(), $('#cooX').val()], "", markers);
    createRoute();
  }
});


//Vérifie si le marqueur est le 2e sans route. Si oui création du route entre les deux derniers marqueurs
function createRoute() {

  if (getLastMarkersTableID(markers) % 2 == 1) {
    var routeData = getRoute(markers[getLastMarkersTableID(markers) - 1], markers[getLastMarkersTableID(markers)]);
  }
}


//Permet de créer une route entre deux coordonnées
async function getRoute(start, end) {

  var routeCoords = start._lngLat.lng + ',' + start._lngLat.lat + ';' + end._lngLat.lng + ',' + end._lngLat.lat;

  //Requete pour récupérer la route en deux coordonnées
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/` + routeCoords + `?steps=true&geometries=geojson&access_token=` + mapboxgl.accessToken,
    { method: 'GET' }
  );
  const json = await query.json();
  const data = json.routes[0];
  //console.log(data);
  const route = data.geometry.coordinates;

  if (indexRoute[0] == null) {
    lastvehicule = -1;
  }


  var duration = [];
  var trajet = [];


  for (var i = 0; i < json.routes[0].legs[0].steps.length - 1; i++) {
    for (var y = 0; y < json.routes[0].legs[0].steps[i].geometry.coordinates.length; y++) {
      trajet.push(json.routes[0].legs[0].steps[i].geometry.coordinates[y]);
    }

  }

  //Récupère dans trajet[] chaque coordonnées de passage et dans duration[] les durées et nombre de passage par durée
  /* for (var i = 0; i < json.routes[0].geometry.coordinates.length - 1; i++) {
     trajet.push(json.routes[0].geometry.coordinates[i]);
   }*/
  routeVehiculeSteps[lastvehicule + 1] = trajet;
  console.log(routeVehiculeSteps[lastvehicule + 1]);

  var stepsDifCoords = [];
  var totalDifCoords = 0;
  for (var d = 0; d < routeVehiculeSteps[lastvehicule + 1].length - 1; d++) {
    var difCoordsLng = (routeVehiculeSteps[lastvehicule + 1][d + 1][0] - routeVehiculeSteps[lastvehicule + 1][d][0]);
    var difCoordsLat = (routeVehiculeSteps[lastvehicule + 1][d + 1][1] - routeVehiculeSteps[lastvehicule + 1][d][1]);
    var nb = Math.sqrt((difCoordsLat * difCoordsLat) + (difCoordsLng * difCoordsLng));

    var difCoordsTotal = {};
    difCoordsTotal["Latitude"] = difCoordsLat;
    difCoordsTotal["Longitude"] = difCoordsLng;
    difCoordsTotal["Total"] = nb;
    stepsDifCoords.push(difCoordsTotal);
    totalDifCoords += nb;
  }
  duration["Duree"] = json.routes[0].duration;
  duration["Distance"] = json.routes[0].distance;
  duration["totalDifCoords"] = totalDifCoords;
  duration["stepsDifCoords"] = stepsDifCoords;

  routeVehiculeData[lastvehicule + 1] = duration;

  for (var k = 0; k < routeVehiculeSteps[lastvehicule + 1].length - 1; k++) {
    routeVehiculeData[lastvehicule + 1].stepsDifCoords[k]["Pourcentage"] = routeVehiculeData[lastvehicule + 1].stepsDifCoords[k].Total / totalDifCoords;
  }
  console.log(routeVehiculeData[lastvehicule + 1]);


  //Création visuel de la route
  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route
    }
  };


  map.addLayer({
    id: 'route' + lastvehicule,
    type: 'line',
    source: {
      type: 'geojson',
      data: geojson
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'butt'
    },
    paint: {
      'line-color': 'red',
      'line-width': 5,
      'line-opacity': 1
    }
  });

  //Ajoute le marqueur vehicule sur les coordonnées du marqueur de départ
  addMarker(markers[getLastMarkersTableID(markers) - 1]._lngLat, "Voiture", vehicule);

  //Initialise les valeurs du vehicule;
  lastvehicule = getLastMarkersTableID(vehicule);
  indexRoute[lastvehicule] = 0;

  //Lance l'animation de la voiture
  requestAnimationFrame(animateMarker);

  return data;
}


function animateMarker() {
  animateForEach(lastvehicule);
}


var numDeltas;
var step;
var lng;
var lat;
var deltaLat;
var deltaLng;
var angle;

async function animateForEach(idVehicule) {


  for (var i = 0; i < routeVehiculeSteps[idVehicule].length; i++) {

    var last = 0;
    if (routeVehiculeSteps[idVehicule].length - 1 == i) {
      last = 1;
    }
    if (routeVehiculeData[idVehicule].stepsDifCoords[i - last].Pourcentage > 0) {
      vehicule[idVehicule].setLngLat(routeVehiculeSteps[idVehicule][i]);

      numDeltas = routeVehiculeData[idVehicule].Duree * routeVehiculeData[idVehicule].stepsDifCoords[i - last].Pourcentage;

      steps = 0;
      lng = routeVehiculeData[idVehicule].stepsDifCoords[i - last].Longitude;
      lat = routeVehiculeData[idVehicule].stepsDifCoords[i - last].Latitude;
      deltaLng = lng / numDeltas;
      deltaLat = lat / numDeltas;

      angle = turf.rhumbBearing(turf.point(routeVehiculeSteps[idVehicule][i + 1 - last]), turf.point(routeVehiculeSteps[idVehicule][i - last]));
      driveCar();

      function driveCar() {

        vehicule[idVehicule].setLngLat([vehicule[idVehicule]._lngLat.lng + deltaLng, vehicule[idVehicule]._lngLat.lat + deltaLat]);
        updateMarkerDirection();
        vehicule[idVehicule].addTo(map);
        if (steps < Math.floor(numDeltas)) {
          steps++;
          setTimeout(driveCar, 100);
          updateMarkerDirection();
        }
      };

      function updateMarkerDirection() {
        var carDirection = Math.floor(angle - map.getBearing());
        vehicule[idVehicule].setRotation(carDirection);
      };

    }
    await delay(100 * numDeltas);
    indexRoute[idVehicule]++;
  }


}

const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
}


/*CLUSTERS FEU TRICOLORE */

map.on('load', () => {
  map.addSource('tricolore', {
    type: 'geojson',
    data: '././signalisation-tricolore.geojson',
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
  });

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'tricolore',
    filter: ['has', 'point_count'],
    paint: {
      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        100,
        '#f1f075',
        750,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        100,
        30,
        750,
        40
      ]
    }
  });

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'tricolore',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  });

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'tricolore',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#b22222',
      'circle-radius': 4,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#000'
    }
  });
});
