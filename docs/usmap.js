// Learned from and References:
// https://bl.ocks.org/mbostock/6320825
// https://bl.ocks.org/mbostock/6320825
// https://plot.ly/javascript/choropleth-maps/

// still working on the color and scale 

var svg = d3.select("#svg").append("svg")



var path = d3.geoPath();

d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {


  var SCALE = 0.25;

  if (error) throw error;

  svg.append("g")
      .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path)
      .attr("transform", "scale(" + SCALE + ")");


  svg.append("path")
      .attr("class", "state-borders")
      .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
});