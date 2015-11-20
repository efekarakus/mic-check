function distribution() {
  var margin = {top: 20, right: 5, bottom: 50, left: 20},
      width = 220 - margin.left - margin.right,
      height = 220 - margin.top - margin.bottom;
      
  var data = [
    {
      bucket: "[0 - 10)",
      duration: 62
    },
    {
      bucket: "[10 - 20)",
      duration: 81
    },
    {
      bucket: "[20 - 30)",
      duration: 87
    },
    {
      bucket: "[30 - end]",
      duration: 115
    }
  ];
  
  var x = d3.scale.ordinal()
    .domain(data.map(function(d) { return d.bucket; }))
    .rangeRoundBands([0, width]);
  
  var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.duration; })])
    .range([height, 0]);
  
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
  
  var yAxis = d3.svg.axis()
    .scale(y)
    .tickValues([])
    .orient("left");
  
  var svg = d3.select(".fiora-distribution")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
  
  svg.append("g")
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 9)
      .attr("dy", "-20px")
      .style("text-anchor", "end")
      .style("font", "12px sans-serif")
      .text("duration (s)");
  
  svg.append("g")
    .append("text")
      .attr("x", width/2)
      .attr("y", height)
      .attr("dy", "45px")
      .style("text-anchor", "middle")
      .style("font", "12px sans-serif")
      .style("text-decoration", "underline")
      .text("Fiora's Speech Distribution")
      
  
  svg.selectAll(".bar")
    .data(data).enter()
    .append("rect")
      .attr("x", function(d) { return x(d.bucket); })
      .attr("width", (x.rangeBand() - 5) )
      .attr("y", function(d) { return y(d.duration); })
      .attr("height", function(d) { return height - y(d.duration); })
      .style("stroke", "black")
      .style("stroke-width", 1)
      .style("fill", "#CD0A6C");
      
  svg.selectAll(".duration")
    .data(data).enter()
    .append("text")
      .attr("x", function(d) { return x(d.bucket); })
      .attr("y", function(d) { return y(d.duration); })
      .attr("dx", "13px")
      .attr("dy", "-10px")
      .style("font", "12px sans-serif")
      .text(function(d) { return d.duration; })
}