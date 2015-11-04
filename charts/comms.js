
function comms() {
  var attributes = {};
  attributes.svg = {
      width: 830,
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
  attributes.axes = {
    width: 700
  };
  
  attributes.legends.top = {
    height: 50,
    translate: {x: 0, y: 0}
  };
  attributes.legends.players = {
    translate: { 
      x: 0, 
      y: function(i) {
        var offset = attributes.legends.top.height;
        var height = (attributes.players.height + attributes.players.margin.top + attributes.players.margin.bottom);
        return  offset + i*height;
      }
    }
  };
  attributes.legends.bottom = {
    height: 50,
    translate: {x: 0, y: 550}
  };
  
  attributes.players.translate = {
    x: attributes.legends.width,
    y: function(i) {
      var offset = attributes.legends.top.height;
      var height = (attributes.players.height + attributes.players.margin.top + attributes.players.margin.bottom);
      return  offset + i*height;
    }
  };
  
  attributes.axes.top = {
    translate: {
      x: attributes.legends.width,
      y: attributes.legends.top.height
    }
  };
  attributes.axes.bottom = {
    translate: {
      x: attributes.legends.width,
      y: 550
    }
  };
  
  var gameLength = 2225; // 37:05
  var previousSection = -1,
      currentSection = 0,
      activateFunctions = [];
  
  var svg = undefined,
      g = {
      };
  var x = d3.scale.linear()
          .domain([0, gameLength])
          .range([0, attributes.players.width]);
          
  var chart = function(selection) {
    selection.each(function (data) {
      data.forEach(function(d) {
        d.sum = d.seconds.reduce(function(a,b) { return a + b; });
      });
      
      svg = d3.select(this).append("svg")
        .attr("width", attributes.svg.width)
        .attr("height", attributes.svg.height);
      
      /* players */
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
      
      players.selectAll(".strip")
        .data(function(d) { return stack(reduce(d.seconds)); })
        .enter()
        .append("rect")
          .attr("x", function(d, i) { return x(d.start); })
          .attr("y", 0)
          .attr("width", function(d, i) { return x(d.end) - x(d.start); })
          .attr("height", attributes.players.height)
          .attr("class", "strip");
          
      players.append("g").attr("class", "time")
        .attr("opacity", 0)
        .append("text")
        .text(function(d) {
          var minutes = Math.floor(d.sum / 60);
          var seconds = d.sum % 60;
          var percentage = Math.round( (d.sum / gameLength) * 1000 )/10
          
          return minutes + ":" + seconds + " (" + percentage + "%)";
        })
        .attr("x", function(d) {
          return x(d.sum) + 20;
        })
        .attr("y", attributes.players.height / 2)
        .attr("dy", "15px")
        .attr("font-family", "BigNoodle")
        .attr("font-size", "60px");
        
      
      /* axes */
      var axis = d3.svg.axis()
                .scale(x)
                .tickValues(d3.range(0, gameLength + 1).filter(function(d, i) { return (d%120 === 0) || (i === gameLength); }))
                .tickFormat(function(d) { 
                  var minutes = Math.floor(d/60);
                  if (minutes < 10) minutes = "0" + minutes;
                  var seconds = d%60;
                  if (seconds < 10) seconds = "0" + seconds;
                  return minutes + ":" + seconds })
                .orient("top");
      
      var topAxis = svg.append("g")
        .attr("transform", "translate(" + attributes.axes.top.translate.x + ", " + attributes.axes.top.translate.y + ")" )
        .attr("class", "axis")
        .call(axis)
          .selectAll("text")
          .attr("dx", function(d) { return (d === gameLength) ? ".85em" : "0em"; })
          .attr("transform", "rotate(-10)");
      
      axis.orient("bottom");
      var botAxis = svg.append("g")
        .attr("transform", "translate(" + attributes.axes.bottom.translate.x + ", " + attributes.axes.bottom.translate.y + ")" )
        .attr("class", "axis")
        .call(axis)
          .selectAll("text")
          .attr("dx", function(d) { return (d === gameLength) ? ".85em" : "0em"; })
          .attr("transform", "rotate(10)");
      
      /* legends */
      var playerLegend = svg.selectAll(".player-legend")
        .data(data).enter()
        .append("g")
          .attr("transform", function(d, i) {
            var translate = attributes.legends.players.translate;
            var x = translate.x;
            var y = translate.y(i);
            return "translate(" + x + "," + y + ")";
          });
      
      playerLegend.append("text")
        .text(function(d) { return d.position; })
        .attr("x", 70)
        .attr("y", 70)
        .attr("text-anchor", "middle")
        .attr("dy", "-6px")
        .attr("font-family", "BigNoodle");
      
      playerLegend.append("image")
        .attr("xlink:href", function(d) { return "images/" + d.champion + ".png"; })
        .attr("x", 50)
        .attr("y", 70)
        .attr("height", "40px")
        .attr("width", "40px");
      
      g.players = players;
      g.axes = {
        top: topAxis,
        bottom: botAxis
      };
      g.legends = {
        players: playerLegend
      };
      
      setupSections();
    })
  }
  
  /* Activation Functions */
  
  chart.activate = function(index) {
    currentSection = index;
    var sign = (currentSection - previousSection) < 0 ? -1 : 1;
    var scrolledSections = d3.range(previousSection + sign, currentSection + sign, sign);
    scrolledSections.forEach(function(i) {
      activateFunctions[i]();
    });
    previousSection = currentSection;
  }
  
  var communication = function() {
    var players = g.players;
    players.selectAll(".time")
      .transition()
      .duration(0)
      .transition()
      .duration(200)
      .attr("opacity", 0)
      .each("end", function() {
        players.selectAll(".strip")
          .transition()
          .duration(0)
          .transition()
          .duration(600)
            .attr("x", function(d) { return x(d.start); });
      })
  }
  
  var distribution = function() {
    var players = g.players;
    players.selectAll(".strip")
      .transition()
      .duration(800)
        .attr("x", function(d) { return d.transition; })
      .each("end", function() {
        players.selectAll(".time")
          .transition()
          .duration(200)
          .attr("opacity", 1.0);
      })
  }
  
  function setupSections() {
    activateFunctions[0] = communication;
    activateFunctions[1] = distribution;
  }
   
   /* Data Manipulation */
   
   /**
    * Find all contiguous blocks of talking
    */
   function reduce(seconds) {
    var bars = [];
    var index = 0;
    while (index < seconds.length) {
      var speech = seconds[index] === 1 ? true : false;
      if (speech) {
        var window = index + 1;
        while (window < seconds.length) {
          var nextSpeech = seconds[window] === 1 ? true : false;
          if (!nextSpeech) {
            bars.push({
              "start": index,
              "end": window
            });
            break;
          }
          window += 1;
        }
        index = window;
      }
      else {
      index += 1;
      }
    }
    return bars;
   }
   
   function stack(bars) {
     var sum = 0;
     bars.forEach(function(bar, index) {
       bar.transition = sum;
       sum += (x(bar.end) - x(bar.start));
     });
     return bars;
   }
   
   return chart;
}