var five = require("johnny-five");
var keypress = require("keypress");
var board = new five.Board();

keypress(process.stdin);


var CW = 60;
var CCW = 40;
var STOP = 51;

board.on("ready", function() {

  var leftf = new five.ESC({
    device: "FORWARD_REVERSE",
    neutral: 50,
    pin: 3
  });

  var leftb = new five.ESC({
    device: "FORWARD_REVERSE",
    neutral: 50,
    pin: 5
  });

  var rightb = new five.ESC({
    device: "FORWARD_REVERSE",
    neutral: 50,
    pin: 6
  });

  var rightf = new five.ESC({
    device: "FORWARD_REVERSE",
    neutral: 50,
    pin: 9
  });



  console.log("Use Up and Down arrows for CW and CCW respectively. Space to stop.");

  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", function(ch, key) {

    if (!key) {
      return;
    }

    if (key.name === "q") {
      console.log("Quitting");
      process.exit();
    } else if (key.name === "up") {
      console.log("CW");
      leftf.speed(CCW);
      leftb.speed(CW);
      rightf.speed(CW);
      rightb.speed(CW);
    } else if (key.name === "down") {
      console.log("CCW");
      leftf.speed(CW);
      leftb.speed(CCW);
      rightf.speed(CCW);
      rightb.speed(CCW);
    } else if (key.name === "space") {
      console.log("Stopping");
         leftf.speed(STOP);
         leftb.speed(STOP);
         rightf.speed(STOP);
         rightb.speed(STOP);
    }else if (key.name === "right") {
      leftf.speed(CW);
      leftb.speed(CW);
      rightf.speed(CCW);
      rightb.speed(CW);
    }else if (key.name === "left") {
      leftf.speed(CCW);
      leftb.speed(CCW);
      rightf.speed(CW);
      rightb.speed(CCW);
    }else if (key.name === "z") {
      leftf.speed(CW);
      leftb.speed(CCW);
      rightf.speed(CW);
      rightb.speed(CW);
    }else if (key.name === "x") {
      leftf.speed(CCW);
      leftb.speed(CW);
      rightf.speed(CCW);
      rightb.speed(CCW);
    }
  });



});
