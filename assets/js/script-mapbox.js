mapboxgl.accessToken = 'pk.eyJ1IjoiZ2liZ2FiIiwiYSI6ImNsOG11cDBhODBhZDQzdW9hYjF5bjBuZXEifQ.r1lIsNWyoRbVwZy87Zzr4w';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL
    center: [2.3483915,48.8534951], // starting position [lng, lat]
    zoom: 2, // starting zoom
    projection: 'mercator' // display the map as a 3D globe
    });
 
map.on('style.load', () => {
   
});

const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [2.3483915,48.8534951]
        },
        properties: {
          title: 'Mapbox',
          description: 'Paris'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [2.3483,48.8534]
        },
        properties: {
          title: 'Mapbox',
          description: 'Paris Test'
        }
      }
    ]
  };

  // add markers to map
for (const feature of geojson.features) {
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'marker';
  
    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
  }