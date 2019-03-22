// this javascript file is used to produce linkage line graphs for four different types of policy indices 
//over year from 1996-2014 across different states

//References and Learned from:
//https://gist.github.com/mbostock/5977197
//https://beta.observablehq.com/@mbostock/d3-scatterplot
//https://github.com/mcnuttandrew/capp-30239/blob/master/week-7-d3/soln/index.js
//https://codepen.io/zakariachowdhury/pen/JEmjwq
//https://bl.ocks.org




d3.json("policyIndex.json", function(err,data) {
  /* Format Data */
  var parseDate = d3.timeParse("%Y");

  data.forEach(function(d) { 

    d.date = parseDate(d.Year);
    d.snapIndex = +d["Unweighted Eligibility index"];       
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


var width = 400;
var height = 300;
var margin = 50;
var duration = 250;

var lineOpacity = "0.25";
var lineOpacityHover = "0.85";
var otherLinesOpacityHover = "0.1";
var lineStroke = "1.5px";
var lineStrokeHover = "2.5px";



/* Scale */
var xValue = function(d) { return new Date(d.date).getUTCFullYear()}, // data -> value
    xScale = d3.scaleTime().range([0,width]); 

xScale.domain([new Date('1993'), new Date('2016')]);


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
  .x(d => xScale(d.date))
  .y(d => {
    return yScale(d["Unweighted Eligibility index"])
  });


let lines = svg.append('g')
  .attr('class', 'lines');

lines.selectAll('.line-group')
    .data(Object.values(groupeddata)).enter()
    .append('g')
    .attr('class', 'line-group')  
    .on("mouseover", function(d, i) {

    const thisState = d[0]['State name'];
    
      svg.append("text")
        .attr("class", "title-text")
        .attr("fill", color(i))        
        .text(d[0]["State name"])
        .attr("text-anchor", "start")
        .attr("x", (width-margin)/2+150)
        .attr("y", 50);
      
      d3.selectAll('.line-group')
        .attr('opacity', el => {
          return el[0]['State name'] === thisState ? 1 : 0;
        })
    })


    .on("mouseout", function(d) {
      svg.select(".title-text").remove();

      
      d3.selectAll('.line-group')
        .attr('opacity', lineOpacityHover);
          })


        .append('path')
        .attr('class', 'line')  
        .attr('d', d => { 
          return line(d)
        })
        .style('stroke', (d, i) => color(i))
        .attr('opacity', lineOpacity)

        .on("mouseover", function(d) {
            d3.selectAll('.path .line').filter(function(d1){
              return d[0]["State name"] == d1[0]["State name"]
            })
            .attr('opacity', otherLinesOpacityHover);
            
            d3.select(this)
              .attr('opacity', lineOpacityHover)
              .attr("stroke-width", lineStrokeHover)
              .style("cursor", "pointer");
          })

        .on("mouseout", function(d) {
            d3.selectAll(".line")
                .attr('opacity', lineOpacity);
          
            d3.select(this)
              .attr("stroke-width", lineStroke)
              .style("cursor", "none");
          });

        /* Add Axis into SVG */
        var xAxis = d3.axisBottom(xScale).tickFormat(function (d){
          return d.getUTCFullYear();
        })
                

        var yAxis = d3.axisLeft(yScale);

        svg.append("g")
          .attr("class", "x-axis")
          .attr("transform", `translate(0, ${height-margin})`)
          .call(xAxis)
          .append('text')
          .attr("x",380)
          .attr("y", -8)
          .attr("fill", "#000")
          .text("Year");

          
        svg.append("g")
          .attr("class", "y-axis")
          .call(yAxis)
          .append('text')
          .attr("y", 15)
          .attr("transform", "rotate(-90)")
          .attr("fill", "#000")
          .text("SNAP Policy Index");
        
      
      svg.append("text")
        .attr("x", 200)             
        .attr("y", -30)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("SNAP Eligibility Index");

});

