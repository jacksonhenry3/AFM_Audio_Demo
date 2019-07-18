// Configuration Variables
var rampTime = .03;
var micQ = false;
var oscType = "sine";
var defaultMaxVolume = .5;
var maxVolume = defaultMaxVolume
var visualAmplitude = .1;
var source

// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create an analyser node to be the final destination for all signals
var analyser = audioCtx.createAnalyser();
analyser.fftSize = 32768/4;
var bufferLength = analyser.frequencyBinCount;
analyser.smoothingTimeConstant = .0
var dataArray = new Uint8Array(bufferLength);
var dataArray2 = new Uint8Array(bufferLength);


var globalGainNode = audioCtx.createGain();
globalGainNode.gain.setValueAtTime(maxVolume, audioCtx.currentTime);
globalGainNode.connect(audioCtx.destination)

// the analyser node will be the only node connected to the output
analyser.connect(globalGainNode)

// creates an oscilator
var sliderOscilator = audioCtx.createOscillator();
var sliderGainNode = audioCtx.createGain();
sliderOscilator.connect(sliderGainNode)
sliderGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
sliderGainNode.connect(analyser)
sliderOscilator.start()

// when a key is pressed, a button clicked or tapped this is called to play the right note
function playNote(freq, type){

  // generate an oscilator and a gain node to control the volume
  var oscillator = audioCtx.createOscillator();
  var gain = audioCtx.createGain();

  // set oscilator properties and connect it to the gain node
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime); // value in hertz
  oscillator.connect(gain)

  // by adding a short ramp to volume we avoid speaker clicking
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(visualAmplitude, audioCtx.currentTime + rampTime);

  // connect the gain node to the analyser
  gain.connect(analyser)

  oscillator.start();
  return [oscillator,gain]
}

// map keys (and buttons) to frequencies
rootfreq = 200

var freqObj = {
  "w":rootfreq, //c 
  "3":rootfreq*16/15., //c#
  "e":rootfreq*9/8., // d
  "4":rootfreq*6/5., //e flat
  "r":rootfreq*5/4., //e
  "t":rootfreq*4/3, //f
  "6":rootfreq*7./5,//f sharp g flat
  "y":rootfreq*3./2, //g
  "7":rootfreq*8./5,
  "u":rootfreq*5/3.,
  "8":rootfreq*9./5,
  "i":rootfreq*15/8,
  "o":rootfreq*2
}



// keeps track of created and destroyed oscilators
var oscilatorObj = {}

// start and stop functions for each note, slider and the mic.
$("#myRange").bind('input', startFreqSlider);
$("#myRange").bind("touchend mouseout", stopFreqSlider);
$(document).bind("keydown", keydown);
$(document).bind("keyup", keyup);
$(".key").bind("touchstart mousedown", clickStart);
$(".key").bind("touchend mouseup", clickEnd);
$(".button").bind("click", selectType)

function startFreqSlider(){
  // change the frequency based on the slider value
  // human hearing is logarithmic so to make the slider sound linear I exponentiate
  // the possible frequency values are 60 to 1000 (as restricted by input in html)
  sliderOscilator.frequency.setValueAtTime(Math.exp(this.value), audioCtx.currentTime);
  sliderOscilator.type = oscType
  // if the slider was previously off, turn it on.
  if (sliderGainNode.gain.value == 0) {
    sliderGainNode.gain.linearRampToValueAtTime(visualAmplitude, audioCtx.currentTime + .02);
  }
};

function stopFreqSlider(){
  sliderGainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + .02);
};

function keydown(event){
  // check which key is being press
  note = String.fromCharCode(event.keyCode).toLowerCase()
  // if  they arent already pressing this key and it is a mapped key
  if (oscilatorObj[note] == null && ["w","3","e","4","r","t","6","y","7","u","8","i","o"].indexOf(note) >= 0) {
      // play a note with the frequency mapped out in freqObj
      oscilatorObj[note] = playNote(freqObj[note],oscType)
  }
};

function keyup(event){
  // check which key is being press
  note = String.fromCharCode(event.keyCode).toLowerCase()

  if (["w","3","e","4","r","t","6","y","7","u","8","i","o"].indexOf(note) >= 0) {
    // ramp down the volume of that note and then stop the oscilator
    oscilatorObj[note][1].gain.linearRampToValueAtTime(0, audioCtx.currentTime + .02);
    oscilatorObj[note][0].stop(audioCtx.currentTime + rampTime);

    // mark the oscilator as no longer existing for that note
    oscilatorObj[note] = null
  }
};

function clickStart(){

  // if this note isnt already being played
  if (oscilatorObj[this.innerHTML] == null) {

      // check which key is being clicked
      note = this.innerHTML.trim();
      oscilatorObj[this.innerHTML] = playNote(freqObj[note],oscType)
  }

};

function clickEnd(){
    // check which key is being clicked
    // note = parseFloat(this.innerHTML)

    // ramp down the volume of that note and then stop the oscilator
    oscilatorObj[this.innerHTML][1].gain.linearRampToValueAtTime(0, audioCtx.currentTime + rampTime);
    oscilatorObj[this.innerHTML][0].stop(audioCtx.currentTime + rampTime);

    // mark the oscilator as no longer existing for that note
    oscilatorObj[this.innerHTML] = null
  };
var source  = audioCtx.createAnalyser();

function selectType(){
  // if the user selected a wave type
  if (this.id != "mic"){
    // the analyser node will be the only node connected to the output
    
    source.disconnect()
    analyser.connect(globalGainNode)
    oscType = this.id;

    // becouse different waveshapes had different integrations they sound louder.
    // therfore the larger waves have a lower max volume to compensate
    if (oscType == "square" || oscType == "sawtooth") {
      maxVolume = defaultMaxVolume/4
      globalGainNode.gain.setValueAtTime(maxVolume, audioCtx.currentTime);
    }
    else {
      maxVolume = defaultMaxVolume
      globalGainNode.gain.setValueAtTime(maxVolume, audioCtx.currentTime);
    }
  }
    if (this.id == "mic") {
    micQ = true
    micQQ = true
    sliderGainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + .03);
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
              analyser.disconnect()
              source.connect(analyser);
              // source.connect(audioCtx.destination)

          })
          .catch( function(err) { console.log('The following gUM error occured: ' + err);})
    }

    // if the users browser doesnt suopport web audio
    else
    {
       console.log('getUserMedia not supported on your browser!');
    }

  }
};
