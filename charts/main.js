distribution();

var audioStart = {
  'top': 114,
  'jungle': 196,
  'mid': 119
};

var topAudio = new Audio("./data/audio/Top.mp3");
topAudio.currentTime += audioStart.top;
topAudio.volume = 0.50; 
var jungleAudio = new Audio("./data/audio/Jungle.mp3");
jungleAudio.currentTime += audioStart.jungle;
var midAudio = new Audio("./data/audio/Mid.mp3");
midAudio.currentTime += audioStart.mid;


function display(error, top, jungle, mid) {
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
  
  // audio button
  d3.select(".btn")
    .on("click", function() {
      var action = d3.select(this).attr("action");
      if (action === "play") {
        plot.play();
      } else {
        plot.stop();
      }
    });
}

queue()
  .defer(d3.json, "data/top.json")
  .defer(d3.json, "data/jungle.json")
  .defer(d3.json, "data/mid.json")
  .await(display);