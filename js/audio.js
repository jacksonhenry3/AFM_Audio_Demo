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
  gainNode.gain.linearRampToValueAtTime(.1, audioCtx.currentTime + .1);
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
  "1":261.63/2,
  "2":293.66/2,
  "3":329.63/2,
  "4":349.23/2,
  "5":392.00/2,
  "6":440.00/2,
  "7":493.88/2,
  "8":523.25/2
  // "9":587.33/4,
  // "0":659.25/4,
  // "½":783.99/4
}

var n =1
$("#myRange").on('input', function(){console.log("A")});

var slider = document.getElementById("myRange");
// var output = document.getElementById("demo");
// output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.onmouseout = function(){ micQ = false;sliderGainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + .1);console.log(  sliderOscilator.frequency.value);

  if (typeof micQQ !== 'undefined') {
    if (micQQ) {source.connect(analyserNode);
      source.connect(audioCtx.destination);
  }

}};

$("#myRange").bind("touchend", function(){ micQ = false;sliderGainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + .1);console.log(  sliderOscilator.frequency.value);

  if (typeof micQQ !== 'undefined') {
    if (micQQ) {source.connect(analyserNode);
      source.connect(audioCtx.destination);
  }
}});



slider.oninput = function() {
  // micQ = true

  sliderOscilator.frequency.setValueAtTime(Math.exp(this.value), audioCtx.currentTime);
  sliderGainNode.gain.linearRampToValueAtTime(.1, audioCtx.currentTime + .1);

  if (typeof source !== 'undefined') {
    source.disconnect()
}

}




$(document).keydown(function(event){
  note = String.fromCharCode(event.keyCode).toLowerCase()
  if (oscilatorObj[note] == null && ! micQ ) {

      console.log(note)
      oscilatorObj[note] = playNote(freqObj[note],oscType)
  }




});
$(document).keyup(function(event){
    if (! micQ) {
      note = String.fromCharCode(event.keyCode).toLowerCase()

    oscilatorObj[note][1].gain.linearRampToValueAtTime(0, audioCtx.currentTime + .1);
    oscilatorObj[note][0].stop(audioCtx.currentTime + .15);
    oscilatorObj[note] = null
  }


var micQQ = false;

});

var oscType = "sine"
var lastClickedID = "sine"
var micQ = false
$("#"+lastClickedID).css("box-shadow", "0px 0px 0px #444");
$("#"+lastClickedID).css("opacity", "1");





$(".key").bind("touchstart mousedown",function(){
  console.log(this.innerHTML)
  if (oscilatorObj[this.innerHTML] == null && ! micQ ) {
      note = parseFloat(this.innerHTML)
      console.log(typeof note)
      oscilatorObj[this.innerHTML] = playNote(freqObj[note],oscType)
  }

});


$(".key").bind("touchend mouseup",function(){
    if (! micQ) {
      note = parseFloat(this.innerHTML)

    oscilatorObj[this.innerHTML][1].gain.linearRampToValueAtTime(0, audioCtx.currentTime + .1);
    oscilatorObj[this.innerHTML][0].stop(audioCtx.currentTime + .15);
    oscilatorObj[this.innerHTML] = null
  }


});




$(".button").click(function(){
  if (lastClickedID == "mic" &&  this.id != "mic") {
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
var bufferLength = analyserNode.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
analyserNode.getByteTimeDomainData(dataArray);

// Get a canvas defined with ID "oscilloscope"
var canvas = document.getElementById("oscilloscope");
canvas.width = 1315;
canvas.height = 400;
var canvasCtx = canvas.getContext("2d");

// draw an oscilloscope of the current audio source




var t = 0;



var velocity = 0;

// var s = document.getElementById("offset");
// // var output = document.getElementById("demo");
// // output.innerHTML = slider.value; // Display the default slider value
// var dt = .01;
// var triggerpointx = 0;
// s.oninput = function() {
//   velocity = parseFloat(this.value);
//   console.log("A")
// }




var pastTime = audioCtx.currentTime
var time = audioCtx.currentTime


const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length


var  velocityHist = [];
// var velocity;
var pastX = 0;
var triggerpointx = 0;
vhist = [];
function draw() {

  requestAnimationFrame(draw);
  time = audioCtx.currentTime

  analyserNode.getByteTimeDomainData(dataArray);

  // canvasCtx.fillStyle = "rgb(0, 61, 87)";
  canvasCtx.fillStyle = "rgb(0, 156, 222)";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  canvasCtx.lineWidth = 1;
  canvasCtx.strokeStyle = "rgba(255, 255, 255, 1)";

  canvasCtx.beginPath();

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


  if (velocityHist.length>=100) {
    velocityHist.shift()

  }
  velocityHist.push((triggerpointx-pastX))///(time-pastTime))
  // console.log((triggerpointx-pastX))
  // console.log(triggerpointx-pastX)
  // console.log("")
  if ((triggerpointx-pastX)<=0) {
    // console.log("WTF")
    velocityHist.push((triggerpointx-pastX)/(time-pastTime))
  }
  // if ((triggerpointx-pastX)>0) {
  //   console.log("FTW")
  // }
  pastX = triggerpointx
  // velocity = arrAvg(velocityHist)
  // console.log(velocityHist)
  x = 0
  for (var i = 0; i < bufferLength; i++) {

    var v = dataArray[i] / 128.0;
    var y = canvas.height / 2+(v-1)*canvas.height;
    // console.log(velocity)
    if (i === 0) {
      // canvasCtx.moveTo(((x-velocity*time*100)%canvas.width+canvas.width)%canvas.width, y);
      // canvasCtx.moveTo(x-triggerpointx, y);
      canvasCtx.moveTo(x, y);
    } else {
      // canvasCtx.lineTo(((x-velocity*time*100)%canvas.width+canvas.width)%canvas.width, y);
      // canvasCtx.lineTo(x-triggerpointx, y);
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();

  pastTime = audioCtx.currentTime
}

draw();
