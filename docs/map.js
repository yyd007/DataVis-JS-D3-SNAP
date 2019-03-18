// Learned from and References:
//revised from
// https://bl.ocks.org/mbostock/6320825
// https://bl.ocks.org/mbostock/6320825
// https://plot.ly/javascript/choropleth-maps/



d3.json("policyIndex.json", function(err, data) {

  var config = {"color1":"#efebe6","color2":"#ef8f21","stateDataColumn":"State name","valueDataColumn":"Weighted SNAP policy index"}
  
  var WIDTH = 200, HEIGHT = 100;
  
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var COLOR_COUNTS = 9;
  
  var SCALE = 0.56;
  
  function valueFormat(d) {
      return d;  
  }

  var MAP_STATE = config.stateDataColumn;
  var MAP_VALUE = config.valueDataColumn;
  
  var width = WIDTH,
      height = HEIGHT;
  
  var valueById = d3.map();
  const projection = d3.geoAlbersUsa().scale(1000);//.center([-123, 45]);  
  var path = d3.geoPath(projection);

  var svg = d3.select("#canvas-svg").append("svg")
      .attr("width", width+"px")
      .attr("height", height+"px");

  
  d3.tsv("https://s3-us-west-2.amazonaws.com/vida-public/geo/us-state-names.tsv", function(error, names) {
  
  name_id_map = {};
  id_name_map = {};
  
  for (var i = 0; i < names.length; i++) {
    name_id_map[names[i].name] = names[i].id;
    id_name_map[names[i].id] = names[i].name;
  }
  
  data.forEach(function(d) {
    var id = name_id_map[d[MAP_STATE]];
    valueById.set(id); 
  });

 
 var lineOpacity = "0.25";
var lineOpacityHover = "0.85";
var otherLinesOpacityHover = "0.1";
var lineStroke = "1.5px";
var lineStrokeHover = "2.5px";



  d3.json("https://s3-us-west-2.amazonaws.com/vida-public/geo/us.json", function(error, us) {
    
    svg.append("g")
        .attr("class", "states-choropleth")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("transform", "scale(" + SCALE + ")")
        .attr("fill", function(d,i) {
            return color(i);
        })
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
        
        }).on("mouseover", function(d,i) {

                    activeState = id_name_map[d.id];
                    d3.selectAll(".line-group")
                    .attr('opacity', el => {
                      return el[0]['State name'] === activeState ? 1 : 0})
                    .attr("stroke-width", lineStrokeHover);
                        
        })

        
        .on("mouseout", function() {
          d3.selectAll('.line-group')
            .attr('opacity', lineOpacityHover);
                $(this).attr("fill-opacity", "1.0");
                $("#tooltip-container").hide();
            });

 
    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "states")
        .attr("transform", "translate(" + 650 + "," - 950 - ")")
        .attr("transform", "scale(" + SCALE + ")")
        .attr("d", path);

    svg.append("text")
        .attr("x", 270)             
        .attr("y", 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        //.style("text-decoration", "underline")  
        .text("US State MAP");
  });
  
  });
});


