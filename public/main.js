
$(function () {

  var video = document.querySelector('video')

  var mediaRecorder = undefined

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia


  var socket = io()

  var socketInit = function (socket) {
    if (!socket) {
      return
    }

    socket.on('connecting', function () {
      console.log('connecting...')
    })

    socket.on('connect', function () {
      console.log('connected...')
    })

  }

  var pushStream = function (chunk) {
    socket.emit('stream.push', chunk)
  }

  var exArray = []; //存储设备源ID
  MediaStreamTrack.getSources(function (sourceInfos) {
    for (var i = 0; i != sourceInfos.length; ++i) {
      var sourceInfo = sourceInfos[i];
      //这里会遍历audio,video，所以要加以区分
      if (sourceInfo.kind === 'video') {
        exArray.push(sourceInfo.id);
      }
    }
  });

  var getMedia = function () {
    if (navigator.getUserMedia) {
      navigator.getUserMedia({
        'video': {
          'optional': [{
            'sourceId': exArray[1] //0为前置摄像头，1为后置
          }]
        }
      }, successFunc, errorFunc);    //success是获取成功的回调函数
    }
  }

  function successFunc(stream) {
    if (video.mozSrcObject !== undefined) {
      video.mozSrcObject = stream;
    }
    else {
      video.src = window.URL && window.URL.createObjectURL(stream) || stream;
    }

    mediaRecorder = new MediaStreamRecorder(stream, {
      initCallback: function () {
        console.log('initCallback')
      },
      mimeType: 'video/webm'
    })
    mediaRecorder.mimeType = 'video/webm'

    mediaRecorder.recordingCallback = function (blob) {
      console.log('recordingCallback')
      pushStream(blob)
    }

    mediaRecorder.record()
  }

  function errorFunc(e) {
    alert('Error！'+e);
  }

  socketInit(socket)

  getMedia()

})
