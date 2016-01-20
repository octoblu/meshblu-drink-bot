angular.module('webcamDemo', ['webcam', 'ngMaterial'] )
.controller('MainCtrl', function ($scope) {
  'use strict';

  var _video = null,
  patData = null;

  $scope.patOpts = {x: 0, y: 0, w: 25, h: 25};
  $scope.channel = {
    videoWidth: "100%",
    videoHeight: "100%",
    video: null
  };

  var heightV, widthV;


  var MESSAGE_SCHEMA = {
    "type": 'object',
    "properties": {
      "snapshot": {
        "type": "boolean",
        "title": "Take picture",
        "default": true
      },
      "send_as_raw": {
        "type": "boolean",
        "title": "Raw base64 (works with twitter)",
        "default": false
      }
    }
  };



  $scope.webcamError = false;
  $scope.onError = function (err) {
    $scope.$apply(
      function() {
        $scope.webcamError = err;
      }
    );
  };

  $scope.onSuccess = function () {
    _video = $scope.channel.video;
    $scope.$apply(function() {
      getSize();
    });

  };

  var getSize = function() {
    heightV = (document.getElementsByClassName('webcam-live')[0].offsetHeight);
    widthV =  (document.getElementsByClassName('webcam-live')[0].offsetWidth);
    $scope.patOpts.w = widthV;
    $scope.patOpts.h = heightV;
  };

  $scope.makeSnapshot = function makeSnapshot() {
    var dataURL = $scope.returnSnapshot();
    var message = {
      "devices": "*",
      "payload": {
        "pictures":  dataURL
      }
    };
    conn.message(message);
  };

  $scope.returnSnapshot = function returnSnapshot() {
    if (_video) {
      var patCanvas = document.querySelector('#snapshot');
      if (!patCanvas) return;
      getSize();

      patCanvas.width = widthV;
      patCanvas.height = heightV;

      var ctxPat = patCanvas.getContext('2d');

      var vData = getVideoData($scope.patOpts.x, $scope.patOpts.y, widthV, heightV);
      var idata = vData.ctx;
      var imageURL = vData.imageB64;
      //console.log(imageURL);
      ctxPat.putImageData(idata, 0, 0);

      patData = idata;

      return imageURL;

    }
  };


  var getVideoData = function getVideoData(x, y, w, h) {
    var hiddenCanvas = document.createElement('canvas');

    hiddenCanvas.width =  800;
    hiddenCanvas.height = 600;
    var ctx = hiddenCanvas.getContext('2d');
    ctx.drawImage(_video, 0, 0, 800, 600);
    var imageURL = hiddenCanvas.toDataURL("image/jpeg");
    ctx.drawImage(_video, 0, 0, widthV, heightV);

    return {"ctx": ctx.getImageData(x, y, widthV, heightV), "imageB64": imageURL};
  };

  var sendMessage = function sendMessage(data) {
    if(data.payload.snapshot == true){
      var dataURL = $scope.returnSnapshot();
      if(data.payload.send_as_raw == true){
        var message = {
          "devices": "*",
          "payload": {
            "pictures":  dataURL.split("data:image/jpeg;base64,").pop()
          }
        };
        conn.message(message);
      }else if (data.payload.send_as_raw == false){
        var message = {
          "devices": "*",
          "payload": {
            "pictures":  dataURL
          }
        };
        conn.message(message);
      }
    }
  };


  var uuid = "5174db30-7ce5-4d28-86bb-e7413f156730";
  var token = "899c117e8fe27be5f85837f192505ad7e815135a";

  var conn = meshblu.createConnection({
    "server": "edison.local",
    "port": 3040,
    "uuid": uuid,
    "token": token
  });

    conn.on('ready', function(data){
      console.log('UUID AUTHENTICATED!');
      console.log(data);
      conn.update({
        "uuid": GET.uuid,
        "messageSchema": MESSAGE_SCHEMA
      });

      conn.on('message', function(data){
        sendMessage(data);
      });
    });

    var webrtc = new SimpleWebRTC({
      localVideoEl: 'localVideo',
      autoRequestMedia: true
    });

    webrtc.on('readyToCall', function () {
      webrtc.joinRoom(GET.token);
    });

  }else{
    var conn = meshblu.createConnection({});
    $scope.showSnap = true;
    conn.on('ready', function(data){
      console.log('Ready', data);
      data.type = 'device:webcam';
      data.discoverWhitelist = [data.uuid];
      data.messageSchema = MESSAGE_SCHEMA;
      conn.update(data);
      $scope.useURL   = "http://camera.octoblu.com/?uuid=" + data.uuid + "&token=" + data.token;
      $scope.claimURL = "https://app.octoblu.com/node-wizard/claim/" + data.uuid + "/" + data.token;
      $scope.apply;
    });
  }


});
