function getMainColors(p, img, colorSimilarityThreshold) {
  let main_colors = [];
  function colorUnique(c) {
    for (const existing_color of main_colors) {
      if (colorDistance(p, existing_color, c) < colorSimilarityThreshold) {
        return [false, existing_color];
      }
    }
    return [true, c];
  }

  img.loadPixels();
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const inputColor = getQuick(p, img, x, y);
      [unique, color] = colorUnique(inputColor);

      if (unique) {
        main_colors.push(inputColor);
      }
    }
  }
  return main_colors;
}

function colorDistance(p, c1, c2) {
  let r1 = p.red(c1),
    g1 = p.green(c1),
    b1 = p.blue(c1);
  let r2 = p.red(c2),
    g2 = p.green(c2),
    b2 = p.blue(c2);
  let distance = p.dist(r1, g1, b1, r2, g2, b2);
  return distance;
}

function getQuick(p, img, x, y) {
  const i = (y * img.width + x) * 4;
  return [
    img.pixels[i],
    img.pixels[i + 1],
    img.pixels[i + 2],
    img.pixels[i + 3],
  ];
}

function drawColors(p, colors, x, y, w, h) {
  p.noStroke();
  const numColors = colors.length;
  const size = p.min(w / (numColors + 2), h);
  const gap = (size * 2) / numColors;

  for (let i = 0; i < numColors; i++) {
    p.fill(colors[i]);
    p.rect(x + (size + gap) * i, y, size, size);
  }
}
