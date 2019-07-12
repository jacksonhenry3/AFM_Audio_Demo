// Configuration Variables
var rampTime = .01;
var micQ = false;
var oscType = "sine";
var defaultMaxVolume = .5;
var maxVolume = defaultMaxVolume
var visualAmplitude = .25;


// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create an analyser node to be the final destination for all signals
var analyser = audioCtx.createAnalyser();
analyser.fftSize = 32768/4;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);


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
  gain.gain.linearRampToValueAtTime(visualAmplitude, audioCtx.currentTime + .02);

  // connect the gain node to the analyser
  gain.connect(analyser)

  oscillator.start();
  return [oscillator,gain]
}

// map keys (and buttons) to frequencies
var freqObj = {
  "1":261.63/4,
  "2":293.66/4,
  "3":329.63/4,
  "4":349.23/4,
  "5":392.00/4,
  "6":440.00/4,
  "7":493.88/4,
  "8":523.25/4
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
  if (oscilatorObj[note] == null && ["1","2","3","4","5","6","7","8"].indexOf(note) >= 0) {
      // play a note with the frequency mapped out in freqObj
      oscilatorObj[note] = playNote(freqObj[note],oscType)
  }
};

function keyup(event){
  // check which key is being press
  note = String.fromCharCode(event.keyCode).toLowerCase()

  if (["1","2","3","4","5","6","7","8"].indexOf(note) >= 0) {
    // ramp down the volume of that note and then stop the oscilator
    oscilatorObj[note][1].gain.linearRampToValueAtTime(0, audioCtx.currentTime + .02);
    oscilatorObj[note][0].stop(audioCtx.currentTime + .025);

    // mark the oscilator as no longer existing for that note
    oscilatorObj[note] = null
  }
};

function clickStart(){

  // if this note isnt already being played
  if (oscilatorObj[this.innerHTML] == null) {
      // check which key is being clicked
      note = parseFloat(this.innerHTML)
      oscilatorObj[this.innerHTML] = playNote(freqObj[note],oscType)
  }

};

function clickEnd(){
    // check which key is being clicked
    note = parseFloat(this.innerHTML)

    // ramp down the volume of that note and then stop the oscilator
    oscilatorObj[this.innerHTML][1].gain.linearRampToValueAtTime(0, audioCtx.currentTime + .02);
    oscilatorObj[this.innerHTML][0].stop(audioCtx.currentTime + .025);

    // mark the oscilator as no longer existing for that note
    oscilatorObj[this.innerHTML] = null
  };

function selectType(){
  // if the user selected a wave type
  if (this.id != "mic"){
    oscType = this.id;

    // becouse different waveshapes had different integrations they sound louder.
    // therfore the larger waves have a lower max volume to compensate
    if (oscType == "square" || oscType == "sawtooth") {
      maxVolume = defaultMaxVolume/4
    }
    else {
      maxVolume = defaultMaxVolume
      globalGainNode.gain.setValueAtTime(maxVolume, audioCtx.currentTime);
    }
  }
};
