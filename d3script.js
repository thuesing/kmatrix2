var param = "ZZ_Land-Klima.csv";

// margin convention
// http://bl.ocks.org/mbostock/3019563 
// First define the margin object with properties for the four sides (clockwise from the top, as in CSS).

var margin = {top: 300, right: 300, bottom: 300, left: 300};

// Then define width and height as the inner dimensions of the chart area.
// has to be w = h = 650
var w = 1200 - margin.left - margin.right,
    h = 1200 - margin.top - margin.bottom;

// Lastly, define svg as a G element that translates the origin to the top-left corner of the chart area.

var svg = d3.select("#chart").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// With this convention, all subsequent code can ignore margins.

// Load  data 
        
var sourcesByName = {}, targetsByName = {}, links = [];

d3.csv("data/" + param, function(error, data) {

    data.forEach(function (d) {

        if(d.source != "" && d.target != "" && d.target != "null") { // Warum sind Daten fehlerhaft?
          // count sources and targets
          var source = sourcesByName[d.source] || 
                      (sourcesByName[d.source] = {name: d.source, count: 0 });
              source.count += 1;
              //sourcesByName[d.source] = source;
               //console.log(sourcesByName[d.source]);
               //console.log(sourcesByName["Allg. THG-Emissionsreduktion"]);
               //console.log(d.source);
               //console.log(source);

          var target = targetsByName[d.target] || 
                      (targetsByName[d.target] = {name: d.target, count: 0 });
              target.count += 1;
              //console.log(targetsByName[d.target]);
              //targetsByName[d.target] = target;

          links.push({ "source": d.source,
                       "target": d.target,
                       "value": parseFloat(d.vuvalue),
                       "count": parseInt(d.pathes)});
        } else {
          // console.log("WARN: data error for - " + d.toString());
        }
    });

// TODO order by count
var yNames = d3.map(sourcesByName).keys().sort(d3.ascending);
var xNames = d3.map(targetsByName).keys().sort(d3.ascending);
// TODO var nodesCount = nodesNames.length;
console.log(sourcesByName);

//console.log(targetsByName);

var x = d3.scale.linear().domain([0, xNames.length - 1]).range([0, w]),
    y = d3.scale.linear().domain([0, yNames.length - 1]).range([0, h]);

// http://bl.ocks.org/mbostock/3892919  - how to use ticks
// http://www.d3noob.org/2013/01/adding-grid-lines-to-d3js-graph.html

var xAxis = d3.svg.axis().scale(x).orient("top") // tick direction
        .ticks(xNames.length) 
        .tickFormat(function (d, i) {            
          if(xNames[i].length > 40) {
            return xNames[i].substring(0, 38) + "..";
          } else {
            return xNames[i]
          }
        }),
    yAxis = d3.svg.axis().scale(y).orient("left")
        .ticks(yNames.length) 
        .tickFormat(function (d, i) {
          if(yNames[i].length > 40) {
            return yNames[i].substring(0, 38) + "..";
          } else {
            return yNames[i]
          }        
        }),

    xGrid = d3.svg.axis().scale(x).orient("bottom") // double axes for grid
        .ticks(xNames.length)
        .tickSize(-h, 0, 0)
        .tickFormat(function (d, i) {
          //console.log(targetsByName[xNames[i]]);
          //return targetsByName[xNames[i]].count;
        }) 
       //.tickFormat("")  // hide labels
        ,
    yGrid = d3.svg.axis().scale(y).orient("right")
        .ticks(yNames.length)
        .tickSize(-w, 0, 0)
        .tickFormat(function (d, i) {
          //console.log(sourcesByName[yNames[i]]);
        })
        //.tickFormat("") // hide labels
        ;

// vertical labels - http://bl.ocks.org/mbostock/4403522 
svg.append("g")  
    .attr("class", "axis")
    .call(xAxis)
      .selectAll("text")
      .attr("y", 15)
      .attr("x", 12)        // distance text/axis
      .attr("dy", "-1em")  // center text on tick
      .attr("transform", "rotate(-75)")
      .style("text-anchor", "start")

    ;
 
svg.append("g")
    .attr("class", "axis")
    .call(yAxis)
      .selectAll("text")
      .attr("y", 0)
      .attr("x", -12)        // distance text/axis;
    ;

svg.append("g")         
    .attr("class", "grid")  
    .attr("transform", "translate(0, " + (h) + ")")      
    .call(xGrid)
      .selectAll("text")
      .attr("x", 0)
      .attr("y", 12)        // distance text/axis
    ; 

svg.append("g")         
    .attr("class", "grid")
    .attr("transform", "translate("+ w +", 0)")
    .call(yGrid)
      .selectAll("text")
      .attr("x", 12)        // distance text/axis
    ; 

// circles
var r = d3.scale.linear()
            .domain([0, d3.max(links.map(function (d) {return d.count;}))])
            .range([2, 12]);

var color = d3.scale.linear()
    .domain([-1, 0, 1])
    .range(["green", "yellow", "red"]);

var circles = svg.selectAll("circle")
    .data(links) // traversed data
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", function (d) { return x(xNames.indexOf(d.target));})
    .attr("cy", function (d) { return y(yNames.indexOf(d.source)); })
    .transition()
    .duration(800)
    .attr("r", function (d) { return r(d.count); })
    .style("fill", function(d) { 
      return color(d.value);
      /*
      if(d.z > 0) {
        return "red";
      } else if(d.z < 0) {
        return "green"; 
      } else {
        return "yellow"; 
      }*/
    })
    ;


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