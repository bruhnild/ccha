
      //Appel et configuration de la carte

      var map = new mapboxgl.Map({
        container: "map",
        style:
          "https://geoserveis.icgc.cat/contextmaps/positron.json", //Fond de carte
        zoom: 10.3, // Zoom
        center: [1.757, 42.7105], // Centrage
        pitch: 10, // Inclinaison
        bearing: 0, // Rotation
        minZoom: 9, // Zoom min
      });


var hoveredStateId =  null;

map.on('load', function () {
    addSources();
    loadImages();
});


function addSources () {  

map.addSource("ccha_geom", {
  type: "geojson", 'generateId': true,
  data: "https://raw.githubusercontent.com/bruhnild/ccha/main/data/ccha_geom.geojson",
});

map.addSource("ccha_geom_centroid", {
  type: "geojson", 
  data: "https://raw.githubusercontent.com/bruhnild/ccha/main/data/ccha_geom_centroid.geojson",
});



}

function loadImages(){
    console.log("loadImages");
    var total = 2;
    var currenti = 0;

    map.loadImage('https://static.thenounproject.com/png/462-200.png', function(error, image) {
if (error) {console.log("tro", error)};
map.addImage('Map-marker-02', image);
addLayers()
})
}




function addLayers (){
 
var layers = map.getStyle().layers;
 
var labelLayerId;
for (var i = 0; i < layers.length; i++) {
if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
labelLayerId = layers[i].id;
break;
}
}

map.addLayer({
  id: "Communes",
  type: "fill",
  source: "ccha_geom",
  paint: {
    "fill-color": "hsla(208, 72%, 54%, 0.05)"
  },
  "maxzoom": 24,
  "minzoom": 0
});

   // The feature-state dependent fill-opacity expression will render the hover effect
    // when a feature's hover state is set to true.
    map.addLayer({
        "id": "Communes hover",
        "type": "fill",
        "source": "ccha_geom",
        "layout": {},
        "paint": {
            "fill-color": "#fff",
            "fill-opacity": ["case",
                ["boolean", ["feature-state", "hover"], false],
                0.5,
                0.1
            ],

            'fill-color': '#358FDE' 
        }
    });


map.addLayer({
  id: "Communes_contour",
  type: "line",
  source: "ccha_geom",
  paint: {
    "line-color": "hsl(200, 67%, 34%)",
    "line-width": 1
  },
  "maxzoom": 24,
  "minzoom": 0
});

map.addLayer({

            "id": "Commune etiquettes",
            "type": "symbol",
            "source": "ccha_geom_centroid",
            "layout": {
                "icon-image": "Map-marker-02", 
                "icon-size":  0.12,

                "text-field": ["to-string", ["get", "DD"]],
                "text-size": 13,
                "text-offset": [0, 2.7],
                "text-font": ["Montserrat SemiBold", "Arial Unicode MS Regular"]
            },
            "paint": {
                "text-halo-color": "hsl(0, 0%, 100%)",
                "text-halo-width": 1,
                "text-halo-blur": 1
            }
            });


//Interactivité CLICK


// Pop up chefs lieux
map.on('click', function (e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['Commune etiquettes'] });
if (!features.length) {
return;
}
var feature = features[0];
var popup = new mapboxgl.Popup({ offset: [0, -15] })
.setLngLat(feature.geometry.coordinates)

.setHTML( '<h4><b><font size="4"> <div style="text-align: center;">' + feature.properties.nom + ' ' + '(' + feature.properties.code_insee + ')' +'</h4></b></font>'
       + '<br>'+ '<img src="'+feature.properties.url_photo +'" alt="Photo de la commune"' + feature.properties.nom + 'width="350">' 
     + '<br>'+ '<br>' + '<font size="3" style="color:#8ea7c5"><b> Caractéristiques</b></font>'
  
        + '<br>'+ '<br>' + '<font size="2" style="color:#636466"> Population (2018) : </font>' + '<font size="2">'+feature.properties.pop_2018 +'</font>'
          + '<br>'+ '<font size="2" style="color:#636466"> Superficie (km²) : </font>' + '<font size="2">'+ feature.properties.superficie_km +'</font>'
           + '<br>'+ '<font size="2" style="color:#636466"> Maire : </font>' + '<font size="2">'+ feature.properties.maire +'</font>'

    
        + '<br>'+ '<font size="2" style="color:#636466"> Délégué(s) communautaire(s) pour la CCHA : </font>' + '<font size="2">'+ feature.properties.delegues_communautaires +'</font>'
   
   + '<br>' + '<br>'+ '<font size="3" style="color:#8ea7c5"><b> Coordonnées</b></font>'
    + '<br>'+   '<br>'+'<font size="2" style="color:#636466"> Adresse : </font>' + '<font size="2">'+ feature.properties.adresse +'</font>'
  + '<br>'+'<font size="2" style="color:#636466"> Téléphone : </font>' + '<font size="2">'+ feature.properties.tel +'</font>'
   + '<br>'+'<font size="2" style="color:#636466"> Email : </font>' + '<font size="2">'+ feature.properties.mail +'</font>'
    + '<br>'+'<font size="2" style="color:#636466"> Site internet : </font>' + '<font size="2">'+ feature.properties.site_internet +'</font>'
      + '<br>'+'<font size="2" style="color:#636466"> Horaires d\'ouverture : </font>' + '<font size="2">'+  '<br>'+feature.properties.horaires_ouverture +'</font>'
 )



.addTo(map);
});

map.on('mousemove', function (e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['Commune etiquettes'] });
map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});

// Change the cursor to a pointer when the mouse is over the states layer.
map.on('mouseenter', 'Commune etiquettes', function () {
map.getCanvas().style.cursor = 'pointer';
});
 
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'Commune etiquettes', function () {
map.getCanvas().style.cursor = '';
});

// Centrer la carte sur les coordonnées des couches 
map.on('click', '', function (e) {
map.flyTo({center: e.features[0].geometry.coordinates});
});


}


// Ajout controle de navigation et echelle

map.addControl(new mapboxgl.NavigationControl({ position: "top-left" }));

map.addControl(new mapboxgl.ScaleControl({ position: "bottom-right" }));

