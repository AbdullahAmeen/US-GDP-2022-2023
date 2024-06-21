 var crs42303 = new L.Proj.CRS('EPSG:42303',
            '+proj=aea +lat_1=29.5 +lat_2=45.5 +lat_0=23 +lon_0=-96 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs', {
            resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1],
            origin: [0,0]
        });


var map = L.map('map', {
  crs: crs42303,
  maxZoom: 18,
	minZoom: 0,
}).setView([37.8, -96], 0);



var choroplethmap = L.choropleth(stategdps, {
	valueProperty: 'Population', // which property in the features to use
	scale: ['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#f03b20', '#bd0026'], // chroma.js scale - include as many as you like
	steps: 7, // number of breaks or steps in range
	mode: 'q', // q for quantile, e for equidistant, k for k-means
	style: {
		color: '#fff', // border color
		weight: 0.55,
		fillOpacity: 0.8
    
	},
	onEachFeature: function(feature, layer) {
		layer.bindPopup("<span class='headings'> State: </span>" + feature.properties.NAME + "<br>" + "<span class='headings'> Population: </span>" + feature.properties.Population.toLocaleString().replace(/B(?=(d{3})+(?!d))/g, ",")
     + "<br>" + "<span class='headings'>2023 GDP: </span>" + "$" + feature.properties.GDP .toLocaleString().replace(/B(?=(d{3})+(?!d))/g, ",") + "<br>" + "<span class='headings'>2022 GDP: </span>"+ "$"+ feature.properties.GDP2022.toLocaleString().replace(/B(?=(d{3})+(?!d))/g, ",")
     + "<br>" + "<span class='headings'>Growth in GDP: </span>" + feature.properties.ChangeGDP + "%"
    + "<br>" + "<span class='headings'>GDP by Counties: </span>" + feature.properties.CountieGDP)



    layer.on('mouseover', function(e) {
        //this.openPopup()
        e.target.setStyle({

          color: 'black',
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
    div.innerHTML = '<div class="min">' + '<span class = "legendtitle"> Total GDP - 2023</span>' + '<br>' +'<br>'+'$'+ limits[0].toLocaleString() + '</div> \
			<div class="max">' + '<br>' +'<br>' + '$' +limits[limits.length - 1].toLocaleString()

    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>')
      
    })

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
    
  }
  legend.addTo(map);


// Adding a line chart using Chart.js
new Chart(document.getElementById("gdplinechart"), {
  type: 'line',
  data: {
    labels: [1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,
            2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,
            2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023],
    datasets: [{ 
        data: [5963,6158,6520,6858,7287,7639,8073,8577,9062,9631,
              10250,10582,10929,11456,12217,13039,13815,14474,14769,14478,
              15049,15599,16254,16843,17550,18206,18695,19477,20533,21381,
              21060,23315,25439, 27360  
        ],
        label: "GDP in $Billion",
        borderColor: "#F69321",
        borderWidth:2,
        fontSize: 15,
        fill: 'red',
        borderColor: ['yellow' ],
        pointBackgroundColor: ['white'],
        pointBorderColor: ['white'],
        pointRadius:2,
        
        
      }
    ]
  },
  options:{
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero:true
            }
        }]
    }

  }
});
