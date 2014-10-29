var param = "ZZ_Chemie.csv";

// margin convention
// http://bl.ocks.org/mbostock/3019563 
// First define the margin object with properties for the four sides (clockwise from the top, as in CSS).

var margin = {top: 20, right: 10, bottom: 300, left: 300};

// Then define width and height as the inner dimensions of the chart area.
// has to be w = h = 650
var w = 960 - margin.left - margin.right,
    h = 970 - margin.top - margin.bottom;

// Lastly, define svg as a G element that translates the origin to the top-left corner of the chart area.

var svg = d3.select("#chart").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// With this convention, all subsequent code can ignore margins.

// Load  data 
        
var nodesByName = {}, links = [];
d3.csv("data/" + param, function(error, data) {

    data.forEach(function (d) {
        if(d.source != "" && d.target != "") { // Daten sind fehlerhaft warum?
          // return only the distinct / unique nodes
          var source = d.source.substring(0, 10);

          nodesByName[d.source] = {name: d.source, group: d.skat };
          if(d.target != "null"){
            nodesByName[d.target] = {name: d.target, group: d.tkat  };
            links.push({ "source": d.source,
                               "target": d.target,
                               "value": parseFloat(d.vuvalue),
                               "count": parseInt(d.pathes)
            });
          }
        } else {
          // console.log("WARN: data error for - " + d.toString());
        }
    });

var nodesNames = d3.map(nodesByName).keys().sort(d3.ascending);
var nodesCount = nodesNames.length;

//console.log("nodesCount= " + nodesCount);

var x = d3.scale.linear().domain([0, nodesCount]).range([0, w]),
    y = d3.scale.linear().domain([0, nodesCount]).range([0, h]);

// http://bl.ocks.org/mbostock/3892919  - how to use ticks
// http://www.d3noob.org/2013/01/adding-grid-lines-to-d3js-graph.html

var xAxis = d3.svg.axis().scale(x).orient("bottom") // tick direction
        .ticks(nodesCount) 
        .tickFormat(function (d, i) {
            return nodesNames[i];
        }),
    yAxis = d3.svg.axis().scale(y).orient("left")
        .ticks(nodesCount) 
        .tickFormat(function (d, i) {
            return nodesNames[i];
        }),
    xGrid = d3.svg.axis().scale(x).orient("top") // double axes for grid
        .ticks(nodesCount)
        .tickSize(-h, 0, 0)
        .tickFormat("")  // hide labels
        ,
    yGrid = d3.svg.axis().scale(y).orient("left")
        .ticks(nodesCount)
        .tickSize(-w, 0, 0)
        .tickFormat("") // hide labels
        ;

// vertical labels - http://bl.ocks.org/mbostock/4403522 
svg.append("g")  
    .attr("class", "axis")
    .attr("transform", "translate(0, " + (h) + ")")
    .call(xAxis)
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", "-1em")
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start")
    ;
 
svg.append("g")
        .attr("class", "axis")
    .call(yAxis);

svg.append("g")         
    .attr("class", "grid")
    .call(xGrid); 

svg.append("g")         
    .attr("class", "grid")
   // .attr("transform", "translate("+(padding_left)+", 0)")
    .call(yGrid); 

/* TODO 
svg.append("text")
    .attr("class", "loading")
    .text("Loading ...")
    .attr("x", function () { return w/2; })
    .attr("y", function () { return h/2-5; });

d3.json(Data_url, function (punchcard_data) {
    var max_r = d3.max(punchcard_data.map(
                       function (d) { return d[2]; })),
        r = d3.scale.linear()
            .domain([0, d3.max(punchcard_data, function (d) { return d[2]; })])
            .range([0, 12]);
 
    svg.selectAll(".loading").remove();
 
    svg.selectAll("circle")
        .data(punchcard_data)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", function (d) { return x(d[1]); })
        .attr("cy", function (d) { return y(d[0]); })
        .transition()
        .duration(800)
        .attr("r", function (d) { return r(d[2]); });

}); // d3.json
*/

}); // d3.csv call
