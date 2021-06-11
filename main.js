//Appel et configuration de la carte

var map = new mapboxgl.Map({
  container: "map",
  style: "https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json", //Fond de carte
  zoom: 10.3, // Zoom
  center: [1.757, 42.7105], // Centrage
  pitch: 10, // Inclinaison
  bearing: 0, // Rotation
  minZoom: 9, // Zoom min
});


var hoveredStateId = null;

map.on('load', function() {
  addSources();
  loadImages();
});


function addSources() {

  map.addSource("ccha_geom", {
    type: "geojson",
    'generateId': true,
    data: "https://raw.githubusercontent.com/bruhnild/ccha/main/data/ccha_geom.geojson",
  });

  map.addSource("ccha_geom_centroid", {
    type: "geojson",
    data: "https://raw.githubusercontent.com/bruhnild/ccha/main/data/ccha_geom_centroid.geojson",
  });


}

function loadImages() {
  console.log("loadImages");
  var total = 2;
  var currenti = 0;

  map.loadImage('https://static.thenounproject.com/png/462-200.png', function(error, image) {
    if (error) {
      console.log("tro", error)
    };
    map.addImage('Map-marker-02', image);
    addLayers()
  })
}



function addLayers() {

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
      "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false],
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

  // });

  map.addLayer({

    "id": "Commune etiquettes",
    "type": "symbol",
    "source": "ccha_geom_centroid",
    "layout": {


      "text-field": ['get', 'nom'],
      "text-size": 13,
      "text-offset": [0, 2.7],
      "text-font": ["Arial Unicode MS Regular"]
    },
    "paint": {
      "text-color": "hsl(200, 67%, 34%)",
      "text-halo-color": "hsl(0, 0%, 96%)",
      "text-halo-width": 3
    }
  });


  //Interactivité HOVER
   // When the user moves their mouse over the state-fill layer, we'll update the
  // feature state for the feature under the mouse.
  map.on("mousemove", "Communes hover", function(e) {

    if (e.features.length > 0 && (hoveredStateId !== e.features[0].id)) {
      if (hoveredStateId) {
        map.setFeatureState({
          source: 'ccha_geom',
          id: hoveredStateId
        }, {
          hover: false
        });
      }
      hoveredStateId = e.features[0].id;
      map.setFeatureState({
        source: 'ccha_geom',
        id: hoveredStateId
      }, {
        hover: true
      });

      const pd = document.getElementById('pd');
      pd.innerHTML =
        '<br>' + '<h2><b><div style="text-align: center;">' + e.features[0].properties.nom + '</b></h2>'
    }


  });

  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
  map.on("mouseleave", "Communes hover", function() {

    if (hoveredStateId) {
      map.setFeatureState({
        source: 'ccha_geom',
        id: hoveredStateId
      }, {
        hover: false
      });
    }
    hoveredStateId = null;
    const pd = document.getElementById('pd');
    pd.innerHTML =
      '<h2><b>Explorer la Communauté de Communes de Haute Ariège</b></h2>'

  });


  //Interactivité CLICK
  var markerHeight = 50,
    markerRadius = 10,
    linearOffset = 25;
  var popupOffsets = {
    'top': [0, 0],
    'top-left': [0, 0],
    'top-right': [0, 0],
    'bottom': [0, -markerHeight],
    'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'left': [markerRadius, (markerHeight - markerRadius) * -1],
    'right': [-markerRadius, (markerHeight - markerRadius) * -1]
  };

  map.on('click', 'Communes', function(e) {
    new mapboxgl.Popup({
        offset: popupOffsets,
        className: 'my-class'
      })
      .setLngLat(e.lngLat)
      .setHTML('<h4><b><font size="4"> <div style="text-align: center;">' + e.features[0].properties.nom + ' ' + '(' + e.features[0].properties.code_insee + ')' + '</h4></b></font>' +
        '<br>' + '<img src="' + e.features[0].properties.url_photo + '" alt="Photo de la commune"' + e.features[0].properties.nom + ' width="350">' +
        '<br>' + '<br>' + '<font size="3" style="color:#8ea7c5"><b> Caractéristiques</b></font>'

        +
        '<br>' + '<br>' + '<font size="2" style="color:#636466"> Population (2018) : </font>' + '<font size="2">' + e.features[0].properties.pop_2018 + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Superficie (km²) : </font>' + '<font size="2">' + e.features[0].properties.superficie_km + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Maire : </font>' + '<font size="2">' + e.features[0].properties.maire + '</font>'


        +
        '<br>' + '<font size="2" style="color:#636466"> Délégué(s) communautaire(s) pour la CCHA : </font>' + '<font size="2">' + e.features[0].properties.delegues_communautaires + '</font>'

        +
        '<br>' + '<br>' + '<font size="3" style="color:#8ea7c5"><b> Coordonnées</b></font>' +
        '<br>' + '<br>' + '<font size="2" style="color:#636466"> Adresse : </font>' + '<font size="2">' + e.features[0].properties.adresse + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Téléphone : </font>' + '<font size="2">' + e.features[0].properties.tel + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Email : </font>' + '<font size="2">' + e.features[0].properties.mail + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Site internet : </font>' + '<font size="2">' + e.features[0].properties.site_internet + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Horaires d\'ouverture : </font>' + '<font size="2">' + '<br>' + e.features[0].properties.horaires_ouverture + '</font>'+
        '<br>'+ '<br>' + '<font size="1" style="color:#8ea7c5"><b> Source : </font>' + '</b><font size="1">' + e.features[0].properties.source +'</font>'

      )
      .setMaxWidth("300px")
      .addTo(map);
  });


  map.on('mousemove', function(e) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ['Communes']
    });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
  });


  map.on('mouseenter', 'Communes', function() {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'Communes', function() {
    map.getCanvas().style.cursor = '';
  });


}


// Ajout controle de navigation et echelle

map.addControl(new mapboxgl.NavigationControl({
  position: "top-left"
}));

map.addControl(new mapboxgl.ScaleControl({
  position: "bottom-right"
}));