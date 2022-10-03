mapboxgl.accessToken = 'pk.eyJ1IjoiZ2liZ2FiIiwiYSI6ImNsOG11cDBhODBhZDQzdW9hYjF5bjBuZXEifQ.r1lIsNWyoRbVwZy87Zzr4w';


var markers = []; //Contient tous les marqueurs posés par l'utilisateur
var vehicule = []; //Contient tous les marqueurs de vehicule
var feuTricolore = []; //Contient tous les marqueurs de feu tricolore
var routeVehicule = []; //Contient toutes les coordonnées de routes pour chaque trajet
var routeVehiculeDuration = []; //Contient toutes les durées relatives au coordonnées de routeVehicule[]
var indexRoute = []; //Contient l'avancement de chaque trajet de chaque vehicule 
var indexDuration = []; //Contient chaque durée relatives à l'avancement de indexRoute[]
var lastvehicule = null; //Contient l'ID du dernier marqueurs vehicule[]


//Creation de la carte
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

    //Permet de changer le curseur en fonction de l'état de la case à cocher
    $('#checkboxClickMap').click( function() {
      if($('#checkboxClickMap').is(':checked')) { $('canvas').css('cursor','crosshair'); }
      else { $('canvas').css('cursor', 'auto'); }
    });

  }
);


//addFeuRouge();

/*async function addFeuRouge() 
{
  const response = await fetch('././coord-feurouge.json');
  const json = await response.json();
  console.log(json); 

  for(var i = 0; i < json.length; i++)
  {
    //console.log(json[i]);
    //addMarker(json[i],3,feuTricolore);
  }
}*/

//Permet d'ajouter un marqueur en indiquant ces coordonnées, son type de marqueurse et son tableau de destination
async function addMarker(Coords,type,table)
{
    var id;
    //Attribut soit l'ID 0 au marqueur ou bien l'incrementation de 1 du dernier ID de son tableau
    if(table.length == 0) { id = 0;} 
    else { id = table[table.length-1]._id + 1; }

    //Attribut le type de marqueur
    var attribut;
    switch (type)
    {
      case 0 : markerColor = 'red'; break;
      case 1 : markerColor = 'blue'; break;
      case 2 : markerColor = 'green'; break;
      case 3 : markerColor = 'yellow'; break;
      default : markerColor = 'red'; break;
    }

    //Création du marqueur
    myMarker = new mapboxgl.Marker({color: markerColor}).setLngLat(Coords).addTo(map);
    myMarker._id = id;


    //Met le marqueur dans sa table choisi
    table.push(myMarker);


}

//Permet de recupérer la valeur du dernier ID d'une table
function getLastMarkersTableID(table) {
  return table[table.length-1]._id;
}

//Place un marqueur à l'endroit du clique si la case est cocher
map.on('click', (e) => {
  if($('#checkboxClickMap').is(':checked'))
  {
    addMarker(e.lngLat.wrap(),0,markers);
    isRoute();
  }
});


//Place un marqueur avec ces coordonnées via le formulaire d'ajout
$('#addMarker').on('click', (e) => {
  if($('#cooX').val() != null && $('#cooX').val() >= -90 && $('#cooX').val() <= 90 && $('#cooY').val() != null && $('#cooY').val() >= -90 && $('#cooY').val() <= 90 )
  {
    addMarker([$('#cooY').val(),$('#cooX').val()],0,markers);
    isRoute();
  }
});
 

//Vérifie si le marqueur est le 2e sans route. Si oui création du route entre les deux derniers marqueurs
function isRoute() {

  if(getLastMarkersTableID(markers) % 2 == 1)
  {
    var routeData = getRoute(markers[getLastMarkersTableID(markers)-1],markers[getLastMarkersTableID(markers)]);
  }
}


