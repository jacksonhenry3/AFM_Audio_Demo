// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyserNode = audioCtx.createAnalyser();
analyserNode.smoothingTimeConstant =  01;
analyserNode.connect(audioCtx.destination)
//this gets the audio context. This is effectivly the interface in to the audio api.
  // const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

var sliderOscilator = audioCtx.createOscillator();
var sliderGainNode = audioCtx.createGain();
sliderOscilator.connect(sliderGainNode)
sliderGainNode.connect(audioCtx.destination)
sliderGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
sliderGainNode.connect(analyserNode)
sliderOscilator.start()


function playNote(freq, type){
  var oscillator = audioCtx.createOscillator();
  var gainNode = audioCtx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime); // value in hertz
  oscillator.connect(gainNode)
  gainNode.connect(analyserNode)
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

  oscillator.start();
  gainNode.gain.linearRampToValueAtTime(.2, audioCtx.currentTime + .1);
  return [oscillator,gainNode]
}


oscilatorObj = {}
freqObj = {
  "c":261.63,
  "d":293.66,
  "e":329.63,
  "f":349.23,
  "g":392.00,
  "a":440.00,
  "b":493.88
}

freqObj = {
  "1":261.63,
  "2":293.66,
  "3":329.63,
  "4":349.23,
  "5":392.00,
  "6":440.00,
  "7":493.88,
  "8":523.25,
  "9":587.33,
  "0":659.25,
  "½":783.99
}


$("#myRange").on('input', function(){console.log("A")});

var slider = document.getElementById("myRange");
// var output = document.getElementById("demo");
// output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.onmouseout = function(){ if (micQQ) {source.connect(analyserNode);
source.connect(audioCtx.destination);

}micQ = false;sliderGainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + .1);};
slider.oninput = function() {
  micQ = true
  source.disconnect()
  sliderOscilator.frequency.setValueAtTime(this.value*15+100, audioCtx.currentTime);
  sliderGainNode.gain.linearRampToValueAtTime(.2, audioCtx.currentTime + .1);
}




$(document).keydown(function(event){
  if (oscilatorObj[event.keyCode] == null && ! micQ ) {
      note = String.fromCharCode(event.keyCode).toLowerCase()
      console.log(note)
      oscilatorObj[event.keyCode] = playNote(freqObj[note],oscType)
  }




});
$(document).keyup(function(event){
    if (! micQ) {

    oscilatorObj[event.keyCode][1].gain.linearRampToValueAtTime(0, audioCtx.currentTime + .1);
    oscilatorObj[event.keyCode][0].stop(audioCtx.currentTime + .15);
    oscilatorObj[event.keyCode] = null
  }


var micQQ = false;

});

var oscType = "sine"
var lastClickedID = "sine"
var micQ = false
$("#"+lastClickedID).css("box-shadow", "0px 0px 0px #444");
$("#"+lastClickedID).css("opacity", "1");


$(".button").click(function(){
  if (lastClickedID == "mic") {
    source.disconnect()
  }
  $("#"+lastClickedID).css("box-shadow", "1px 1px 5px #444");
  $("#"+lastClickedID).css("opacity", ".5");

  lastClickedID = this.id
  $("#"+this.id).css("opacity", "1");
  $("#"+this.id).css("box-shadow", "0px 0px 0px #444");

  if (this.id != "mic") {
    sliderOscilator.type = this.id
      oscType = this.id
      micQ = false
      micQQ = false
  }


  if (this.id == "mic") {
    micQ = true
    micQQ = true
    sliderGainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + .1);
    //this is to make sure the useres browser supports the reuired standards.
    if (navigator.mediaDevices.getUserMedia)
    {
       console.log('getUserMedia supported.');
       var constraints = {audio: true}
       navigator.mediaDevices.getUserMedia (constraints)
          .then(
            function(stream) {

              //this is the audio stream from the mic
              source = audioCtx.createMediaStreamSource(stream);

              // we then connect the source to the analyser node that we will use to create the visual
              source.connect(analyserNode);
              source.connect(audioCtx.destination)

          })
          .catch( function(err) { console.log('The following gUM error occured: ' + err);})
    }

    // if the users browser doesnt suopport web audio
    else
    {
       console.log('getUserMedia not supported on your browser!');
    }

  }
});






var stream;






analyserNode.fftSize = 2048;
analyserNode.fftSize = 4096;
var bufferLength = analyserNode.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
analyserNode.getByteTimeDomainData(dataArray);

// Get a canvas defined with ID "oscilloscope"
var canvas = document.getElementById("oscilloscope");
var canvasCtx = canvas.getContext("2d");

// draw an oscilloscope of the current audio source
canvas.width = window.innerWidth;
canvas.height = 200;
function draw() {

  requestAnimationFrame(draw);

  analyserNode.getByteTimeDomainData(dataArray);

  canvasCtx.fillStyle = "rgb(200, 200, 200)";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  canvasCtx.lineWidth = 1;
  canvasCtx.strokeStyle = "rgb(0, 0, 0)";

  canvasCtx.beginPath();

  var sliceWidth = canvas.width * 1.0 / bufferLength;
  var x = 0;

  for (var i = 0; i < bufferLength; i++) {

    var v = dataArray[i] / 128.0;
    var y = canvas.height / 2+(v-1)*canvas.height;

    if (i === 0) {
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
