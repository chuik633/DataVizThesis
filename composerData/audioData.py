import pandas as pd
import json
from os import listdir
import numpy as np

from singleAudioSceneData import AudioScene

def getAudioData(name):
    audioDir = f'./tmp/{name}/audios/'
    audioFilenames = [audioDir+f for f in listdir(audioDir) if f.endswith('wav')]

    all_audio_Data = []
    for i,audioFilename in enumerate(audioFilenames):
        sceneAudio = AudioScene(audioFilename)
        entry = sceneAudio.getData()
        entry['sceneNum']=i
        all_audio_Data.append(entry)

    audio_df = pd.DataFrame(all_audio_Data)
    audio_df.to_json(f'./tmp/{name}/audioSceneData.json', orient = 'records')


# getAudioData("PrincessMononoke")