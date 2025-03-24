let sketch2 = function (p) {
  const width = 500;
  const height = 500;

  const bgColor = "black";
  const videoName = "andshewas";
  const numImages = 13;

  const videoPath = `./tmp/${videoName}/video/video.mp4`;
  const audioPath = `./tmp/${videoName}/audio/audio.mp3`;
  const imagesDir = `./tmp/${videoName}/images/`;
  let imagePaths = [];

  //preloaded media
  let audio;
  let images = [];

  let allColors = [];

  p.preload = function () {
    //load audio
    audio = p.loadSound(audioPath);

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
      images.push(p.loadImage(imagePath));
    }
  };

  p.setup = function () {
    const canvas = p.createCanvas(width, height);
    canvas.parent(document.body).class("sketch");
    p.background(bgColor);

    for (const img of images) {
      const colors = getMainColors(p, img, 100);
      allColors.push(colors);
    }
    allColors = allColors.flat();
    console.log(allColors);

    for (const c of allColors) {
      p.fill(c);
      p.noStroke();
      p.push();
      p.translate(width * p.random(), height * p.random());
      p.rotate(360 * p.random());
      p.rect(0, 0, 5, 20);
      p.pop();
    }
  };

  function pixelRect(img, x, y, width, height) {}
};

new p5(sketch2);
