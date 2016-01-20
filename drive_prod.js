var five = require("johnny-five");
var keypress = require("keypress");
var board = new five.Board({
  port: "/dev/ttyACM0"
});

var meshblu = require('meshblu');
var meshbluJSON = require('./meshblu.json');

var uuid    = meshbluJSON.uuid;
var token   = meshbluJSON.token;

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
    "messageSchema": MESSAGE_SCHEMA
  });

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

    conn.on('message', function(data){

      payload = data.payload;
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

      }

    });

  });
});
