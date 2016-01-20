var five = require("johnny-five");
var keypress = require("keypress");
var board = new five.Board({
  port: "/dev/ttyACM0"
});

var meshblu = require('meshblu');
var meshbluJSON = require('./meshblu.json');

var uuid    = meshbluJSON.uuid;
var token   = meshbluJSON.token;

var CW = 60;
var CCW = 40;
var STOP = 51;
var state = false;

var conn = meshblu.createConnection({
  "uuid": uuid,
  "token": token,
  "server": meshbluJSON.server,
  "port": meshbluJSON.port
});

conn.on('notReady', function(data){
  console.log('UUID FAILED AUTHENTICATION!');
  console.log(data);
});

conn.on('ready', function(data){
  console.log('UUID AUTHENTICATED!');

  var MESSAGE_SCHEMA = {
    "type": 'object',
    "properties": {
      "command": {
        "type": "string",
        "enum": ['up', 'down', 'left', 'right', 'stop', 'cw', 'ccw']
      }
    }
  };

  conn.update({
    "uuid": uuid,
    "messageSchema": MESSAGE_SCHEMA,
    "receiveWhitelist": ["*"],
    "discoverWhitelist": ["*"],
    "configureWhitelist": ["*"],
    "sendWhitelist": ["*"]
  });

  board.on("ready", function() {

    var relay = new five.Relay({
                    pin: 13,
                    type: "NC"
                  });

    var servo = new five.Servo({
      id: "MyServo",     // User defined id
      pin: 10,           // Which pin is it attached to?
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

    conn.on('message', function(data){

      var payload = {"command": data.payload};
      //console.log(payload);

      if (payload.command === "up") {
        leftf.speed(CCW);
        leftb.speed(CW);
        rightf.speed(CW);
        rightb.speed(CW);
      } else if (payload.command === "down") {
        leftf.speed(CW);
        leftb.speed(CCW);
        rightf.speed(CCW);
        rightb.speed(CCW);
      } else if (payload.command === "left") {
        leftf.speed(CCW);
        leftb.speed(CCW);
        rightf.speed(CW);
        rightb.speed(CCW);
      }else if (payload.command === "right") {
        leftf.speed(CW);
        leftb.speed(CW);
        rightf.speed(CCW);
        rightb.speed(CW);
      }else if (payload.command === "stop") {
        leftf.speed(STOP);
        leftb.speed(STOP);
        rightf.speed(STOP);
        rightb.speed(STOP);
      }
      else if (payload.command === "ccw") {
        leftf.speed(CW);
        leftb.speed(CCW);
        rightf.speed(CW);
        rightb.speed(CW);
      }else if (payload.command === "cw") {
        leftf.speed(CCW);
        leftb.speed(CW);
        rightf.speed(CCW);
        rightb.speed(CCW);
      }else if (payload.command === "dispense") {
        if(state == false){
          relay.open();
        }
      }else if (payload.command == "testTurret"){
        relay.open();
      }else if (payload.command == "stopTurrent"){
        relay.close();
      }

    });

    var dispense = function(){
      state = true;
      servo.to(10);
      setTimeout(function(){ servo.to(80); state = false;}, 3000);
    };

    var sensor = new five.Sensor.Digital(2);

    sensor.on("change", function() {
      console.log(this.value);
      if(this.value == 1 && state == false){
        relay.close();
        dispense();
      }
    });

  });
});
