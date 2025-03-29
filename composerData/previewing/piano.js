// require https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js
// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.0/addons/p5.sound.js

let mySound;
let fft;
let bckground;
const width = 800;
const height = 300;
let y_shift = 50;
let x_shift = 50;

//piano settings
let pianoNotesToCoords = {};
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const A440 = 440;
const num_octaves = 8;
const key_width = width / (num_octaves * notes.length);
const key_height = 50;

const MOVIENAME = "andshewas";
const SCENEIDX = 4;
const filmfolder = `../../tmp/${MOVIENAME}`;

function preload() {
  mySound = loadSound(`${filmfolder}/audios/${SCENEIDX}.wav`);
  bckground = loadImage(`${filmfolder}/images/${SCENEIDX}.png`);
}

function setup() {
  createCanvas(width, height);
  createPianoCoords();
  console.log(pianoNotesToCoords);

  const startButton = createButton("play");
  startButton.mousePressed(start);

  // Initialize FFT
  fft = new p5.FFT();
}

function start() {
  mySound.play();
}

function dampenMiddleC(spectrum) {
  let transformed = [];

  const middleC = 261.63; // Frequency of middle C
  const dampeningRadius = 2000; // Radius around middle C to dampen
  const maxDampeningFactor = 0.5; // Minimum value for frequencies around middle C
  const baseEmphasisFactor = 1; // Base factor for outer frequencies

  for (let i = 0; i < spectrum.length; i++) {
    // Convert index to frequency
    let freq = map(i, 0, spectrum.length, 0, sampleRate() / 2);
    let value = spectrum[i];
    let dampeningFactor = 1; // Default factor

    // Calculate distance from middle C
    let distanceFromMiddleC = Math.abs(freq - middleC);

    // Apply dampening or emphasis based on distance
    if (distanceFromMiddleC < dampeningRadius) {
      // Smoothly reduce the amplitude for frequencies close to middle C
      let smoothFactor = map(
        distanceFromMiddleC,
        0,
        dampeningRadius,
        maxDampeningFactor,
        1.2
      );
      dampeningFactor = smoothFactor; // Dampening is based on distance
    } else {
      dampeningFactor = baseEmphasisFactor; // Emphasize frequencies outside the dampened range
    }

    // Apply the transformation
    transformed[i] = value * dampeningFactor;
  }

  return transformed;
}

function draw() {
  background("#BD2B2B");
  image(bckground, 0, 0, width, height);
  filter(BLUR, 30);
  let spectrum = fft.analyze();
  let transformed_spectrum = dampenMiddleC(spectrum);
  let pressedNotes = [];
  for (let i = 0; i < spectrum.length; i++) {
    //each spectrum part
    let freq = map(i, 0, spectrum.length, 0, sampleRate() / 2);
    let amplitude = spectrum[i];
    let noteName = freqToNoteName(freq);

    let transformed_amp = transformed_spectrum[i];
    // console.log("NORMAL:", amplitude, "TRANSFORMED", transformed_amp)

    let noteCoords = pianoNotesToCoords[noteName];

    let y = y_shift + key_height;

    let amp_height = map(amplitude, 0, 255, 0, 200);
    let transformed_amp_height = map(transformed_amp, 0, 255, 0, 200);

    // fill("#FCFBE9")
    // blendMode(BLEND)
    // rect(noteCoords.x, y,noteCoords.width, amp_height);
    noFill();
    blendMode(OVERLAY);
    stroke("#FCFBE9");
    if (pressedNotes.indexOf(noteName) == -1 && transformed_amp > 120) {
      pressedNotes.push(noteName);
      blendMode(BLEND);
      fill("#FCFBE9");
    }
    if (noteName == "undefined-Infinity" || "None" == noteName) {
      continue;
    }

    rect(noteCoords.x, y, noteCoords.width, transformed_amp_height);
    noStroke();
    blendMode(BLEND);
  }
  // console.log(pressedNotes)
  drawPiano(pressedNotes);
}

//notes on piano

function createPianoCoords() {
  let x = x_shift;
  let y = y_shift;
  for (let octave = 0; octave <= num_octaves; octave++) {
    for (const note of notes) {
      if (note.includes("#")) {
        let blackPosX = x - key_width + key_width / 2 + key_width / 4;
        pianoNotesToCoords[`${note}${octave}`] = {
          x: blackPosX,
          y: y,
          width: key_width / 2,
        };
      } else {
        rect(x, y, key_width, key_height);
        pianoNotesToCoords[`${note}${octave}`] = {
          x: x,
          y: y,
          width: key_width,
        };
        x += key_width;
      }
    }
  }
}

function drawPiano(pressedNotes) {
  strokeWeight(0.1);
  let x = x_shift;
  let y = y_shift;
  let blackKeys = [];
  for (let octave = 0; octave <= num_octaves; octave++) {
    for (const note of notes) {
      if (note.includes("#")) {
        let blackPosX = x - key_width + key_width / 2 + key_width / 4;
        blackKeys.push([`${note}${octave}`, blackPosX]);
        fill("#FCFBE9");
        textSize(3);
        text(note, blackPosX, y - 3);
      } else {
        fill("#FCFBE9");
        stroke("#273439");
        blendMode(BLEND);
        if (pressedNotes.includes(`${note}${octave}`)) {
          blendMode(OVERLAY);
          stroke("#FCFBE9");
          fill("#D79286");
        }

        rect(x, y, key_width, key_height);
        // fill("#FCFBE9")

        blendMode(BLEND);
        textSize(3);
        text(note, x + 3, y + key_height + 5);
        x += key_width;
      }
    }
  }
  for (const [note_str, x] of blackKeys) {
    fill("#273439");
    if (pressedNotes.includes(note_str)) {
      fill("#E73C05");
    }
    blendMode(BLEND);
    rect(x, y, key_width / 2, (key_height * 2) / 3);
  }
}

//used online to help with this
function freqToNoteName(freq) {
  const A4 = 440; // Frequency of A4
  const C0 = A4 * Math.pow(2, -4.75); // C0 frequency

  let noteNum = Math.round(12 * Math.log2(freq / C0));
  let octave = Math.floor(noteNum / 12);
  let note = notes[noteNum % 12];

  if (octave > 7) {
    return "None";
  }
  return `${note}${octave}`;
}
