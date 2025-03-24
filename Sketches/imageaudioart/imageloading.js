const width = 500;
const height = 500;

const bgColor = "black";
const videoName = "andshewas";
const numImages = 10;

const videoPath = `./tmp/${videoName}/video/video.mp4`;
const audioPath = `./tmp/${videoName}/audio/audio.mp3`;
const imagesDir = `./tmp/${videoName}/images/`;
let imagePaths = [];

//preloaded media
let audio;
let images = [];

function preload() {
  //load audio
  audio = loadSound(audioPath);

  //make image paths
  for (let i = 1; i <= numImages; i++) {
    if (i < 10) {
      imagePaths.push(imagesDir + `screenshot_00${i}.png`);
    } else if (i < 100) {
      imagePaths.push(imagesDir + `screenshot_0${i}.png`);
    } else {
      imagePaths.push(imagesDir + `screenshot_${i}.png`);
    }
  }

  //load the images
  for (const imagePath of imagePaths) {
    images.push(loadImage(imagePath));
  }
}

function setup() {
  createCanvas(width, height);
  background(bgColor);

  previewImages(2);
}

function previewImages(numCols) {
  const imgWidth = Math.round(width / numCols);
  let y = 0;
  let x = 0;

  for (const img of images) {
    const aspect = img.width / img.height;
    image(img, x, y, imgWidth, imgWidth / aspect);
    x += imgWidth;
    if (x >= width) {
      x = 0;
      y += imgWidth / aspect;
    }
  }
}

// function draw() {
//   background(bgColor);

// }

function pixelRect(img, x, y, width, height) {}
