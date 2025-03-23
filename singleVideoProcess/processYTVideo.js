const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

//helper funciton to execute shell compands /handles the errors
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      //this is mainly error handling
      if (error) {
        reject(`! ERROR: ${stderr}`);
      }
      resolve(stdout);
    });
  });
}

//making all the directories
function makeFolders(tmpDir, name) {
  //save all paths
  let paths = {};

  //make the tmp folder if it doesnt exist
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  //make the video folder if it doesnt exist
  const videoFolder = path.join(tmpDir, name);
  paths["main"] = videoFolder;
  if (!fs.existsSync(videoFolder)) {
    fs.mkdirSync(videoFolder, { recursive: true });
  }

  //add the inside folders
  const folders = ["images", "audio", "video"];
  for (const folder of folders) {
    const folderPath = path.join(videoFolder, folder);
    paths[folder] = folderPath;
    if (!fs.existsSync(folderPath)) {
      //make it if it doesnt exist
      fs.mkdirSync(folderPath, { recursive: true });
    }
  }

  return paths;
}

//VIDEO PROCESS:
async function processYTVideo(youtubeLink, name) {
  //1. MAKE THE FOLDERS + GET THE PATHS
  const tmpDir = path.join(__dirname, "tmp");
  console.log("Setting up... ");
  console.log("Making files inside, ", tmpDir);

  const { images, audio, video } = makeFolders(tmpDir, name);
  const videoFilePath = path.join(video, "video.mp4");
  const audioFilePath = path.join(audio, "audio.mp3");

  try {
    console.log("1. Downloading video: ", name);
    await executeCommand(`yt-dlp -f best -o "${videoFilePath}" ${youtubeLink}`);

    console.log("2. Extracting Audio... ");
    await executeCommand(
      `ffmpeg -i "${videoFilePath}" -q:a 0 -map a "${audioFilePath}"`
    );

    console.log("3. Extracting Images... ");
    await executeCommand(
      `ffmpeg -i "${videoFilePath}" -vf "fps=1" "${images}/screenshot_%03d.png"`
    );

    const imageFilePaths = fs
      .readdirSync(images)
      .map((file) => path.join(images, file));

    return {
      videoPath: videoFilePath,
      audioPath: audioFilePath,
      images: imageFilePaths,
    };
  } catch (error) {
    console.error("!ERROR PROCESSING VIDEO:", error);
  }
}

const youtubeLink = "https://www.youtube.com/watch?v=OvOrbWggMTs";
processYTVideo(youtubeLink, "pingu")
  .then((result) => {
    console.log("Media processed successfully:", result);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
