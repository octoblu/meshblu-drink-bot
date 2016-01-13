var five = require("johnny-five");
var keypress = require("keypress");

keypress(process.stdin);

var board = new five.Board();

board.on("ready", function() {

  console.log("Use Up and Down arrows for CW and CCW respectively. Space to stop.");

  var servo = new five.Servo({
    id: "MyServo",     // User defined id
    pin: 3,           // Which pin is it attached to?
    type: "standard",  // Default: "standard". Use "continuous" for continuous rotation servos
    range: [0,180],    // Default: 0-180
    fps: 100,          // Used to calculate rate of movement between positions
    invert: false,     // Invert all specified positions
    startAt: 90,       // Immediately move to a degree
    center: true,      // overrides startAt if true and moves the servo to the center of the range
    specs: {           // Is it running at 5V or 3.3V?
      speed: five.Servo.Continuous.speeds["@5.0V"]
    }
  });

  var count = 90;

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
      count = count - 1;
      console.log(count);
      servo.to(count);
    } else if (key.name === "down") {
      count = count + 1;
      console.log(count);
      servo.to(count);
    } else if (key.name === "space") {
      console.log("Stopping");
      servo.stop();
    }
  });
});
