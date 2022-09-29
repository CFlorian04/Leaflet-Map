

var map;
var tiles;
createMap([48.8534951, 2.3483915]);



map.on('click', function(e) {
    if($('#checkboxClickMap').is(':checked'))
    {
        addMarker(e.latlng.lat,e.latlng.lng);
    }
});

//Affichage Feu Rouge (16e et 17e)
/*const myRenderer = L.canvas({ padding: 0.5 });

fetch("coord.json").then(r => r.json()).then(r => {
    r.forEach(coord => {
        L.circleMarker([coord.lat, coord.lng], {renderer: myRenderer}).addTo(map);
    });
    });
*/

function createMap(coord) {
    map = L.map('map').setView(coord, 14);
    tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
}


function coordstoArray(lat,lng)
{
    var coords = [];
    coords.push(lat);
    coords.push(lng);
    return coords;
}

var markers = [];
function addMarker(lat,lng)
{
    var coords = coordstoArray(lat,lng);
    var id;
    if(markers.length == 0) 
    {
        id = 0;
    } 
    else 
    {
        id = markers[markers.length-1]._id + 1;
    }
    myMarker = L.marker(coords, {draggable: false});
    myMarker._id = id;
    myMarker.bindPopup('<button onclick="clearMarker(' + id + ')">Supprimer</button>');
    console.log(myMarker);
    window.map.addLayer(myMarker);
    markers.push(myMarker);
    if(id > 0)
    {
        LineBetweenMarkers(myMarker._id);
    }


}


function LineBetweenMarkers(myMarkerid){
    var latlngs = Array();
    latlngs.push(markers[myMarkerid].getLatLng());
    latlngs.push(markers[myMarkerid-1].getLatLng());
    var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
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

