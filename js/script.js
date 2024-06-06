 var crs42303 = new L.Proj.CRS('EPSG:42303',
            '+proj=aea +lat_1=29.5 +lat_2=45.5 +lat_0=23 +lon_0=-96 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs', {
            resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1],
            origin: [0, 0]
        });


var map = L.map('map', {
  crs: crs42303,
  scrollWheelZoom: false,
  maxZoom: 14,
	minZoom: -1,
}).setView([46, -97.0], 0.1);

var choroplethmap = L.choropleth(stategdp, {
	valueProperty: 'Population', // which property in the features to use
	scale: ['#ffffcc', '#c7e9b4', '#7fcdbb', '#41b6c4', '#2c7fb8', '#253494'], // chroma.js scale - include as many as you like
	steps: 7, // number of breaks or steps in range
	mode: 'q', // q for quantile, e for equidistant, k for k-means
	style: {
		color: '#fff', // border color
		weight: 0.75,
		fillOpacity: 0.8
    
	},
	onEachFeature: function(feature, layer) {
		layer.bindPopup("<span class='headings'> State: </span>" + feature.properties.NAME + "<br>" + "<span class='headings'> Population: </span>" + feature.properties.Population.toLocaleString().replace(/B(?=(d{3})+(?!d))/g, ",")
     + "<br>" + "<span class='headings'>2023 GDP: </span>" + "$" + feature.properties.GDP .toLocaleString().replace(/B(?=(d{3})+(?!d))/g, ",") + "<br>" + "<span class='headings'>2022 GDP: </span>"+ "$"+ feature.properties.GDP2022.toLocaleString().replace(/B(?=(d{3})+(?!d))/g, ",")
     + "<br>" + "<span class='headings'>Growth in GDP: </span>" + feature.properties.ChangeGDP + "%",)
    



    layer.on('mouseover', function(e) {
        //this.openPopup()
        e.target.setStyle({

          color: 'red',
          weight:2,
          fillOpacity: 0.8
        });
    });
    layer.on('mouseout', function(e) {
        e.target.setStyle({
          color: 'white',
          fillOpacity: 0.8
        });
    });
}
}).addTo(map)



var legend = L.control({ position: 'bottomright' })
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend')
    var limits = choroplethmap.options.limits
    var colors = choroplethmap.options.colors
    var labels = []

    // Add min & max // the toLocaleString() code add commas to large numbers.
    div.innerHTML = '<div class="labels"><div class="min">' + '$'+ limits[0].toLocaleString() + '</div> \
			<div class="max">' + '$' +limits[limits.length - 1].toLocaleString() + '</div></div>'

    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
    
  }
  legend.addTo(map);
