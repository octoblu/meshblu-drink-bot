window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame   ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

var prev;


var uuid = "2163503e-91ac-48bc-b57f-0b2e8be6b7ce";
var token = "85e2b4f4a37aa1b6f5f6af01c1d804c2ea4a41e7";

var conn = meshblu.createConnection({
  "server": "edison.local",
  "port": 3040,
  "uuid": uuid,
  "token": token
});

var app = angular.module('MyApp', ['ngMaterial']);

app.controller('AppCtrl', function($scope) {


  $scope.webRTC  = "http://camera.octoblu.com/webrtc.html?uuid=" + uuid + "&token=" + token;
  $scope.apply;

  conn.on('ready', function(data){
    console.log('UUID AUTHENTICATED!');
    conn.subscribe({uuid: uuid, types: ["sent"]});

    conn.on('message', function(data){

      var canvas = document.getElementById('canvas');
      var context = canvas.getContext('2d');

      var img = new Image();

      img.onload = function() {
        context.drawImage(this, 0, 0, canvas.width, canvas.height);
      }
      if(data.payload.pictures){
        img.src = data.payload.pictures;
      }


    });

    $scope.testOn = function(){
      var message = {
        "devices": "69e93636-9bcd-43a1-a919-2fc41ecdc5a4",
        "payload": "testTurret"
      };
      conn.message(message);
    };

    $scope.testOff = function(){
      var message = {
        "devices": "69e93636-9bcd-43a1-a919-2fc41ecdc5a4",
        "payload": "stopTurrent"
      };
      conn.message(message);
    };

  });

  $scope.pos = {
    x : 0,
    y : 0
  };

  $scope.counter = 0;

  $scope.count = function() {
    $scope.counter += 1;
  };

});

// https://github.com/sebleedelisle/JSTouchController/blob/master/TouchControl.html
'use strict';
angular.module('MyApp').directive('joystick', function() {

  function joystickController ($scope) {
  }

  return {
    restrict : 'E',
    controller : ['$scope', function ($scope) {
      return joystickController($scope);
    }],
    scope : {
      // Using primitives here did not work, so we use an Object, see: http://stackoverflow.com/questions/14049480/what-are-the-nuances-of-scope-prototypal-prototypical-inheritance-in-angularjs
      position : '='
    },
    template : '<canvas class="joystickCanvas"></canvas>',
    link : function(scope, element) {

      var joystickHeight = 200;
      var joystickWidth  = 200;

      var center = {
        x : joystickHeight / 2,
        y : joystickWidth / 2
      };

      var radiusCircle = 35;
      var radiusBound = 50;

      // Canvas and context element
      var container = element[0];
      var canvas = container.children[0];
      var ctx = canvas.getContext('2d');

      // Id of the touch on the cursor
      var cursorTouchId = -1;
      var cursorTouch = {
        x : center.x,
        y : center.y
      };

      function resetCanvas() {
        canvas.height = joystickHeight;
        canvas.width = joystickWidth;
      }

      function onTouchStart(event) {
        var touch = event.targetTouches[0];
        cursorTouchId = touch.identifier;
        cursorTouch = {
          x : touch.pageX - touch.target.offsetLeft,
          y : touch.pageY - touch.target.offsetTop
        };
      }

      function onTouchMove(event) {
        // Prevent the browser from doing its default thing (scroll, zoom)
        event.preventDefault();
        for(var i = 0; i < event.changedTouches.length; i++){
          var touch = event.changedTouches[i];

          if(cursorTouchId === touch.identifier)
          {
            cursorTouch = {
              x : touch.pageX - touch.target.offsetLeft,
              y : touch.pageY - touch.target.offsetTop
            };

            var scaleX = radiusBound / (cursorTouch.x - center.x);
            var scaleY = radiusBound / (cursorTouch.y - center.y);

            if(Math.abs(scaleX) < 1) {
              cursorTouch.x = Math.abs(cursorTouch.x - center.x) * scaleX + center.x;
            }

            if (Math.abs(scaleY) < 1) {
              cursorTouch.y = Math.abs(cursorTouch.y - center.y) * scaleY + center.y;
            }

            scope.$apply(
              scope.position = {
                x : Math.round(((cursorTouch.x - center.x)/radiusBound) * 100),
                y : Math.round(((cursorTouch.y - center.y)/radiusBound) * -100)
              }
            );

            var payload;


            if(scope.position.x > -100 && scope.position.y > 0){
              payload = "up";
            }else if(scope.position.x == 100 && scope.position.y == 100){
              payload = "cw";
            }else if(scope.position.x == -100 && scope.position.y == 100){
              payload = "ccw";
            }else if(scope.position.x == -100 && scope.position.y == -100){
              payload = "";
            }else if(scope.position.x == 100 && scope.position.y == -100){
              payload = "";
            }else if(scope.position.x > -100 && scope.position.y <= -100){
              payload = "down";
            }else if(scope.position.x >= -100 && scope.position.y > -100){
              payload = "left";
            }else if(scope.position.x < 100 && scope.position.y > -100){
              payload = "right";
            }

            prev = payload;

            var message = {
              "devices": "69e93636-9bcd-43a1-a919-2fc41ecdc5a4",
              "payload": payload
            };

            console.log(message);
            if(prev != payload){
              conn.message(message);
            }

            break;
          }
        }

      }

      function onTouchEnd() {
        var message = {
          "devices": "69e93636-9bcd-43a1-a919-2fc41ecdc5a4",
          "payload": "stop"
        };
        conn.message(message);
        cursorTouchId = -1;

        scope.$apply(
          scope.position = {
            x : 0,
            y : 0
          }
        );

        cursorTouch.x = center.x;
        cursorTouch.y = center.y;
      }

      function draw() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.strokeStyle = 'cyan';
        ctx.lineWidth = 5;
        ctx.arc(center.x, center.y, radiusCircle, 0, Math.PI*2, true);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = 'cyan';
        ctx.lineWidth = 2;
        ctx.arc(center.x, center.y, radiusBound, 0, Math.PI*2, true);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = 'cyan';
        ctx.lineWidth = 2;
        ctx.arc(cursorTouch.x, cursorTouch.y, radiusCircle, 0, Math.PI*2, true);
        ctx.stroke();

        requestAnimFrame(draw);
      }

      // Check if touch is enabled
      var touchable = true;

      if(touchable) {
        canvas.addEventListener( 'touchstart', onTouchStart, false );
        canvas.addEventListener( 'touchmove', onTouchMove, false );
        canvas.addEventListener( 'touchend', onTouchEnd, false );

        window.onorientationchange = resetCanvas;
        window.onresize = resetCanvas;
      }

      // Bind to the values from outside as well
      scope.$watch('position', function(newval) {
        cursorTouch = {
          x : ((newval.x * radiusBound) / 100) + center.x,
          y : ((newval.y * radiusBound) / -100) + center.y
        };
      });

      resetCanvas();
      draw();

    }

  };

});
