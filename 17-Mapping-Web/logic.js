// Store our API endpoint inside queryUrl


  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap] //, earthquakes]
  });
  // streetmap.addTo(myMap)
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  //L.control.layers(baseMaps, overlayMaps, {
  //  collapsed: false
  //}).addTo(myMap);


function markerSize(population) {
    return population;
  }

var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

var earthMarkers = [];
// const API_KEY = "pk.eyJ1Ijoic2lka2F0ejQiLCJhIjoiY2pyeHRjdjc3MDZrNjN5b2F3MmR2NXdtZCJ9.iXd4qQKOU-loKtUA1O8fSw"
var earthquakes = new L.layerGroup();

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
 // createFeatures(data.features);
  function styleData(feature){
    return {
      fillColor: getColor(feature.properties.mag),
      radius: getRadius(feature.properties.mag),
      color: 'white',
      weight: 2,
      opacity: .7,
      fillOpacity: .7,
    };
  }
  function getColor(magnitude) {
    return magnitude > 5 ? '#B71C1C' :
    magnitude > 4 ? '#F4511E' :
    magnitude > 3 ? '#FB8C00' :
    magnitude > 2 ? '#FFEB3B' :
    magnitude > 1 ? '#FFEB3B' :
    magnitude > 0 ? '#FFEB3B' : '#4CAF50';
  }
  function getRadius(magnitude){
    if(magnitude > 5 ) return 25
    else if(magnitude > 4) return 20
    else if(magnitude > 3) return 15
    else if(magnitude > 2) return 10
    else if(magnitude > 1) return 5
    else return 1
  }
  function pointToLayer(feature, latlng){
    return new L.CircleMarker(latlng, styleData(feature))
  }
  function onEachFeature(feature, layer){
    layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p><p>" + new Date(feature.properties.time) + "</p><p> Magnitude: " + feature.properties.mag + "</p>");
    
  }
  L.geoJson(data, {pointToLayer: pointToLayer, onEachFeature: onEachFeature, style: styleData, color: getColor}).addTo(earthquakes)
  earthquakes.addTo(myMap);

  var legend = L.control({positions: 'bottomright'});

  legend.onAdd = function(myMap){
    var div = L.DomUtil.create('div', 'info legend');
    categories = [0, 1, 2, 3, 4, 5]
    labels = [];
    for(var i = 0; i < categories.length; i++){
      div.innerHTML += '<i style="background:' + getColor(categories[i] + 1) + '"></i>' +
      categories[i] + (categories[i + 1]? '&ndash;' + categories[i + 1] + '<br>' : '+');

    };
    return div;
  }
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  // function onEachFeature(feature, layer) {
    // layer.bindPopup("<h3>" + feature.properties.place +
    //   "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  //       console.log(feature.properties.place)
  //       temp = L.circle(feature.properties.place, {
  //           stroke: false,
  //           fillOpacity: 0.75,
  //           color: "purple",
  //           fillColor: "purple",
  //           radius: markerSize(feature.properties.mag)
  //       })
  //       earthMarkers.push(temp)
  //       return temp
        
  //  }


  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });
  console.log(earthMarkers)
  console.log(earthquakes)
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// function createMap(earthquakes) {

//   // Define streetmap and darkmap layers
//   var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.streets",
//     accessToken: API_KEY
//   });

//   var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.dark",
//     accessToken: API_KEY
//   });

//   // Define a baseMaps object to hold our base layers
//   var baseMaps = {
//     "Street Map": streetmap,
//     "Dark Map": darkmap
//   };

//   // Create overlay object to hold our overlay layer
//   var overlayMaps = {
//     Earthquakes: earthquakes
//   };

//   // Create our map, giving it the streetmap and earthquakes layers to display on load
//   var myMap = L.map("map", {
//     center: [
//       37.09, -95.71
//     ],
//     zoom: 5,
//     layers: [streetmap, earthquakes]
//   });

//   // Create a layer control
//   // Pass in our baseMaps and overlayMaps
//   // Add the layer control to the map
//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(myMap);
// };