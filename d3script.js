if(datafile == null) alert("Error: No datafile!");
if(axesLabels == null) console.log("INFO: no Axes Labels given.");;
// Load  data 
var sourcesByName = {}, targetsByName = {}, links = [];
var w = h = 0;        
var xNames, yNames;

// Load data
d3.csv("data/" + datafile, function(error, data) {

    if(error) {
      alert("ERROR: data/" + datafile + " not found.");
      console.log(error);
    } 
    parseData(data);
    buildViz();    
    buildHtmlLegend();
    // buildSvgLegend(); TODO see 256

}); // d3.csv call

function mouseover(l) { 
  

        d3.selectAll(".xAxis text").classed("active", function(d, i) { 
          //console.log(l);
          return i == xNames.indexOf(l.target); });
        d3.selectAll(".yAxis text").classed("active", function(d, i) { 
          return i == yNames.indexOf(l.source); });

        var div = d3.select("#tooltip");
            div.transition()        
                .duration(100)      
                .style("opacity", .9); 

            div.html(             
              "<ul>" +
              "<li>" + l.source +
              "<li>" + l.target +
              "<li>Pfade: " + l.count +
              "<li>Positiv: " + l.positiv_prozent  + "%" +
              "</ul>")
              .style("left", (d3.event.pageX - 12) + "px")     
              .style("top", (d3.event.pageY + 30) + "px");              

 /*   

               
            div .html("INFO HERE")  
                .style("left", (d3.event.pageX - 12) + "px")     
                .style("top", (d3.event.pageY + 30) + "px");    
  */
}

function mouseout(l)  {  
  var div = d3.select("#tooltip");     
            div.transition()        
                .duration(100)      
                .style("opacity", 0);
     d3.selectAll("text").classed("active", false);
}  
/*
function mouseover(l) {
  //console.log(p);
  d3.selectAll(".xAxis text").classed("active", function(d, i) { 
    //console.log(l);
    return i == xNames.indexOf(l.target); });
  d3.selectAll(".yAxis text").classed("active", function(d, i) { 
    return i == yNames.indexOf(l.source); });
  d3.select("#status").html(
  "<ul>" +
  "<li>" + l.source +
  "<li>" + l.target +
  "<li>Pfade: " + l.count +
  "<li>Positiv: " + l.positiv_prozent  + "%" +
  "</ul>"
    );
}

function mouseout() {
   d3.selectAll("text").classed("active", false);
   d3.select("#status").text("");
}
*/
function buildViz() {
// tooltip
var tooltip = d3.select("body").append("div")   
    .attr("id", "tooltip")               
    .style("opacity", 0);

// Setup SVG Elem width, height
var nodeDistance = 15; // ABS
w = xNames.length * nodeDistance; 
h = yNames.length * nodeDistance;
var svg = setupSvgElement(w,h);

console.log("w, h: " + w + ", " + h);

var x = d3.scale.linear().domain([0, xNames.length - 1]).range([0, w]),
    y = d3.scale.linear().domain([0, yNames.length - 1]).range([0, h]);

// http://bl.ocks.org/mbostock/3892919  - how to use ticks
// http://www.d3noob.org/2013/01/adding-grid-lines-to-d3js-graph.html

var xAxis = d3.svg.axis().scale(x).orient("top") // tick direction
        .ticks(xNames.length -1) 
        .tickFormat(function (d, i) {            
          if(xNames[i].length > 30) {
            return xNames[i].substring(0, 30) + "..";
          } else {
            return xNames[i]
          }
        }),
    yAxis = d3.svg.axis().scale(y).orient("left")
        .ticks(yNames.length -1) 
        .tickFormat(function (d, i) {
          if(yNames[i].length > 30) {
            return yNames[i].substring(0, 30) + "..";
          } else {
            return yNames[i]
          }        
        }),

    xGrid = d3.svg.axis().scale(x).orient("bottom") // double axes for grid
        .ticks(xNames.length)
        .tickSize(-h, 0, 0)
        .tickFormat(function (d, i) {
          //console.log(targetsByName[xNames[i]]);
        }) 
        ,
    yGrid = d3.svg.axis().scale(y).orient("right")
        .ticks(yNames.length)
        .tickSize(-w, 0, 0)
        .tickFormat(function (d, i) {
          //console.log(sourcesByName[yNames[i]]);
        })
        ;

// Axes Labels
if(axesLabels) {
  svg.append("text")
      .attr("class", "caption")
      .attr("y", -20)
      .text(axesLabels[1]);
  svg.append("text")
      .attr("class", "caption")
      .attr("y", -20)
      //.attr("x", -20)
      .text(axesLabels[0])
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "end")
      ;
}
// End Axes Labels


// vertical labels - http://bl.ocks.org/mbostock/4403522 
svg.append("g")  
    .attr("class", "axis xAxis")
    .call(xAxis)
      .selectAll("text")
      .attr("y", 15)
      .attr("x", 12)        // distance text/axis
      .attr("dy", "-1em")  // center text on tick
      .attr("transform", "rotate(-75)")
      .style("text-anchor", "start")

    ;

svg.append("g")
    .attr("class", "axis yAxis")
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
            .range([(nodeDistance/5), (nodeDistance/1.5)]);
var opacity = d3.scale.linear()
    .domain([0 ,100])  
    .range([0.1,1]); // 0 (completely transparent) to 1 (solid colour).   