//Permet de créer une route entre deux coordonnées
async function getRoute(start,end) {

  var routeCoords =  start._lngLat.lng + ',' + start._lngLat.lat + ';' + end._lngLat.lng + ',' + end._lngLat.lat ;

  //Requete pour récupérer la route en deux coordonnées
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/` + routeCoords + `?steps=true&geometries=geojson&access_token=` + mapboxgl.accessToken,
    { method: 'GET' }
  );
  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;

  if(indexRoute[0] == null)
  {
    lastvehicule = -1;
  }


  var duration = [];
  var trajet = [];

  //Récupère dans trajet[] chaque coordonnées de passage et dans duration[] les durées et nombre de passage par durée
  for(var i = 0; i< json.routes[0].legs[0].steps.length-1; i++)
  {
    for(var y = 0; y < json.routes[0].legs[0].steps[i].geometry.coordinates.length; y++)
    {
      trajet.push(json.routes[0].legs[0].steps[i].geometry.coordinates[y]);
      duration.push(Math.floor(json.routes[0].legs[0].steps[i].duration));
    }
    
  }

  //Insère trajet[] et duration[] pour les relier avec leur vehicule respectif
  routeVehicule[lastvehicule + 1] = trajet;
  routeVehiculeDuration[lastvehicule +1] =  duration;

  //Création visuel de la route
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
        'line-cap': 'butt'
      },
      paint: {
        'line-color': 'red',
        'line-width': 5,
        'line-opacity': 1
      }
    });
  }

  //Ajoute le marqueur vehicule sur les coordonnées du marqueur de départ
  addMarker(markers[getLastMarkersTableID(markers)-1]._lngLat,1,vehicule);

  lastvehicule = getLastMarkersTableID(vehicule);
  indexDuration[lastvehicule] = 0;
  indexRoute[lastvehicule] = 0;

  requestAnimationFrame(animateMarker);

  return data;
}


function getDistance(lat1,lat2,lng1,lng2)
{
  var distance = 12756 * Math.asin(Math.sqrt(Math.pow(Math.sin((lat1 - lat2) * Math.PI / 360), 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.pow(Math.sin((lng1 - lng2) * Math.PI / 360), 2)));
  return distance;
}


function animateMarker(timestamp) {
  animateForEach(timestamp, lastvehicule);
}

function animateForEach(timestamp,idVehicule) {

  const vitesse = 0.000001;
  var temps = Math.floor(timestamp/100);
  var end = false;
  

  if(temps > indexDuration[idVehicule])
  {

    if(indexRoute[idVehicule] < routeVehicule[idVehicule].length-1)
    {
      var difCoordsY = (routeVehicule[idVehicule][indexRoute[idVehicule]][0]-routeVehicule[idVehicule][indexRoute[idVehicule]+1][0]);
      var difCoordsX = (routeVehicule[idVehicule][indexRoute[idVehicule]][1]-routeVehicule[idVehicule][indexRoute[idVehicule]+1][1]);
      
      indexDuration[idVehicule] = temps /*+ routeVehiculeDuration[idVehicule][indexRoute[idVehicule]]*/;
      if(difCoordsX != 0 || difCoordsY != 0)
      {
        var nb = Math.sqrt((difCoordsX*difCoordsX) + (difCoordsY*difCoordsY))*10000;
        console.log(nb);
        //var nb = (difCoordsX+difCoordsY)*10000;

        if(nb > 1 || nb < -1)
        {
          for(var z = 0; z < nb ; z++)
          {
            var partDifX = (difCoordsX/nb);
            var partDifY = (difCoordsY/nb);
            
            vehicule[idVehicule].setLngLat([vehicule[idVehicule]._lngLat.lng - partDifY, vehicule[idVehicule]._lngLat.lat - partDifX]);
            vehicule[idVehicule].addTo(map);
          }
        }
        else
        {
          vehicule[idVehicule].setLngLat(routeVehicule[idVehicule][indexRoute[idVehicule]]);
          vehicule[idVehicule].addTo(map);
        }
      }
      indexRoute[idVehicule] = indexRoute[idVehicule] + 1;
    }
  }
  requestAnimationFrame(animateMarker); 

}

