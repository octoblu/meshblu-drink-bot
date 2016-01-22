var app = angular.module('MyApp', ['ngMaterial']);

app.controller('AppCtrl', function($scope) {

  var GET = {};
  var query = window.location.search.substring(1).split("&");
  for (var i = 0, max = query.length; i < max; i++)
  {
    if (query[i] === "") // check for trailing & with no param
    continue;

    var param = query[i].split("=");
    GET[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
  }

  var webrtc = new SimpleWebRTC({
    remoteVideosEl: 'remoteVideos',
    autoRequestMedia: true
  });

  webrtc.on('readyToCall', function () {
    webrtc.joinRoom(GET.token);
  });


});
