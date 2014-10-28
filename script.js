var w = h = 650,
    pad = 50, // oben
    left_pad = 500,
    label_pad = 100; // space for long labelnames
 
var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w + left_pad)
        .attr("height", h + pad);

var param = "ZZ_Chemie.csv";
        
var nodesByName = {}, links = [];
d3.csv("data/" + param, function(error, data) {

    data.forEach(function (d) {
        if(d.source != "" && d.target != "") { // Daten sind fehlerhaft warum?
          // return only the distinct / unique nodes
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
 
/*
var x = d3.scale.linear().domain([0, nodesCount - 1]).range([left_pad, w-pad]),
    y = d3.scale.linear().domain([0, nodesCount - 1]).range([pad, h-pad*2]);
 */

var x = d3.scale.linear().domain([0, nodesCount - 1]).range([left_pad, w + left_pad]),
    y = d3.scale.linear().domain([0, nodesCount - 1]).range([pad, h]);

console.log(x);

var xAxis = d3.svg.axis().scale(x).orient("bottom")
        .ticks(nodesCount) 
        .tickFormat(function (d, i) {
            return nodesNames[i];
        }),
    yAxis = d3.svg.axis().scale(y).orient("left")
        .ticks(nodesCount) 
        .tickFormat(function (d, i) {
            return nodesNames[i];
        });
 
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, "+(h-pad)+")")
    .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(90)")
      // vertical labels - http://bl.ocks.org/mbostock/4403522
    ;
 
svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate("+(left_pad-pad)+", 0)")
    .call(yAxis);

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
