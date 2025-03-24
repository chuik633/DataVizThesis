const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

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

  //make the video folder if it doesnt exist
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  //add the inside folders
  const folders = ["images", "audio"];
  for (const folder of folders) {
    const folderPath = path.join(tmpDir, folder);
    paths[folder] = folderPath;
    if (!fs.existsSync(folderPath)) {
      //make it if it doesnt exist
      fs.mkdirSync(folderPath, { recursive: true });
    }
  }

  return paths;
}

//get video duration
async function getVideoLength(videoFilePath) {
  try {
    const { stdout } = await execPromise(
      `ffprobe -v quiet -print_format json -show_format ${videoFilePath}`
    );

    const videoInfo = JSON.parse(stdout);
    const duration = videoInfo.format.duration;

    return parseFloat(duration);
  } catch (error) {
    console.error("Error retrieving video duration:", error);
  }
}

//VIDEO PROCESS:
async function processVideo(videoFilePath, name) {
  //1. MAKE THE FOLDERS + GET THE PATHS
  const tmpDir = path.join(__dirname, "tmp", name);

  const { images, audio } = makeFolders(tmpDir, name);
  const audioFilePath = path.join(audio, "audio.mp3");

  const numSamples = 100;

  try {
    console.log("1. Computing video sample rate: ", name);
    const videoLength = await getVideoLength(videoFilePath);
    const intervalLen = videoLength / numSamples;
    const sampleRate = 1 / intervalLen;

    console.log("2. Extracting Audio... ");
    await executeCommand(
      `ffmpeg -i "${videoFilePath}" -q:a 0 -map a "${audioFilePath}"`
    );

    console.log("3. Extracting Images... ");
    await executeCommand(
      `ffmpeg -i "${videoFilePath}" -vf "fps=${sampleRate}" "${images}/ss_%03d.png"`
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

const videoPath = "./tmp/PrincessMononoke/video.mp4";
processVideo(videoPath, "PrincessMononoke")
  .then((result) => {
    console.log("Media processed successfully:", result);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
