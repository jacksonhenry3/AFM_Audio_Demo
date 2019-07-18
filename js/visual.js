// Get a canvas defined with ID "oscilloscope"
var canvas = document.getElementById("oscilloscope");
canvas.width = 1315;
canvas.height = 300;
var canvasCtx = canvas.getContext("2d");

$("#offset").bind('input', updateOffsetVelocity);

var MAXDEBUG = 0
var  offsetVelocity = 0;
function updateOffsetVelocity()
{
  offsetVelocity = this.value
}

  canvasCtx.fillStyle = "rgb(0, 156, 222)";
  canvasCtx.fillRect(0, 0,  canvas.width, canvas.height);
function draw() {

  requestAnimationFrame(draw);
  // console.log(dataArray)

  analyser.getByteFrequencyData(dataArray);
  analyser.getByteTimeDomainData(dataArray2);

  canvasCtx.fillStyle = "rgb(0, 156, 222)";
  canvasCtx.fillRect(0, 0,  canvas.width, canvas.height);

  // canvasCtx.putImageData(canvasCtx.getImageData(0,0,canvas.width,canvas.height),10,0)
  

  canvasCtx.fillStyle = "rgb(0, 156, 222)";
  canvasCtx.fillRect(0, 0, 10, canvas.height);

  // canvasCtx.lineWidth = 1;
  // canvasCtx.strokeStyle = "rgba(255, 255, 255, 1)";





  var sliceWidth = canvas.width * 1.0 / bufferLength;
  var x = 0;


  // get trigger?
  trigger = 0


  // for (var i = 0; i < bufferLength; i++) {

  //   // if (y>MAXDEBUG) {MAXDEBUG = y;console.log(y)}
  //   var v = dataArray[i] / 128.0;
  //   var y = canvas.height / 2+v

  //   if (y>trigger) {
  //     triggerpointx = x
  //     trigger = y
  //   }


  //   x += sliceWidth;
  // }

  canvasCtx.beginPath();
  x = 0

  for (var i = 0; i < bufferLength; i++) {

    var y = dataArray[i] / 255.;
    var y2 = dataArray2[i] / 255.;
    // if (y>MAXDEBUG) {MAXDEBUG = y;console.log( y*canvas.height)}

    if (i === 0 || i === bufferLength) {

      // canvasCtx.moveTo(
      //   (
      //     (x-offsetVelocity*audioCtx.currentTime) % canvas.width + canvas.width
      //   ) % canvas.width, y
      // );
      // canvasCtx.moveTo(x, y);
    } else {

      if (y>.5) {magnitude = y-.4}
        else{ magnitude = 0}
      canvasCtx.fillStyle = "rgba(0,0,0,"+magnitude+")";
      canvasCtx.fillRect(x*10, (1-y)*canvas.height,4,4);
      // canvasCtx.getImageData(0,0,canvas.width,canvas.height)
      // canvasCtx.
      canvasCtx.fillStyle = "rgba(255,255,255,1)";
      canvasCtx.fillRect(x,y2*canvas.height,1,1)
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  // canvasCtx.stroke();
}

draw();
