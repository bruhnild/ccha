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


var hoveredStateNom = "";

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

  map.addSource("etalab_contours_admin", {
    type: "vector",
    url: "https://openmaptiles.geo.data.gouv.fr/data/decoupage-administratif.json"
  });

}

function loadImages() {
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
    layout: {
      'visibility': 'visible'
    },
    paint: {
      "fill-color": "hsla(208, 72%, 54%, 0.05)"
    },

    "maxzoom": 24,
    "minzoom": 0
  });

  map.addLayer({
    id: "Communes_etalab",
    type: "fill",
    source: "etalab_contours_admin",
    "source-layer": "communes",
    paint: {
      "fill-color": "hsla(208, 72%, 54%, 0.05)"
    },
    "filter": ["all", ["in", "code",
      '09176',
      '09004',
      '09012',
      '09020',
      '09023',
      '09024',
      '09296',
      '09030',
      '09031',
      '09032',
      '09053',
      '09064',
      '09070',
      '09078',
      '09087',
      '09088',
      '09096',
      '09131',
      '09134',
      '09139',
      '09140',
      '09143',
      '09155',
      '09156',
      '09159',
      '09162',
      '09171',
      '09189',
      '09193',
      '09197',
      '09218',
      '09220',
      '09222',
      '09226',
      '09228',
      '09230',
      '09232',
      '09237',
      '09239',
      '09252',
      '09283',
      '09287',
      '09295',
      '09298',
      '09311',
      '09318',
      '09320',
      '09334',
      '09325',
      '09326',
      '09328',
      '09330'
    ]]
  });

  map.addLayer({
    id: "Communes contours etalab",
    type: "line",
    source: "etalab_contours_admin",
    "source-layer": "communes",
    paint: {
      "line-color": "hsl(200, 67%, 34%)",
      "line-width": 1
    },
    "filter": ["all", ["in", "code",
      '09176',
      '09004',
      '09012',
      '09020',
      '09023',
      '09024',
      '09296',
      '09030',
      '09031',
      '09032',
      '09053',
      '09064',
      '09070',
      '09078',
      '09087',
      '09088',
      '09096',
      '09131',
      '09134',
      '09139',
      '09140',
      '09143',
      '09155',
      '09156',
      '09159',
      '09162',
      '09171',
      '09189',
      '09193',
      '09197',
      '09218',
      '09220',
      '09222',
      '09226',
      '09228',
      '09230',
      '09232',
      '09237',
      '09239',
      '09252',
      '09283',
      '09287',
      '09295',
      '09298',
      '09311',
      '09318',
      '09320',
      '09334',
      '09325',
      '09326',
      '09328',
      '09330'
    ]]
  });



  map.addLayer({
    id: "Communes hover",
    type: "fill",
    source: "etalab_contours_admin",
    "source-layer": "communes",
    "layout": {},
    "paint": {
      "fill-color": "#358FDE",
      "fill-opacity": 0.5

    },
    filter: ["==", "nom", hoveredStateNom]
  });



  map.addLayer({
    id: "Communes_selected",
    type: "fill",
    source: "ccha_geom",
    paint: {
      "fill-color": "rgba( 253, 241, 100, 0.70 )"
    },
    filter: ["==", "nom", ""]
  });


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
  map.on("mousemove", "Communes_etalab", function(e) {
    var features = map.queryRenderedFeatures(e.point);
    if (e.features.length > 0 
      && features[0].properties 
      && features[0].properties.nom 
      && hoveredStateNom !== features[0].properties.nom)  
    {
      hoveredStateNom = features[0].properties.nom
      map.setFilter('Communes hover', ["==", "nom", hoveredStateNom]);
    }
   
    const pd = document.getElementById('pd');
    pd.innerHTML =
      '<br>' + '<h2><b><div style="text-align: center;">' + e.features[0].properties.nom + '</b></h2>'


  });



  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
  map.on("mouseleave", "Communes hover", function() {

    hoveredStateNom = ""
      map.setFilter('Communes hover', ["==", "nom", hoveredStateNom]);
    const pd = document.getElementById('pd');
    pd.innerHTML =
      '<h2><b>Explorer la Communauté de Communes de Haute Ariège</b></h2>'

  });


  //Interactivité CLICK
  var markerHeight = 50,
    markerRadius = 10,
    linearOffset = 0;
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
      })
      .setLngLat(e.lngLat)
      .setHTML(
        '<div class="popup-header" style="text-align: center;"><h2>' + e.features[0].properties.nom + ' ' + '(' + e.features[0].properties.code_insee + ')' + '</h2></div>' +
        '<h4><b><font size="4"> <div style="text-align: center;">' + e.features[0].properties.nom + ' ' + '(' + e.features[0].properties.code_insee + ')' + '</h4></b></font>' +
        '<br>' + '<img src="' + e.features[0].properties.url_photo + '" alt="Photo de la commune"' + e.features[0].properties.nom + ' width="350">' +

        '<br>' + '<br>' + '<font size="3" style="color:#358FDE"><b> Caractéristiques</b></font>' +
        '<br>' + '<br>' + '<font size="2" style="color:#636466"> Population (2018) : </font>' + '<font size="2">' + e.features[0].properties.pop_2018 + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Superficie (km²) : </font>' + '<font size="2">' + e.features[0].properties.superficie_km + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Maire : </font>' + '<font size="2">' + e.features[0].properties.maire + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Délégué(s) communautaire(s) pour la CCHA : </font>' + '<font size="2">' + e.features[0].properties.delegues_communautaires + '</font>' +

        '<br>' + '<br>' + '<font size="3" style="color:#358FDE"><b> Coordonnées</b></font>' +
        '<br>' + '<br>' + '<font size="2" style="color:#636466"> Adresse mairie: </font>' + '<font size="2">' + e.features[0].properties.adresse + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Téléphone : </font>' + '<font size="2">' + e.features[0].properties.tel + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Email : </font>' + '<font size="2">' + e.features[0].properties.mail + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Site internet : </font>' + '<font size="2">' + e.features[0].properties.site_internet + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Horaires d\'ouverture : </font>' + '<font size="2">' + '<br>' + e.features[0].properties.horaires_ouverture + '</font>' +
        '<br>' + '<br>' + '<font size="1" style="color:#8ea7c5"><b> Source : </font>' + '</b><font size="1">' + e.features[0].properties.source + '</font>'

      )
      .setMaxWidth("300px")
      .addTo(map);
  });

  // update filter to highlight clicked layer
  map.on('click', 'Communes_etalab', function(e) {
    var features = map.queryRenderedFeatures(e.point);
    map.setFilter('Communes_selected', ["==", "nom", features[0].properties.nom]);
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


  // Centrer la carte sur les coordonnées des couches 
  map.on('click', 'Commune etiquettes', function(e) {
    map.flyTo({
      center: e.features[0].geometry.coordinates
    });
  });


}



// Ajout controle de navigation et echelle

map.addControl(new mapboxgl.NavigationControl({
  position: "top-left"
}));

map.addControl(new mapboxgl.ScaleControl({
  position: "bottom-right"
}));