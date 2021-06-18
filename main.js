//YOUR TURN: Replace with a link to your CSV
const csvUrl =
  "https://raw.githubusercontent.com/bruhnild/ccha/main/data/ccha.csv";

const csvPromise = papaPromise(csvUrl);

var map = new mapboxgl.Map({
  container: "map",
  style: "https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json", //Fond de carte
  zoom: 10.3, // Zoom
  center: [1.757, 42.7105], // Centrage
  pitch: 10, // Inclinaison
  bearing: 0, // Rotation
  minZoom: 9, // Zoom min
  transformRequest: transformRequest,

});

var hoveredStateNom = "";

map.on('load', function() {
  addSources();
  addLayers();
});

function addSources() {

  map.addSource("etalab_contours_admin", {
    type: "vector",
    url: "https://openmaptiles.geo.data.gouv.fr/data/decoupage-administratif.json",
    promoteId: "code",
  });


  // Ajout de la source
  map.addSource('bright', {
    type: 'vector',
    url: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json'
  });

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

  csvPromise.then(function(results) {
    console.log(results.data);
    results.data.forEach((row) => {
      map.setFeatureState({
          //YOUR TURN: Replace with your source tileset and source layer
          source: "etalab_contours_admin",
          sourceLayer: "communes",
          //YOUR TURN: Replace with unqiue ID row name
          id: row.code_insee,
        },
        //YOUR TURN: Add rows you want to style/interact with
        {
          nom: row.nom,
          code_insee: row.code_insee,
          gentile: row.gentile,
          superficie_km: row.superficie_km,
          pop_2018: row.pop_2018,
          densite_hab_km: row.densite_hab_km,
          url_photo: row.url_photo,
          maire: row.maire,
          delegues_communautaires: row.delegues_communautaires,
          adresse: row.adresse,
          tel: row.tel,
          mail: row.mail,
          site_internet: row.site_internet,
          horaires_ouverture: row.horaires_ouverture,
          source: row.source,
        }
      );
    });
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
    id: "Communes_contours_etalab",
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
    id: "Communes_hover",
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
    source: "etalab_contours_admin",
    "source-layer": "communes",
    paint: {
      "fill-color": "rgba( 253, 241, 100, 0.70 )"
    },
    filter: ["==", "nom", ""]
  });



  map.addLayer({
    "id": "Commune_etiquettes",
    "type": "symbol",
    "metadata": {
      "mapbox:group": "1444849242106.713"
    },
    "source": "openmaptiles",
    "source-layer": "place",

    filter: [
      "all", ["all", ["in", "name:latin",
        'Luzenac',
        'Albiès',
        'Appy',
        'Artigues',
        'Ascou',
        'Aston',
        'Aulos',
        'Auzat',
        'Axiat',
        'Ax-les-Thermes',
        'Bestiac',
        'Bouan',
        'Les Cabannes',
        'Carcanières',
        'Caussou',
        'Caychax',
        'Château-Verdun',
        'Garanou',
        'Gestiès',
        'L\'Hospitalet-près-l\'Andorre',
        'Ignaux',
        'Illier-et-Laramade',
        'Larcat',
        'Larnat',
        'Lassur',
        'Lercoul',
        'Lordat',
        'Mérens-les-Vals',
        'Mijanès',
        'Montaillou',
        'Orgeix',
        'Orlu',
        'Orus',
        'Pech',
        'Perles-et-Castelet',
        'Le Pla',
        'Prades',
        'Le Puch',
        'Quérigut',
        'Rouze',
        'Savignac-les-Ormeaux',
        'Senconac',
        'Siguer',
        'Sinsat',
        'Sorgeat',
        'Tignac',
        'Unac',
        'Urs',
        'Val-de-Sos',
        'Vaychis',
        'Vèbre',
        'Verdun',
        'Vernaux'
      ]],
      ["==", "class", "village"],
    ],
    "layout": {
      "text-field": "{name:latin}\n{name:nonlatin}",
      "text-font": ["Noto Sans Bold"],
      "text-max-width": 8,
      "text-size": {
        "base": 1.2,
        "stops": [
          [10, 12],
          [15, 22]
        ]
      },
      "visibility": "visible"
    },
    "paint": {
      "text-color": "hsl(200, 67%, 34%)",
      "text-halo-color": "rgba(255,255,255,0.8)",
      "text-halo-width": 1.2
    }
  });

  //Interactivité HOVER
  // When the user moves their mouse over the state-fill layer, we'll update the
  // feature state for the feature under the mouse.
  map.on("mousemove", "Communes_etalab", function(e) {
    var features = map.queryRenderedFeatures(e.point);
    if (e.features.length > 0 &&
      features[0].properties &&
      features[0].properties.nom &&
      hoveredStateNom !== features[0].properties.nom) {
      hoveredStateNom = features[0].properties.nom
      map.setFilter('Communes_hover', ["==", "nom", hoveredStateNom]);
    }

    const pd = document.getElementById('pd');
    pd.innerHTML =
      '<br>' + '<h2><b><div style="text-align: center;">' + e.features[0].properties.nom + '</b></h2>'


  });

  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
  map.on("mouseleave", "Communes_hover", function() {

    hoveredStateNom = ""
    map.setFilter('Communes_hover', ["==", "nom", hoveredStateNom]);
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

  map.on('click', 'Communes_etalab', function(e) {
    map.getCanvas().style.cursor = "pointer";
    var communes = map.queryRenderedFeatures(e.point, {
      layers: ["Communes_etalab"],
    });

    var props = communes[0].properties;

    var state = communes[0].state;

    new mapboxgl.Popup({
        offset: popupOffsets,
      })
      .setLngLat(e.lngLat)
      .setHTML(
        '<div class="popup-header" style="text-align: center;"><h2>' + state.nom + ' ' + '(' + state.code_insee + ')' + '</h2></div>' +
        '<h4><b><font size="4"> <div style="text-align: center;">' + state.nom + ' ' + '(' + state.code_insee + ')' + '</h4></b></font>' +
        '<br>' + '<img src="' + state.url_photo + '" alt="Photo de la commune"' + state.nom + ' width="350">' +

        '<br>' + '<br>' + '<font size="3" style="color:#358FDE"><b> Caractéristiques</b></font>' +
        '<br>' + '<br>' + '<font size="2" style="color:#636466"> Population (2018) : </font>' + '<font size="2">' + state.pop_2018 + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Superficie (km²) : </font>' + '<font size="2">' + state.superficie_km + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Maire : </font>' + '<font size="2">' + state.maire + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Délégué(s) communautaire(s) pour la CCHA : </font>' + '<font size="2">' + state.delegues_communautaires + '</font>' +

        '<br>' + '<br>' + '<font size="3" style="color:#358FDE"><b> Coordonnées</b></font>' +
        '<br>' + '<br>' + '<font size="2" style="color:#636466"> Adresse mairie: </font>' + '<font size="2">' + state.adresse + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Téléphone : </font>' + '<font size="2">' + state.tel + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Email : </font>' + '<font size="2">' + state.mail + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Site internet : </font>' + '<font size="2">' + state.site_internet + '</font>' +
        '<br>' + '<font size="2" style="color:#636466"> Horaires d\'ouverture : </font>' + '<font size="2">' + '<br>' + state.horaires_ouverture + '</font>' +
        '<br>' + '<br>' + '<font size="1" style="color:#8ea7c5"><b> Source : </font>' + '</b><font size="1">' + state.source + '</font>'

      )
      .setMaxWidth("300px")
      .addTo(map);
  });

  // update filter to highlight clicked layer
  map.on('click', 'Communes_etalab', function(e) {
    map.getCanvas().style.cursor = "pointer";

    var communes = map.queryRenderedFeatures(e.point, {
      layers: ["Communes_etalab"],
    });

    var props = communes[0].properties;

    var state = communes[0].state;

    map.setFilter('Communes_selected', ["==", "nom", communes[0].properties.nom]);
  });


  map.on('mousemove', function(e) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ['Communes_etalab']
    });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
  });


  map.on('mouseenter', 'Communes_etalab', function() {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'Communes_etalab', function() {
    map.getCanvas().style.cursor = '';
  });


  // Centrer la carte sur les coordonnées des couches 
  map.on('click', 'Commune_etiquettes', function(e) {
    map.flyTo({
      center: e.features[0].geometry.coordinates
    });
  });


}

function transformRequest(url, resourceType) {
  var isMapboxRequest =
    url.slice(8, 22) === "api.mapbox.com" ||
    url.slice(10, 26) === "tiles.mapbox.com";
  return {
    url: isMapboxRequest ?
      url.replace("?", "?pluginName=dataJoins&") : url,
  };
}

function papaPromise(url) {
  return new Promise(function(resolve, reject) {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: resolve,
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