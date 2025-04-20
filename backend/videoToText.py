import whisper
from moviepy import VideoFileClip
from sys import argv
import os

def convert_audio_to_text(audio_file_path):
    model = whisper.load_model("tiny.en")
    transcription = model.transcribe(audio_file_path)
    return transcription

def convert_video_to_text(video_file_path):
    audio_clip = VideoFileClip(video_file_path).audio

    if (audio_clip == None):
        print("Couldn't get audio from video")
        return []
    audio_clip.write_audiofile("temp.mp3")

    transcription = convert_audio_to_text("temp.mp3")
    os.remove("temp.mp3")
    
    return transcription

# TESTING
# def main():
#     print(argv)
#     if (len(argv) != 3):
#         print('Usage: python3 videoToText.py ["audio" or "video"] [path to audio or video]')
#         return 1
#     if (argv[1] == "audio"):
#         print(convert_audio_to_text(argv[2]))
#     elif (argv[1] == "video"):
#         print(convert_video_to_text(argv[2]))
#     else:
#         print('Usage: python3 videoToText.py ["audio" or "video"] [path to audio or video]')
#         return 1
# 
# main()
