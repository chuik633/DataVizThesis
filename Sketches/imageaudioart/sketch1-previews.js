let previews = function (p) {
  const width = 500;
  const height = 600;

  const bgColor = "rgb(238, 237, 226)";
  const videoName = "princessMononoke";
  const numImages = 25;

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
        imagePaths.push(imagesDir + `ss_00${i}.png`);
      } else if (i < 100) {
        imagePaths.push(imagesDir + `ss_0${i}.png`);
      } else {
        imagePaths.push(imagesDir + `ss_${i}.png`);
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

    previewImagesColors(4);
  };

  function previewImagesColors(numCols) {
    const imgWidth = Math.round(width / numCols);
    let y = 0;
    let x = 0;

    for (const img of images) {
      //draw image
      const imgHeight = (imgWidth / img.width) * img.height;
      p.image(img, x, y, imgWidth, imgHeight);

      //colors
      const colors = getMainColors(p, img, 100);
      allColors.push(colors);
      drawColors(p, colors, x, y + imgHeight + 10, (imgWidth * 2) / 3, 20);

      //update pos
      x += imgWidth;
      if (x >= width) {
        x = 0;
        y += imgHeight + 50;
      }
    }
  }


};

new p5(previews);
