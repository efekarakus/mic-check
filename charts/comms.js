
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
  
  var timeline = [
    {
      time: 1743,
      killer: "Ashe",
      victim: "Zilean",
      assists: []
    },
    {
      time: 1746,
      killer: "Hecarim",
      victim: "Baron",
      assists: []
    },
    {
      time: 1800,
      killer: "Fiora",
      victim: "Yasuo",
      assists: ["Sivir", "Hecarim", "Braum"]
    },
    {
      time: 1803,
      killer: "Hecarim",
      victim: "Nami",
      assists: ["Braum"]
    },
    {
      time: 1828,
      killer: "Zilean",
      victim: "Tower",
      assists: []
    },
    {
      time: 1843,
      killer: "Zilean",
      victim: "Tower",
      assits: []
    },
    {
      time: 1848,
      killer: "Zilean",
      victim: "Inhibitor",
      assists: []
    },
    {
      time: 1872,
      killer: "Hecarim",
      victim: "Dragon",
      assists: []
    }
  ];
  
  var gameLength = 2225;  // 37:05
  var zoomTimes = {
    start: 1740,          // 21:00
    end: 1920             // 24:00
  }
    
    
  var previousSection = -1,
      currentSection = 0,
      activateFunctions = [];
  
  var svg = undefined,
      g = {
      };
  var x = d3.scale.linear()
          .domain([0, gameLength])
          .range([0, attributes.players.width]);
          
  var zoomX = d3.scale.linear()
          .domain([zoomTimes.start, zoomTimes.end])
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
          .attr("class", "players")
          .attr("id", function(d) { return d.position; })
      
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
          .attr("x", function(d) { return x(d.start); })
          .attr("y", 0)
          .attr("width", function(d) { return x(d.end) - x(d.start); })
          .attr("height", attributes.players.height)
          .attr("class", "strip");
          
      players.append("g").attr("class", "time")
        .attr("opacity", 0)
        .append("text")
        .text(function(d) {
          var minutes = Math.floor(d.sum / 60);
          var seconds = d.sum % 60;
          var percentage = Math.round( (d.sum / gameLength) * 1000 )/10;
          
          return minutes + ":" + seconds + " (" + percentage + "%)";
        })
        .attr("x", function(d) {
          return x(d.sum) + 20;
        })
        .attr("y", attributes.players.height / 2)
        .attr("dy", "15px")
        .attr("font-family", "BigNoodle")
        .attr("font-size", "60px");
      
      /* Overlaps */
      var topAndJungle = overlap(data[0].seconds, data[1].seconds);
      var topAndMid = overlap(data[0].seconds, data[2].seconds);
      var jungleAndMid = overlap(data[1].seconds, data[2].seconds);
      
      [d3.select("#Top"), d3.select("#Jungle")].forEach(function(selection) {
        selection.selectAll(".top-jungle-overlap")
        .data(reduce(topAndJungle))
        .enter()
        .append("rect")
          .attr("x", function(d) { return x(d.start); })
          .attr("y", 2)
          .attr("width", function(d) { return x(d.end) - x(d.start); })
          .attr("height", attributes.players.height - 2)
          .attr("class", "overlap")
          .attr("fill", "#CD0A6C")
          .style("stroke", "1")
          .style("stroke", "#CD0A6C")
          .attr("opacity", 0);
      });
      
      [d3.select("#Top"), d3.select("#Mid")].forEach(function(selection) {
        selection.selectAll(".top-mid-overlap")
        .data(reduce(topAndMid))
        .enter()
        .append("rect")
          .attr("x", function(d) { return x(d.start); })
          .attr("y", 2)
          .attr("width", function(d) { return x(d.end) - x(d.start); })
          .attr("height", attributes.players.height - 2)
          .attr("class", "overlap")
          .attr("fill", "#CD0A6C")
          .style("stroke", "1")
          .style("stroke", "#CD0A6C")
          .attr("opacity", 0);
      });
      
      [d3.select("#Jungle"), d3.select("#Mid")].forEach(function(selection) {
        selection.selectAll(".jungle-mid-overlap")
        .data(reduce(jungleAndMid))
        .enter()
        .append("rect")
          .attr("x", function(d) { return x(d.start); })
          .attr("y", 2)
          .attr("width", function(d) { return x(d.end) - x(d.start); })
          .attr("height", attributes.players.height - 2)
          .attr("class", "overlap")
          .attr("fill", "#CD0A6C")
          .style("stroke", "1")
          .style("stroke", "#CD0A6C")
          .attr("opacity", 0);
      });
      
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
        .attr("class", "top axis")
        .call(axis)
          .selectAll("text")
          .attr("dx", function(d) { return (d === gameLength) ? ".85em" : "0em"; })
          .attr("transform", "rotate(-10)");
      
      axis.orient("bottom");
      var botAxis = svg.append("g")
        .attr("transform", "translate(" + attributes.axes.bottom.translate.x + ", " + attributes.axes.bottom.translate.y + ")" )
        .attr("class", "bot axis")
        .call(axis)
          .selectAll("text")
          .attr("dx", function(d) { return (d === gameLength) ? ".85em" : "0em"; })
          .attr("transform", "rotate(10)");
      
      var zoomAxis = d3.svg.axis()
      .scale(zoomX)
      .tickValues(d3.range(zoomTimes.start, zoomTimes.end + 1).filter(function(d, i) { return (d%10 === 0) || (i === gameLength); }))
      .tickFormat(function(d) { 
        var minutes = Math.floor(d/60);
        if (minutes < 10) minutes = "0" + minutes;
        var seconds = d%60;
        if (seconds < 10) seconds = "0" + seconds;
        return minutes + ":" + seconds })
      .orient("top");
    
    var topZoomAxis = svg.append("g")
        .attr("transform", "translate(" + attributes.axes.top.translate.x + ", " + attributes.axes.top.translate.y + ")" )
        .attr("class", "top zoom axis")
        .attr("opacity", 0)
        .call(zoomAxis)
          .selectAll("text")
          .attr("dx", function(d) { return (d === zoomTimes.end) ? ".85em" : "0em"; });
          
    zoomAxis.orient("bottom");
    var botZoomAxis = svg.append("g")
        .attr("transform", "translate(" + attributes.axes.bottom.translate.x + ", " + attributes.axes.bottom.translate.y + ")" )
        .attr("class", "bot zoom axis")
        .attr("opacity", 0)
        .call(zoomAxis)
          .selectAll("text")
          .attr("dx", function(d) { return (d === zoomTimes.end) ? ".85em" : "0em"; });
      
      /* Timeline */
      var timelineEvents = svg.selectAll(".timeline")
        .data(timeline).enter()
        .append("g")
          .attr("transform", function(d, i) {
            return (i % 2 === 0) ? 
            "translate(" + (attributes.axes.top.translate.x + zoomX(d.time) - 19) + ", " + 0 + ")" :
            "translate(" + (attributes.axes.top.translate.x + zoomX(d.time) - 19) + ", " + (attributes.svg.height - 20) + ")";
          })
          .attr("class", "timeline")
          .attr("opacity", 0);
          
      timelineEvents.append("image")
        .attr("xlink:href", function(d) { return "images/" + d.killer + ".png"; })
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", "19px")
        .attr("width", "19px");
        
      timelineEvents.append("image")
        .attr("xlink:href", function(d) { return "images/kill.png"; })
        .attr("x", 19)
        .attr("y", 0)
        .attr("height", "19px")
        .attr("width", "19px");
        
      timelineEvents.append("image")
        .attr("xlink:href", function(d) { return "images/" + d.victim + ".png"; })
        .attr("x", 38)
        .attr("y", 0)
        .attr("height", "19px")
        .attr("width", "19px");
      
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
        bot: botAxis,
        zoom: {
          top: topZoomAxis,
          bot: botZoomAxis
        }
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
  
  chart.play = function() {
    if (currentSection !== 0) {
      return;
    }
    
    var button = d3.select(".btn");
    button.select("span")
      .text("stop");
    button.attr("action", "pause");
    
    topAudio.play();
    jungleAudio.play();
    midAudio.play();
    
    var players = g.players;
    players.selectAll(".strip")
      .transition("audioplay")
      .delay(function(d) { return d.start*1000; })
      .attr("y", 2)
      .attr("height", attributes.players.height - 4)
      .style("fill", "#CD0A6C")
      .style("stroke", "#CD0A6C")
      .style("stroke-width", "4");
      
    players.selectAll(".strip")
      .transition("audiostop")
      .delay(function(d) { return d.end*1000; })
      .attr("y", 0)
      .attr("height", attributes.players.height)
      .style("fill", "#000")
      .style("stroke", "#000")
      .style("stroke-width", "0");
  }
  
  chart.stop = function() {
    var button = d3.select(".btn");
    button.select("span")
      .text("play");
      
    button.attr("action", "play");
    
    topAudio.pause();
    jungleAudio.pause();
    midAudio.pause();
    topAudio.currentTime = audioStart.top;
    jungleAudio.currentTime = audioStart.jungle;
    midAudio.currentTime = audioStart.mid;
    
    var players = g.players;
    
    players.selectAll(".strip")
      .transition("audioplay")
      .duration(0)
      .style("fill", "#000")
      .style("stroke", "#000")
      .style("stroke-width", "0");
      
    players.selectAll(".strip")
      .transition("audiostop")
      .duration(0);
  }
  
  
  var communication = function() {
    var players = g.players;
    
    // below section
    if (previousSection > 0) {
      players.selectAll(".time")
        .transition()
        .delay(0)
        .duration(0)
        .attr("opacity", 0);
        
      players.selectAll(".strip")
        .transition("distribution-placement")
        .duration(0)
        .attr("x", function(d) { return d.transition; })
        .attr("width", function(d) { return x(d.end) - x(d.start); })
        .attr("opacity", 1.0);
    }
    
    players.selectAll(".strip")
      .transition()
      .duration(600)
        .attr("x", function(d) { return x(d.start); });
  }
  
  var distribution = function() {
    var players = g.players;
    
    // above section
    chart.stop(); // FIXME
    
    players.selectAll(".strip")
      .transition()
      .duration(0)
      .attr("x", function(d) { return x(d.start); });
    
    // below section
    if (previousSection >= 2) {
      svg.select("g.top.zoom.axis").transition()
        .duration(0)
        .attr("opacity", 0);
        
      svg.select("g.bot.zoom.axis").transition()
          .duration(0)
          .attr("opacity", 0);
          
      svg.select("g.top.axis").transition()
        .duration(500)
        .attr("opacity", 1);
      
      svg.select("g.bot.axis").transition()
          .duration(500)
          .attr("opacity", 1);
          
      svg.selectAll(".timeline").transition()
        .duration(500)
        .attr("opacity", 0);
      
      players.selectAll(".strip")
        .transition("objective-control")
        .duration(0)
          .attr("x", function(d) { 
            if((d.start >= zoomTimes.start) && (d.end <= zoomTimes.end)) {
              return zoomX(d.start);
            } else {
              return d.transition;
            }
          })
          .attr("width", function(d) { 
            if((d.start >= zoomTimes.start) && (d.end <= zoomTimes.end)) {
              return zoomX(d.end) - zoomX(d.start); 
            } else {
              return x(d.end) - x(d.start);
            }
          });
          
      players.selectAll(".overlap").transition()
          .delay(0)
          .duration(0)
          .attr("width", function(d) { return x(d.end) - x(d.start); })
          .attr("x", function(d) { return x(d.start); })
          .attr("opacity", 0);
    }
    
    players.selectAll(".strip")
      .transition()
      .duration(800)
        .attr("x", function(d) { return d.transition; })
        .attr("width", function(d) { return x(d.end) - x(d.start); })
        .attr("opacity", 1.0);
    
    players.selectAll(".time")
      .transition()
      .delay(800)
      .duration(200)
      .attr("opacity", 1.0);
  }
  
  function objectiveControl() {
    var players = g.players;
    
    players.selectAll(".time")
        .transition()
        .delay(0)
        .duration(0)
        .attr("opacity", 0);
    
    svg.select("g.top.axis").transition()
      .duration(0)
      .attr("opacity", 0);
      
    svg.select("g.bot.axis").transition()
        .duration(0)
        .attr("opacity", 0);
        
    svg.select("g.top.zoom.axis").transition()
      .duration(500)
      .attr("opacity", 1);
      
   svg.select("g.bot.zoom.axis").transition()
      .duration(500)
      .attr("opacity", 1);
      
   svg.selectAll(".timeline").transition()
      .duration(500)
      .attr("opacity", 1);

    players.selectAll(".strip")
      .transition()
      .duration(0)
        .attr("opacity", function(d) {
          return ((d.start >= zoomTimes.start) && (d.end <= zoomTimes.end)) ? 1.0 : 0.0;
        });
    
    
    players.selectAll(".strip")
      .transition("objective-control")
      .duration(800)
        .attr("x", function(d) { 
          if((d.start >= zoomTimes.start) && (d.end <= zoomTimes.end)) {
            return zoomX(d.start);
          } else {
            return d.transition;
          }
        })
        .attr("width", function(d) { 
          if((d.start >= zoomTimes.start) && (d.end <= zoomTimes.end)) {
            return zoomX(d.end) - zoomX(d.start); 
          } else {
            return x(d.end) - x(d.start);
          }
        });
    
    players.selectAll(".overlap")
      .transition()
      .duration(0)
      .attr("opacity", 0);
    
    players.selectAll(".overlap")
      .transition()
      .delay(800)
      .duration(0)
        .attr("x", function(d) {
          if((d.start >= zoomTimes.start) && (d.end <= zoomTimes.end)) {
            return zoomX(d.start);
          } else {
            return x(d.start);
          }
        })
        .attr("width", function(d) {
          if((d.start >= zoomTimes.start) && (d.end <= zoomTimes.end)) {
            return zoomX(d.end) - zoomX(d.start); 
          } else {
            return x(d.end) - x(d.start);
          }
        })
        .attr("opacity", function(d) {
          if((d.start >= zoomTimes.start) && (d.end <= zoomTimes.end)) {
            return 1;
          } else {
            return 0;
          }
        });
  }
  
  function interruptions() {
    // reset axis
    svg.select("g.top.zoom.axis").transition()
        .duration(0)
        .attr("opacity", 0);
        
    svg.select("g.bot.zoom.axis").transition()
        .duration(0)
        .attr("opacity", 0);
        
    svg.selectAll(".timeline").transition()
      .duration(500)
      .attr("opacity", 0);
          
    svg.select("g.top.axis").transition()
      .duration(500)
      .attr("opacity", 1);
      
    svg.select("g.bot.axis").transition()
        .duration(500)
        .attr("opacity", 1);
  
    // strips
    var players = g.players;
    players.selectAll(".strip")
      .transition("objective-control")
      .duration(800)
        .attr("x", function(d) { 
          return x(d.start);
        })
        .attr("width", function(d) {
            return x(d.end) - x(d.start);
        })
        .attr("opacity", 1);
        
    // overlaps
    players.selectAll(".overlap")
      .transition()
      .delay(0)
      .duration(0)
      .attr("opacity", 0);
    
    players.selectAll(".overlap")
      .transition()
      .delay(800)
      .duration(0)
        .attr("x", function(d) {
            return x(d.start);
        })
        .attr("width", function(d) {
            return x(d.end) - x(d.start);
        })
        .attr("opacity", 1);
  }
  
  function conclusion() {
    
  }
  
  function setupSections() {
    activateFunctions[0] = communication;
    activateFunctions[1] = distribution;
    activateFunctions[2] = objectiveControl;
    activateFunctions[3] = interruptions;
    activateFunctions[4] = conclusion;
  }
   
   /* Data Manipulation */
   
   function overlap(a, b) {
     var duration = a.length;
     var overlap = [];
     
     for (var second = 0; second < duration; second += 1) {
       var ai = a[second];
       var bi = b[second];
       
       if ( (ai === 1) && (bi === 1)) {
         overlap.push(1);
       } else {
         overlap.push(0);
       }
     }
     
     return overlap;
   }
   
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
