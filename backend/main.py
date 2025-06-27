from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import videoToText
import textSummarize
import traceback

load_dotenv()
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/test', methods=['GET'])
def test():
    return {'message': 'Hello, World!'}

@app.route('/summarize', methods=['POST'])
def summarizeAudio():
    try:
        # Check if file is present in the request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Create temp directory if it doesn't exist
        temp_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp")
        os.makedirs(temp_dir, exist_ok=True)
        
        # Save the uploaded file
        temp_file_path = os.path.join(temp_dir, "temp_input_file")
        file.save(temp_file_path)
        
        # Get file type
        filetype = request.form.get('fileType', '').lower()
        print(f"File type received: {filetype}")
        
        # Determine if it's audio or video
        if 'audio' in filetype:
            filetype = 'audio'
        elif 'video' in filetype:
            filetype = 'video'
        else:
            return jsonify({'error': f'Unsupported file type: {filetype}'}), 400
        
        # Process the file
        transcription = ""
        if filetype == 'video':
            print("Processing video file")
            transcription = videoToText.convert_video_to_text(temp_file_path)
        elif filetype == 'audio':
            print("Processing audio file")
            transcription = videoToText.convert_audio_to_text(temp_file_path)
        
        print(f"Transcription result: {transcription[:100]}...")
        
        # Generate summary
        summary = textSummarize.summarizerWithLlama(transcription)
        print(f"Summary result: {summary[:100]}...")
        
        # Clean up the temp file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        
        return jsonify({
            "transcription": transcription,
            "summary": summary
        })
    
    except Exception as e:
        print(f"Error in /summarize: {e}")
        traceback.print_exc()
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    # Create temp directory
    temp_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp")
    os.makedirs(temp_dir, exist_ok=True)
    
    # Verify FFmpeg is available
    try:
        import videoToText
        videoToText.ensure_ffmpeg()
    except Exception as e:
        print(f"Warning: FFmpeg check failed: {e}")
    
    app.run(host='0.0.0.0', port=5000, debug=True)