function display(error, top, jungle, mid) {
  // TODO create the plot here
  var plot = comms();
  d3.select(".vis")
    .datum([{
      "position": "top",
      "seconds": top.seconds
    }, {
      "position": "jungle",
      "seconds": jungle.seconds
    }, {
      "position": "mid",
      "seconds": mid.seconds
    }])
    .call(plot);
  
  var steps = d3.selectAll(".step");
  var scroll = scroller()
    .container(d3.select(".graphic"));
  scroll(steps);
  
  scroll.on("active", function(index) { 
    steps.style("opacity", function(d, i) { return i === index ? 1 : 0.1; });
    // TODO activate section
  });
  
  scroll.on("progress", function(index, percentage) {
    // TODO update section
  });
}

queue()
  .defer(d3.json, "data/top-1986803606.json")
  .defer(d3.json, "data/jungle-1986803606.json")
  .defer(d3.json, "data/mid-1986803606.json")
  .await(display);