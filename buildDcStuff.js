
function buildDcStuff() {

    // pieChart
  var pieChart = dc.pieChart("#dc-pie-graph");
  var startValue = ndx.dimension(function (d) {
    return d.pathes;
  });
  var startValueGroup = startValue.group();
  pieChart.width(200)
      .height(200)
      .transitionDuration(1500)
      .dimension(startValue)
      .group(startValueGroup)
      .radius(90)
      .minAngleForLabel(0)
      .label(function(d) { return d.data.key; })
      .on("filtered", function (chart) {
        dc.events.trigger(function () {
          if(chart.filter()) {
            console.log(chart.filter());
            volumeChart.filter([chart.filter()-.25,chart.filter()-(-0.25)]);
            }
          else volumeChart.filterAll();
        });
    });
    console.log("startValueGroup: " + startValueGroup.top(1)[0].value);
  // Datatable Id??
  var dataTable = dc.dataTable("#dc-table-graph");
  var businessDimension = ndx.dimension(function (d) { 
    return d.source; 
  });
  dataTable.width(800).height(800)
    .dimension(businessDimension)
    .group(function(d) { return "List of all Selected Businesses"
     })
    .size(100)
      .columns([
          function(d) { return d.source; },
          function(d) { return d.target; },
          function(d) { return d.pathes; },
          function(d) { return d.vuvalue; },
      ])
      .sortBy(function(d){ return d.source; })
      // (optional) sort order, :default ascending
      .order(d3.ascending);

  // Render the Charts 
       
  dc.renderAll();
}
