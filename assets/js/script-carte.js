

var map = L.map('map').setView([48.8534951, 2.3483915], 14);

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


//Affichage Feu Rouge (16e et 17e)
/*const myRenderer = L.canvas({ padding: 0.5 });
fetch("coord-feurouge.json").then(r => r.json()).then(r => {
    r.forEach(coord => {
        L.circleMarker([coord.lat, coord.lng], {renderer: myRenderer}).addTo(map);
    });
    });
*/

var markers = [];


map.on('click', function(e) {
    console.log($('#checkboxClickMap').is(':checked'))
    if($('#checkboxClickMap').is(':checked'))
    {
        addMarker(e.latlng.lat,e.latlng.lng);
    }

});


function resetMap(lat,lng,zoom) {

    map.remove();
    map = L.map('map').setView(coordstoArray(lat,lng), zoom);
    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
}


function coordstoArray(lat,lng)
{
    var coords = [];
    coords.push(lat);
    coords.push(lng);

    return coords;
}

function addMarker(lat,lng)
{
    var coords = coordstoArray(lat,lng);
    var id;
    if(markers.length == 0) {id = 0;} else {id = markers[markers.length-1]._id + 1;}
    var popupContent = '<button onclick="clearMarker(' + id + ')">Supprimer</button>';
    myMarker = L.marker(coords, {draggable: false});
    myMarker._id = id;
    var myPopup = myMarker.bindPopup(popupContent, {closeButton: false});
    window.map.addLayer(myMarker);
    markers.push(myMarker);
}

function clearMarker(id) {
    console.log(markers);
    var new_markers = []
    markers.forEach(function(marker) {
        if (marker._id == id) {map.removeLayer(marker);}
        else {new_markers.push(marker);}
    })
    markers = new_markers;
}


$("#addMarker").click( function(){
    if($("#cooX").val().length != 0 && $("#cooY").val().length != 0)
    {
        addMarker($("#cooX").val(),$("#cooY").val());
    }
});

/*
var polygon = L.polygon([
    [48.8534951, 2.3483915],
    [48.86, 2.35],
    [48.85, 2.34]
]).addTo(map);
*/

/*
L.Routing.control({
waypoints: [
L.latLng(48.86, 2.35),
L.latLng(48.83, 2.33)
]
}).addTo(map);
*/
