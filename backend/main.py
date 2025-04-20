# import flask
from flask import Flask, jsonify, request
from dotenv import load_dotenv

import videoToText
import textSummarize

load_dotenv()
app = Flask('__name__')

@app.route('/test', methods=['GET'])
def test():
    return {'message': 'Hello, World!'}

@app.route('/summarize', methods=['POST'])
def summarizeAudio():
    payload = request.get_json()
    input_file = payload.get('file')
    filetype = payload.get('filetype')
    transcription = ""
    summary = ""
    if filetype == 'video':
        transcription = videoToText.convert_video_to_text(input_file)
    elif filetype == 'audio':
        transcription = videoToText.convert_audio_to_text(input_file)
    else:
        # SERVER ERROR
        return {'error': 'Bad request'}, 500

    summary = textSummarize.summarizerWithAPI(transcription)
    # summary = textSummarize.summarizerWithLlama(transcription)
    # summary = textSummarize.summarizerWithNLTK(transcription)

    return jsonify({"transcription": transcription, "summary": summary})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
