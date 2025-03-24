const colors = [
  [0, 0, 0, 255],
  [59, 74, 80, 255],
  [103, 147, 160, 255],
  [179, 211, 200, 255],
  [56, 72, 74, 255],
  [102, 133, 140, 255],
  [159, 186, 211, 255],
  [41, 104, 132, 255],
  [45, 39, 35, 255],
  [107, 164, 187, 255],
  [186, 208, 235, 255],
  [112, 153, 53, 255],
  [39, 31, 25, 255],
  [70, 90, 101, 255],
  [22, 22, 24, 255],
  [28, 93, 103, 255],
  [69, 60, 51, 255],
  [91, 123, 127, 255],
  [147, 174, 200, 255],
  [3, 3, 3, 255],
  [94, 109, 109, 255],
  [150, 186, 192, 255],
  [13, 24, 27, 255],
  [84, 83, 68, 255],
  [116, 140, 144, 255],
  [166, 198, 225, 255],
  [60, 51, 39, 255],
  [84, 109, 117, 255],
  [138, 164, 208, 255],
  [11, 22, 25, 255],
  [87, 87, 82, 255],
  [115, 147, 172, 255],
  [186, 216, 230, 255],
  [9, 19, 20, 255],
  [86, 82, 73, 255],
  [129, 159, 178, 255],
  [192, 217, 235, 255],
  [100, 134, 108, 255],
  [154, 185, 178, 255],
  [22, 79, 75, 255],
  [0, 0, 0, 255],
  [180, 180, 180, 255],
  [72, 72, 72, 255],
  [240, 240, 240, 255],
];

const width = 500;
const height = 500;

const bgColor = "black";
const videoName = "andshewas";
const numImages = 10;

const videoPath = `./tmp/${videoName}/video/video.mp4`;
const audioPath = `./tmp/${videoName}/audio/audio.mp3`;
const imagesDir = `./tmp/${videoName}/images/`;

//preloaded media
let audio;

function preload() {
  //load audio
  audio = loadSound(audioPath);
}

function setup() {
  createCanvas(width, height);
  background(bgColor);
}

function pixelRect(img, x, y, width, height) {}
