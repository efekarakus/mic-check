
function comms() {
  var attributes = {};
  attributes.svg = {
      width: 810,
      height: 600,
      translate: {x: 0, y: 0}
  };
  attributes.legends = {
    width: 100
  };
  attributes.players = {
      width: 700,
      height: 107,
      margin: {top: 30, left: 0, bottom: 30, right: 0}
  };
  
  attributes.legends.top = {
    height: 50,
    translate: {x: 0, y: 0}
  }
  attributes.legends.players = {
    translate: { 
      x: 0, 
      y: function (i) { 
        var offset = attributes.legends.top.height;
        var height = (attributes.players.height + attributes.players.margin.top + attributes.players.margin.bottom);
        return  offset + i*height;
      } 
    }
  }
  attributes.legends.bottom = {
    height: 50,
    translate: {x: 0, y: 550}
  }
  
  attributes.players.translate = {
    x: attributes.legends.width,
    y: function(i) {
      var offset = attributes.legends.top.height;
      var height = (attributes.players.height + attributes.players.margin.top + attributes.players.margin.bottom);
      return  offset + i*height;
    }
  } 
  
      
  var previousSection = -1,
      currentSection = 0,
      visualize = [];
  
  var svg = undefined,
      g = {
        legend: {}
      };
      
   var chart = function(selection) {
    // svg
    selection.each(function (data) {
      svg = d3.select(this).append("svg")
        .attr("width", attributes.svg.width)
        .attr("height", attributes.svg.height);
      
      var players = svg.selectAll(".players")
        .data(data).enter()
        .append("g")
          .attr("transform", function(d, i) {
            var translate = attributes.players.translate;
            var margin = attributes.players.margin;
            return "translate(" + (translate.x + margin.left) + "," + (translate.y(i) + margin.top) + ")";
          })
          .attr("class", "players");
      
      players.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", attributes.players.width)
        .attr("height", attributes.players.height)
        .attr("class", "bounding-box");
      
      // TODO skip 0 rectangles, and merge 1 rectangles
      var barWidth = null;
      players.selectAll(".strips")
        .data(function(d) { barWidth = attributes.players.width/d.seconds.length; return d.seconds; })
        .enter()
        .append("rect")
          .attr("x", function(d, i) { return i*barWidth })
          .attr("y", function(d) { return d === 0 ?  attributes.players.height : 0; })
          .attr("width", barWidth)
          .attr("height", function(d) { return d === 0 ? 0 : attributes.players.height; })
          .attr("class", "strip");
          
      g.players = players;
     })
   }
   
   return chart;
}