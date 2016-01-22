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

  var uuid = "2163503e-91ac-48bc-b57f-0b2e8be6b7ce";
  var token = "85e2b4f4a37aa1b6f5f6af01c1d804c2ea4a41e7";

  var conn = meshblu.createConnection({
    "server": "edison.local",
    "port": 3040,
    "uuid": uuid,
    "token": token
  });

  conn.on('ready', function(data){
    console.log('UUID AUTHENTICATED!');
    console.log(data);

    setInterval(function(){
      $scope.makeSnapshot();
    }, 1000);

  });




});
