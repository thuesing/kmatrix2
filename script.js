var w = h = 650,   // http://bl.ocks.org/mbostock/3019563  - margin convention
    padding_top = 10, // oben
    padding_left = 300,
    label_pad = 100; // space for long labelnames
 
var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w + padding_left + 20)
        .attr("height", h + padding_top + 200);

var param = "ZZ_Chemie.csv";
        
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

var x = d3.scale.linear().domain([0, nodesCount]).range([padding_left, w + padding_left]),
    y = d3.scale.linear().domain([0, nodesCount]).range([padding_top, h + padding_top]);


//console.log(x);
// http://bl.ocks.org/mbostock/3892919  - how to use ticks
// http://www.d3noob.org/2013/01/adding-grid-lines-to-d3js-graph.html

var xAxis = d3.svg.axis().scale(x).orient("top") // tick direction
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

 
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, " + (padding_top + h) + ")")
    .call(xAxis)
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", "-1em")
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start")
      //.attr("text-anchor","begin")
      //.attr("transform", "rotate(90)")
      // vertical labels - http://bl.ocks.org/mbostock/4403522
    ;
 
svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate("+(padding_left)+", 0)")
    .call(yAxis);


svg.append("g")         
    .attr("class", "grid")
    .call(xGrid); 

svg.append("g")         
    .attr("class", "grid")
    .attr("transform", "translate("+(padding_left)+", 0)")
    .call(yGrid); 

/* 
svg.append("text")
    .attr("class", "loading")
    .text("Loading ...")
    .attr("x", function () { return w/2; })
    .attr("y", function () { return h/2-5; });
*/
/* TODO 
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
