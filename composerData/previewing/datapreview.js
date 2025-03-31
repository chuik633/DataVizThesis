const mainDir = "../tmp/andshewas/";
let imageSceneData, audioSceneData;
let preloaded = false;

async function loadData() {
  imageSceneData = await d3.json(mainDir + "imageSceneData.json");
  audioSceneData = await d3.json(mainDir + "audioSceneData.json");

  console.log(imageSceneData);
  console.log(audioSceneData);
}

const width = window.innerWidth;
const height = window.innerHeight - 100;

let soundFiles = [];
let videoFiles = [];
let imgFiles = [];

async function preload() {
  console.log("IMAGE DATA", imageSceneData);
  for (const imgScene of imageSceneData) {
    imgScene["image"] = await loadImage(
      mainDir + "images/" + imgScene["filename"]
    );
    console.log("image loaded");
  }
  preloaded = true;
}

async function setup() {
  // load the data
  await loadData();

  // preload images
  await preload();

  createCanvas(width, height);
  if (!preloaded) {
    console.log("not preloaded");
    return;
  }
  console.log("showing images");
  previewImages(3);
}

function previewImages(numCols) {
  const imgWidth = Math.round(width / numCols);
  let y = 0;
  let x = 0;

  for (const imgScene of imageSceneData) {
    img = imgScene["image"];
    console.log(img, img.width, img.height);
    const aspect = img.width / img.height;
    // rect(x, y, imgWidth, imgWidth / aspect);
    image(img, x, y, 100, 200);

    drawColors(imgScene["colors"], x, y, imgWidth, 20);
    x += imgWidth;
    if (x >= width) {
      x = 0;
      y += imgWidth / aspect + 20;
    }
  }
}

function drawColors(colors, x, y, w, h) {
  noStroke();
  const numColors = colors.length;
  const size = min(w / (numColors + 2), h);
  const gap = (size * 2) / numColors;

  for (let i = 0; i < numColors; i++) {
    fill(colors[i]);
    rect(x + (size + gap) * i, y, size, size);
  }
}