var link = svg.selectAll("circle")
    .data(links) // traversed data
    .enter()
    .append("g").attr("class", "link");    

    link.append("circle")
    .attr("class", "circle")
    .attr("cx", function (d) { return x(xNames.indexOf(d.target));})
    .attr("cy", function (d) { return y(yNames.indexOf(d.source)); })
    .transition()
    .duration(800)
    .attr("r", function (d) { 
      return r(d.count); })
    .style("fill", function(d) { 
      //return color(d.value);
      if(d.positiv > 0) {
        return "red";
      } else {
        return "green"; 
      } 
    })
    .style("opacity", function(d) { 
      if(d.positiv > 0) {
        return opacity(d.positiv_prozent);
      }
    })    
    .style("stroke", "white")
    ;

    link.on("mouseover", mouseover);
    link.on("mouseout", mouseout);

    link.append("text").text(
      function(d){
       if(d.positiv > 0)  return (d.positiv_prozent).toString();
      }
    )
    .attr("class", "linklabel") // rotate Label for readability
    .attr("x", function (d) { return x(xNames.indexOf(d.target));})
    .attr("y", function (d) { return y(yNames.indexOf(d.source)); })
    .attr("dx", 2)
    .attr("dy", 2) 
    .style("text-anchor", "center")
    //.attr("transform", "rotate(-45)," )
    .attr("transform", function(d) { 
      //console.log(d);
      return "rotate( 45, " + x(xNames.indexOf(d.target)) + "," + y(yNames.indexOf(d.source)) + ")";
     })
    ;

} // buildViz

function buildSvgLegend() {
  /* TODO
  svg = d3.select("#svg");
  svg.append("text")
          .attr("x", (width / 2))             
          .attr("y", 0 - (margin.top / 2))
          .attr("text-anchor", "middle")  
          .style("font-size", "16px") 
          .style("text-decoration", "underline")  
          .text("Value vs Date Graph");
          */
}

function buildHtmlLegend() {

  var maxLinkPosCount = d3.max(links, function (d) { return d.positiv; });
  var maxLinkCount = d3.max(links, function (d) { return d.count; });
  var sumLinkCount = d3.sum(links, function (d) { return d.count; });
  console.log("Max Link Count: " +  maxLinkCount);
  console.log("Max Pos Link Count: " +  maxLinkPosCount);
  console.log("Sum Links Count: " +  sumLinkCount);

  var legende = d3.select("#legende");
  legende.append("div").text("Data: " + datafile);
  legende.append("div").text("Verbindungen gesamt: " + sumLinkCount);
  legende.append("div").text("Max. Verbindungen: " + maxLinkCount);
  legende.append("div").text("Max. verst\u00e4rk. Verbindungen: " + maxLinkPosCount);
  legende.append("div").attr("id","kgreen").text(" 0 verst\u00e4rk. Verbindungen");
  legende.append("div").attr("id","kred").text(" 1 - " + maxLinkPosCount + " verst\u00e4rk. Verbindungen");
  //legende.append("br");
  legende.append("div").attr("id","prozente").text("Ziffern i.d. Matrix: Prozent positiv");
  //legende.append("hr");
 
}
function parseData(data) { // from d3.csv

    data.forEach(function (d) {

        if(d.source != "" && d.target != "" && d.target != "null") { // Warum sind Daten fehlerhaft?
          // count sources and targets
          var source = sourcesByName[d.source] || 
                      (sourcesByName[d.source] = {name: d.source, count: 0 });
              source.count += 1;

          var target = targetsByName[d.target] || 
                      (targetsByName[d.target] = {name: d.target, count: 0 });
              target.count += 1;

          var positiv_prozent = Math.ceil((100 * d.positiv) / d.pathes);
          //console.log("positiv_prozent - " + positiv_prozent);

          links.push({ "source": d.source,
                       "target": d.target,
                       "value": parseFloat(d.vuvalue),
                       "positiv": parseInt(d.positiv),
                       "count": parseInt(d.pathes),
                       "positiv_prozent": positiv_prozent
                     });
        } else {
          console.log("WARN: data error for - " + d.toString());
        }
    });

    yNames = d3.map(sourcesByName).keys().sort(d3.ascending);
    xNames = d3.map(targetsByName).keys().sort(d3.ascending);
} // parseData

function setupSvgElement(width,height) { // based on node count, without margins
// margin convention
// http://bl.ocks.org/mbostock/3019563 
// First define the margin object with properties for the four sides (clockwise from the top, as in CSS).
 
var margin = {top: 200, right: 300, bottom: 20, left: 300};

// Then define width and height as the inner dimensions of the chart area.

//var mdim = 600; // matrix width, height
var w = width + margin.left + margin.right,
    h = height + margin.top + margin.bottom;

console.log("w, h plus margins: " + w + ", " + h);    

// Lastly, define svg as a G element that translates the origin to the top-left corner of the chart area.

 
//var svg = d3.select("svg")
var svg = d3.select("#chart").append("svg")
    .attr("id", "svg")
    .attr("width", w )
    .attr("height", h )
    .attr("style", "background-color: white;")
    .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
/*
var svg = d3.select("#chart").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 

*/
// With this convention, all subsequent code can ignore margins.

return svg;
}

/* margin convention
// http://bl.ocks.org/mbostock/3019563 
// First define the margin object with properties for the four sides (clockwise from the top, as in CSS).
var margin = {top: 300, right: 300, bottom: 300, left: 300};

// Then define width and height as the inner dimensions of the chart area.

var mdim = 600; // matrix width, height
var w = mdim + margin.left + margin.right,
    h = mdim + margin.top + margin.bottom;

console.log("w, h: " + w + ", " + h);    

// Lastly, define svg as a G element that translates the origin to the top-left corner of the chart area.

var svg = d3.select("#chart").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// With this convention, all subsequent code can ignore margins.
*/
