function display(error, top, jungle, mid) {
  // TODO create the plot here
  var plot = comms();
  d3.select(".vis")
    .datum([top, jungle, mid])
    .call(plot);
  
  var steps = d3.selectAll(".step");
  var scroll = scroller()
    .container(d3.select(".graphic"));
  scroll(steps);
  
  scroll.on("active", function(index) { 
    steps.style("opacity", function(d, i) { return i === index ? 1 : 0.1; });
    plot.activate(index);
  });
  
  scroll.on("progress", function(index, percentage) {
    // TODO update section
  });
}

queue()
  .defer(d3.json, "data/top.json")
  .defer(d3.json, "data/jungle.json")
  .defer(d3.json, "data/mid.json")
  .await(display);