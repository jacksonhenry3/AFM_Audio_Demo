// Get a canvas defined with ID "oscilloscope"
var canvas = document.getElementById("oscilloscope");
canvas.width = 1315;
canvas.height = 400;
var canvasCtx = canvas.getContext("2d");

$("#offset").bind('input', updateOffsetVelocity);


var  offsetVelocity = 0;
function updateOffsetVelocity()
{
  offsetVelocity = this.value
}

function draw() {

  requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.fillStyle = "rgb(0, 156, 222)";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  canvasCtx.lineWidth = 1;
  canvasCtx.strokeStyle = "rgba(255, 255, 255, 1)";





  var sliceWidth = canvas.width * 1.0 / bufferLength;
  var x = 0;


  // get trigger?
  trigger = 0


  for (var i = 0; i < bufferLength; i++) {

    var v = dataArray[i] / 128.0;
    var y = canvas.height / 2+(v-1)*canvas.height;

    if (y>trigger) {
      triggerpointx = x
      trigger = y
    }


    x += sliceWidth;
  }

  canvasCtx.beginPath();
  x = 0
  for (var i = 0; i < bufferLength; i++) {

    var v = dataArray[i] / 128.0;
    var y = canvas.height*(v-1)*.5+.5*canvas.height;
    if (i === 0 || i === bufferLength) {

      // canvasCtx.moveTo(
      //   (
      //     (x-offsetVelocity*audioCtx.currentTime) % canvas.width + canvas.width
      //   ) % canvas.width, y
      // );
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}

draw();
