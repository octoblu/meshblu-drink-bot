var five = require("johnny-five"),
  board, button;

board = new five.Board();

board.on("ready", function() {

  button = new five.Button(12);
  var servo = new five.Servo({
    pin: 3,           // Which pin is it attached to?
    type: "standard",  // Default: "standard". Use "continuous" for continuous rotation servos
    range: [0,180],    // Default: 0-180
    fps: 100,
    startAt: 90,       // Immediately move to a degree
    center: true,        // Used to calculate rate of movement between positions
    invert: false,     // Invert all specified positions
    specs: {           // Is it running at 5V or 3.3V?
      speed: five.Servo.Continuous.speeds["@5.0V"]
    }
  });

  servo.to(10);

  button.on("up", function() {
    servo.to(80);
    console.log('yo');
  });
});
