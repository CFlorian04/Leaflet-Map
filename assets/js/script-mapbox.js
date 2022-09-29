mapboxgl.accessToken = 'pk.eyJ1IjoiZ2liZ2FiIiwiYSI6ImNsOG11cDBhODBhZDQzdW9hYjF5bjBuZXEifQ.r1lIsNWyoRbVwZy87Zzr4w';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/gibgab/cl8mxqbqy00ai16piczjoxpmz?optimize=true', // style URL
    center: [2.27587,48.85407], // starting position [lng, lat]
    zoom: 13, // starting zoom
    projection: 'mercator', // display the map as a 3D globe
    optimizeForTerrain : true
    });
 
map.on('style.load', () => {
   
});

const bounds = [
    [2.27587,48.85407],
    [2.27572,48.85370]
  ];

new mapboxgl.Marker().setLngLat([2.27587,48.85407]).addTo(map);

map.addControl(
    new MapboxDirections({
    accessToken: mapboxgl.accessToken
    }),
    'top-left'
    );