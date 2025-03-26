const width = window.innerWidth;

const colorsClusters = [
  [94, 33, 56],
  [57, 29, 36],
  [41, 43, 55],
  [73, 82, 95],
  [66, 62, 65],
];
width;

const colorsUnique = [
  [146, 42, 82],
  [70, 122, 147],
  [179, 119, 144],
  [49, 62, 67],
  [0, 0, 0],
];
function setup() {
  createCanvas(width, window.innerHeight);
  drawColors(colorsClusters, 0, 0, width, 100);
  drawColors(colorsUnique, 0, 100, width, 100);
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
