import whisper
from moviepy import VideoFileClip
import os
import subprocess

def ensure_ffmpeg():
    """Check if FFmpeg is available in PATH or install it via whisper"""
    try:
        # Try to run ffmpeg
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        print("FFmpeg is installed and accessible")
    except (subprocess.SubprocessError, FileNotFoundError):
        print("FFmpeg not found in PATH, using imageio-ffmpeg instead")
        # Let moviepy/imageio handle FFmpeg
        import imageio_ffmpeg
        print(f"FFmpeg path: {imageio_ffmpeg.get_ffmpeg_exe()}")

def convert_audio_to_text(audio_file_path):
    # Make sure FFmpeg is available
    ensure_ffmpeg()
    
    # Check if file exists
    if not os.path.exists(audio_file_path):
        print(f"File not found: {audio_file_path}")
        return "Error: Audio file not found"
    
    try:
        model = whisper.load_model("tiny.en")
        result = model.transcribe(audio_file_path)
        # Return the text portion of the transcription
        return result["text"] if isinstance(result, dict) and "text" in result else str(result)
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        return f"Error transcribing audio: {str(e)}"

def convert_video_to_text(video_file_path):
    # Make sure FFmpeg is available
    ensure_ffmpeg()
    
    # Check if file exists
    if not os.path.exists(video_file_path):
        print(f"File not found: {video_file_path}")
        return "Error: Video file not found"
    
    try:
        # Create temp directory if it doesn't exist
        temp_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp")
        os.makedirs(temp_dir, exist_ok=True)
        
        temp_audio_path = os.path.join(temp_dir, "temp_audio.mp3")
        
        print(f"Loading video from: {video_file_path}")
        video_clip = VideoFileClip(video_file_path)
        
        if video_clip.audio is None:
            print("No audio found in video")
            return "No audio found in video"
            
        print(f"Extracting audio to: {temp_audio_path}")
        video_clip.audio.write_audiofile(temp_audio_path, logger=None)
        
        print("Starting transcription")
        transcription = convert_audio_to_text(temp_audio_path)
        
        # Clean up
        video_clip.close()
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)
            
        return transcription
    except Exception as e:
        print(f"Error processing video: {e}")
        return f"Error processing video: {str(e)}"# TESTING
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
