// this javascript file is used to produce linkage line graphs for four different types of policy indices 
//over year from 1996-2014 across different states

//References and Learned from:
//https://gist.github.com/mbostock/5977197
//https://beta.observablehq.com/@mbostock/d3-scatterplot
//https://github.com/mcnuttandrew/capp-30239/blob/master/week-7-d3/soln/index.js
//https://codepen.io/zakariachowdhury/pen/JEmjwq
//https://bl.ocks.org

// still working on the label, scale and axis


d3.json("policyIndex.json", function(err,data) {
  /* Format Data */
  var parseDate = d3.timeParse("%Y");
  data.forEach(function(d) { 
    // console.log(d)
    d.date = parseDate(d.Year);
    d.snapIndex = +d["Weighted SNAP policy index"];    
    
  });


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


var width = 500;
var height = 300;
var margin = 50;
var duration = 250;

var lineOpacity = "0.25";
var lineOpacityHover = "0.85";
var otherLinesOpacityHover = "0.1";
var lineStroke = "1.5px";
var lineStrokeHover = "2.5px";

/* Scale */
var xScale = d3.scaleTime()
  .domain(d3.extent(data, d => new Date(d.date).getUTCFullYear()))
  .range([0, width-margin]);

var yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.snapIndex)])
  .range([height-margin, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

/* Add SVG */
var svg = d3.select("#chart-svg").append("svg")
  .attr("width", (width+margin)+"px")
  .attr("height", (height+margin)+"px")
  .append('g')
  .attr("transform", `translate(${margin}, ${margin})`);


/* Add line into SVG */
var line = d3.line()
  .x(d => xScale(new Date(d.date).getUTCFullYear()))
  .y(d => {
    //console.log(d["Weighted SNAP policy index"], yScale(d["Weighted SNAP policy index"]))
    return yScale(d["Weighted SNAP policy index"])
  });

let lines = svg.append('g')
  .attr('class', 'lines');

lines.selectAll('.line-group')
  .data(Object.values(groupeddata)).enter()
  .append('g')
  .attr('class', 'line-group')  
  .on("mouseover", function(d, i) {
      svg.append("text")
        .attr("class", "title-text")
        .style("fill", color(i))        
        .text(d.name)
        .attr("text-anchor", "middle")
        .attr("x", (width-margin)/2)
        .attr("y", 5);
    })
  .on("mouseout", function(d) {
      svg.select(".title-text").remove();
    })
  .append('path')
  .attr('class', 'line')  
  .attr('d', d => {
    //console.log(d)
    return line(d)
  })
  .style('stroke', (d, i) => color(i))
  .style('opacity', lineOpacity)
  .on("mouseover", function(d) {
      d3.selectAll('.line')
          .style('opacity', otherLinesOpacityHover);
      
      d3.select(this)
        .style('opacity', lineOpacityHover)
        .style("stroke-width", lineStrokeHover)
        .style("cursor", "pointer");
    })
  .on("mouseout", function(d) {
      d3.selectAll(".line")
          .style('opacity', lineOpacity);
    
      d3.select(this)
        .style("stroke-width", lineStroke)
        .style("cursor", "none");
    });


/* Add Axis into SVG */
var xAxis = d3.axisBottom(xScale).ticks(5);
var yAxis = d3.axisLeft(yScale).ticks(5);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${height-margin})`)
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append('text')
  .attr("y", 15)
  .attr("transform", "rotate(-90)")
  .attr("fill", "#000")
  .text("Total values");


});

