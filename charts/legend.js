function legend() {
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
      width = 220 - margin.left - margin.right,
      height = 220 - margin.top - margin.bottom;
      
  var svg = d3.select(".objectivecontrol-legend")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
  svg.append("text")
    .attr("x", 0)
    .attr("y", "20px")
    .style("font", "12px sans-serif")
    .style("text-decoration", "underline")
    .text("Legend");
    
  svg.append("line")
    .attr("x1", 0)
    .attr("x2", 40)
    .attr("y1", 50)
    .attr("y2", 50)
    .style("stroke", "#CD0A6C")
    .style("stroke-width", 3);
    
  svg.append("text")
    .attr("x", 60)
    .attr("y", 50)
    .attr("dy", "4px")
    .style("font", "12px sans-serif")
    .text("Interruption");
  
  var data = [
    {
      path: "kill.png",
      text: "Kill"
    },
    {
      path: "Tower.png",
      text: "Tower"
    },
    {
      path: "Inhibitor.png",
      text: "Inhibitor"
    },
    {
      path: "Baron.png",
      text: "Baron"
    },
    {
      path: "Dragon.png",
      text: "Dragon"
    }
  ];
  
  var g = svg.selectAll(".images")
    .data(data).enter()
    .append("g");
  
  g.append("image")
    .attr("xlink:href", function(d) { return "images/" + d.path; })
    .attr("x", 5)
    .attr("y", function(d, i) { return i*30 + 70; })
    .attr("width", "19px")
    .attr("height", "19px");
    
  g.append("text")
    .attr("x", 60)
    .attr("y", function(d, i) { return i*30 + 70; })
    .attr("dy", "12px")
    .style("font", "12px sans-serif")
    .text(function(d) { return d.text; });
}