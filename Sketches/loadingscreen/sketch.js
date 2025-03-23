let font;
const width = window.innerWidth;
const height = window.innerHeight;
//sound variables
let fft;
let amplitude;
let sound;

//Color vars
let textColor = "#C54400";
let bgColor = "black";

//saved font lines
let line_segments = [];

function preload() {
  font = loadFont("./styles/Jost-Bold.ttf");
}

function setup() {
  createCanvas(width, height);
  background("black");
  textFont(font);
  textSize(15);
}

function draw() {
  const stepSize = 20;
  fill("white");
  for (let x = 0; x < width; x += stepSize) {
    for (let y = 0; y < height; y += stepSize) {
      push();
      translate(x, y);
      rotate(90);
      rect(0, 0, 2, 15);
      pop();
    }
  }

  textAlign(CENTER);
  text("L  O  A  D  I  N  G ", width / 2, height / 2);
}
