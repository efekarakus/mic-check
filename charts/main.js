function display(data) {
  // TODO create the plot here
  
  
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

display([]);