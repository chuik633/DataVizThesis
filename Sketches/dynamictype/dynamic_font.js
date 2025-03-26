//canvas variables
const width = window.innerWidth;
const height = 800;

//font variables
let font;
let maxFontSize = 50;
let sampleFac = 0.8;

//sound variables
let fft;
let amplitude;
let sound;

//inputs
let caption = "hello world";
let soundPath = "./sounds/andshewas.mp3";

function preload() {
  font = loadFont("./styles/LexendTera-Bold.ttf");
  sound = loadSound(soundPath);
}

function setup() {
  //canvas set up
  createCanvas(width, height);
  background("black");
  textFont(font);

  //sound buttons
  createButton("play").mousePressed(start);
  createButton("stop").mousePressed(stop);

  //fft
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
}

function draw() {
  background("black");
  drawText(
    caption,
    (x = width / 2),
    (y = 100),
    (maxWidht = width - 50),
    (animateNoise = false),
    (animatePos = true),
    (animateSize = false)
  );
  rect(0, 200, width, 1);
  drawText(
    caption,
    (x = width / 2),
    (y = 300),
    (maxWidht = width - 50),
    (animateNoise = true),
    (animatePos = false),
    (animateSize = false)
  );
  rect(0, 400, width, 1);
  drawText(
    caption,
    (x = width / 2),
    (y = 500),
    (maxWidht = width - 50),
    (animateNoise = false),
    (animatePos = false),
    (animateSize = true)
  );
  rect(0, 600, width, 1);

  drawText(
    caption,
    (x = width / 2),
    (y = 750),
    (maxWidht = width - 50),
    (animateNoise = true),
    (animatePos = true),
    (animateSize = true)
  );
}

//sound controls
function start() {
  sound.play(0, 1, 2, 90);
}
function stop() {
  sound.stop();
}

function drawText(
  inputText,
  x,
  y,
  maxWidth,
  animateNoise,
  animatePos,
  animateSize
) {
  //resize the font if its too big
  let fontSize = getResizedFontSize(inputText, maxFontSize, maxWidth);

  //analyze the spectrum
  let spectrum = fft.analyze();

  //format the sizing
  let textWidth = inputText.length * fontSize;
  x -= textWidth / 2; //shift it so its centered

  //divide the spectrum up to the letters
  let sample_size = Math.round(spectrum.length / inputText.length); //the size of the spectrum to correspond to each letter

  //Draw each letter
  for (let letterIdx = 0; letterIdx < inputText.length; letterIdx++) {
    const letter = inputText[letterIdx];
    let amp_average = 0;
    for (
      let i = sample_size * letterIdx;
      i < sample_size * (letterIdx + 1) && i < spectrum.length;
      i++
    ) {
      amp_average += spectrum[i] / sample_size;
    }

    //Animate Size
    let size_shift = 1;
    if (animateSize) {
      size_shift = map(amp_average, 0, 255, 1, 2);
    }
    let letter_fontSize = fontSize * size_shift;

    //Animate position
    let y_shift = 0;
    if (animatePos) {
      y_shift = map(amp_average, 0, 255, 0, letter_fontSize);
    }

    //Sample letter points
    sampleFac = map(letter_fontSize, 10, 100, 0.8, 0.3); //set font size accordingly
    let letter_points = font.textToPoints(
      letter,
      x,
      y - y_shift,
      letter_fontSize,
      { sampleFactor: sampleFac }
    );

    //Draw letter from points
    if (animateNoise) {
      drawLetterFromPoints(letter_points, amp_average, fontSize / 2);
    } else {
      drawLetterFromPoints(letter_points, amp_average, 0);
    }

    //move position along
    x += letter_fontSize;
  }
} //draw a single letter add params her
function drawLetterFromPoints(points, amp, noiseSize) {
  fill("white");
  noStroke();
  beginShape();
  for (const point of points) {
    let n_zoom = 0.05;
    let n_speed = map(amp, 0, 255, 0.001, 0.05);
    let n =
      noise(n_zoom * point.x, n_zoom * point.x, frameCount * n_speed) *
      noiseSize;
    vertex(point.x + n, point.y + n);
  }
  endShape();
}

/**
 * helper function to get resized font size
 */
function getResizedFontSize(inputText, currFontSize, max_size) {
  const inputletters = inputText.split("");
  let squishedFontSize = currFontSize;

  // squeeze the width to fit
  while (inputletters.length * squishedFontSize > max_size) {
    squishedFontSize -= 1;
  }

  return squishedFontSize;
}
