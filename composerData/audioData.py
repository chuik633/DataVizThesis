import pandas as pd
import json
from os import listdir
import numpy as np

# sound libs
import librosa
import pyAudioAnalysis as pya
from pyAudioAnalysis import audioTrainTest

"""
makes single data entry with the audio info
"""
def getAudioData(audioFilename):

    # load audio file
    signal, sample_rate = librosa.load(audioFilename, sr=None)
    
    # loudness
    rms = librosa.feature.rms(y=signal)[0] 
    peak_amplitude = np.max(np.abs(signal))

    # intensity
    energy = librosa.feature.rms(y=signal, hop_length=sample_rate)

    # tempo
    tempo, beats = librosa.beat.beat_track(y=signal, sr=sample_rate)

    # frequency range
    D = librosa.stft(signal)
    frequency_range = librosa.core.fft_frequencies(sr=sample_rate)

    #  emotions
    # pya.featureExtraction("audio_file.wav", 1.0, 1.0, "emotion_audio_features_folder")
    # [result, features] = audioTrainTest.train_classifier('emotion_audio_features_folder')
    # predicted_emotion = audioTrainTest.classify_audio_file('audio_file.wav', result)
    # print("EMOTION", predicted_emotion)
    
    # data entry
    entry = {
        "peak_amplitude":peak_amplitude,
        "energy":energy,
        "tempo":tempo,
        "frequency_range":frequency_range,
        # "emotion":predicted_emotion
    }
    return entry


#todo: change this later
name = 'andshewas'
audioDir = f'./tmp/{name}/audios/'
audioFilenames = [audioDir+f for f in listdir(audioDir) if f.endswith('wav')]

all_audio_Data = []
for audioFilename in audioFilenames:
    entry = getAudioData(audioFilename)
    all_audio_Data.append(entry)

audio_df = pd.DataFrame(all_audio_Data)
print(audio_df.head())


# testfile = audioFilenames[0]
# features, _ = pya.audioFeatureExtraction.stFeatureExtraction(file_path, 1.0, 1.0) 
