// References:
// https://bl.ocks.org/mbostock/6320825
// https://bl.ocks.org/mbostock/6320825
// https://plot.ly/javascript/choropleth-maps/


//add policy index data in 2014
d3.json("policyIndex.json", function(err, data) {

var config = {"stateDataColumn":"State name","valueDataColumn":"Weighted SNAP policy index"}

  const groupeddata = data.reduce((acc, row) => {
    if (!acc[row["State name"]]) {
      acc[row["State name"]] = [];
    }
    acc[row["State name"]].push(row);
    return acc;
  }, {});

  Object.keys(groupeddata).forEach(row => {
    groupeddata[row].sort((a, b) => a["Year"] - b["Year"]);
  })  
  
  //console.log(data)

  var config = {"stateDataColumn":"State name"}
  
  var WIDTH = 800, HEIGHT = 500;
  var SCALE = 0.7;

  var color = d3.scaleLog()
    .range(["#efebe6", "#ef8f21"])
    .interpolate(d3.interpolateHcl);
  
  
  function valueFormat(d) {
      return d;
  }
    
  var MAP_STATE = config.stateDataColumn;
  
  var width = WIDTH,
      height = HEIGHT;
  
  var valueById = d3.map();
  
  var quantize = d3.scaleQuantile()
                .domain([0, 1.0])
  
   var path = d3.geoPath();
  
  var svg = d3.select("#canvas-svg").append("svg")
      .attr("width", width)
      .attr("height", height);
  
 


  
//create state names and policy index text
  d3.tsv("https://s3-us-west-2.amazonaws.com/vida-public/geo/us-state-names.tsv", function(error, names) {
  
  name_id_map = {};
  id_name_map = {};
  
  for (var i = 0; i < names.length; i++) {
    name_id_map[names[i].name] = names[i].id;
    id_name_map[names[i].id] = names[i].name;
  }
  
  data.forEach(function(d) {
    var id = name_id_map[d[MAP_STATE]];
    //valueById.set(id); 
  });
  
 

 //create polygons for us states 
  d3.json("https://s3-us-west-2.amazonaws.com/vida-public/geo/us.json", function(error, us) {
    //color.domain([d3.quantile(MAP_VALUE, 8), d3.quantile(MAP_VALUE, 10)]);
    svg.append("g")
        .attr("class", "states-choropleth")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("transform", "scale(" + SCALE + ")")
        // .style("fill")
        // .style("fill", function(d) {
        //   return color(d[MAP_VALUE]);
        // })
        .attr("d", path)
        .on("mousemove", function(d) {
            var html = "";
  
            html += "<div class=\"tooltip_kv\">";
            html += "<span class=\"tooltip_key\">";
            html += id_name_map[d.id];
            html += "</span>";
            html += "<span class=\"tooltip_value\">";
            html += (valueById.get(d.id) ? valueFormat(valueById.get(d.id)) : "");
            html += "";
            html += "</span>";
            html += "</div>";
            
            $("#tooltip-container").html(html);
            $(this).attr("fill-opacity", "0.8");
            $("#tooltip-container").show();
            
            var coordinates = d3.mouse(this);
            
            var map_width = $('.states-choropleth')[0].getBoundingClientRect().width;
            
            if (d3.event.layerX < map_width / 2) {
              d3.select("#tooltip-container")
                .style("top", (d3.event.layerY + 15) + "px")
                .style("left", (d3.event.layerX + 15) + "px");
            } else {
              var tooltip_width = $("#tooltip-container").width();
              d3.select("#tooltip-container")
                .style("top", (d3.event.layerY + 15) + "px")
                .style("left", (d3.event.layerX - tooltip_width - 30) + "px");
            }
        })
        .on("mouseout", function() {
                $(this).attr("fill-opacity", "1.0");
                $("#tooltip-container").hide();
            });
  
    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "states")
        .attr("transform", "scale(" + SCALE + ")")
        .attr("d", path);
  });
  
  });
});



