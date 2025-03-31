
import subprocess
import json
import os


from audioData import getAudioData
from imageData import getImageData
from captionsData import getCaptionData

"""
inputting a movie file, it then:
1. if its a youtube link, it downloads it to a video
2. splits the video in n_samples videos, and corresponding audio files and images
3. gets the color information for each scene imageSceneData.json
4. gets the audio data for each scene and saves it in audioSceneData.json
5. gets the caption data
6. saves a compiled scene data
"""
def getData(name, numSamples = 20, youtubeLink = False, captions = False):
    mainDir = f"./tmp/{name}/"
    os.makedirs(mainDir, exist_ok=True)

    #1. if its a youtube link, it downloads it to a video
    if youtubeLink != False:
        try:
            command = ['yt-dlp', '-o', mainDir+"video.mp4", youtubeLink]
            result = subprocess.run(command, capture_output=True, text=True, check=True)
        except subprocess.CalledProcessError as e:
            print("Error downloading video:", e.stderr)
            return

    #2. splits the video in n_samples videos, and corresponding audio files and images
    command = ['node', 'processVideo.js', str(name), str(numSamples)]
    try:
        result = subprocess.run(command,capture_output=True, text=True, check=True)
        print("Split video successfully")
    except subprocess.CalledProcessError as e:
        print("Error processing video:", e.stderr)
        return
    
    #get the info of the video
    videoInfo = None
    with open(mainDir+"videoInfo.json", 'r') as file:
        videoInfo = json.load(file)
    if(videoInfo == None):
        print("Error getting video info:", e.stderr)
        return
    print(videoInfo)
    

    #3. gets the color information for each scene imageSceneData.json
    getImageData(name)

    #4. gets the audio data for each scene and saves it in audioSceneData.json
    getAudioData(name)

    #5. saves captions if there are them
    if captions:
        getCaptionData(name, int(videoInfo['sampleLength']))


    

getData('Everything', numSamples = 80, youtubeLink ='https://www.youtube.com/watch?v=T51QSG9VN8w')
# getData('PrincessMononoke', numSamples = 100)