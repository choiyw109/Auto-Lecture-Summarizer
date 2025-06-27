# using nltk for text summarization

import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize

def summarizerWithNLTK(text):

    stopWords = set(stopwords.words("english"))
    words = word_tokenize(text)

    freq_table = dict()
    for word in words:
        if word in stopWords:
            continue
        if word in freq_table:
            freq_table[word] += 1
        else:
            freq_table[word] = 1

    sentences = sent_tokenize(text)
    sentenceValue = dict()

    for sentence in sentences:
        for word, freq in freq_table.items():
            if word in sentence.lower():
                if sentence in sentenceValue:
                    sentenceValue[sentence] += freq
                else:
                    sentenceValue[sentence] = freq

    sumValues = 0
    for sentence in sentenceValue:
        sumValues += sentenceValue[sentence]

    average = int(sumValues / len(sentenceValue))

    summary = ""

    for sentence in sentences:
        if sentence in sentenceValue and sentenceValue[sentence] > (1.2 * average):
            summary += " " + sentence

    return summary

# using summarizer api
import requests
import os
from dotenv import load_dotenv
import nltk

# Ensure NLTK data is downloaded
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
    
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

def summarizerWithAPI(text):
    """
    This function uses the EdenAI API to summarize text.
    It requires an API key stored in an environment variable.
    """
    # Load environment variables
    load_dotenv()
    
    # Ensure that the API key is set in your environment variables
    TOKEN = os.getenv("EDENAI_API_KEY")
    if not TOKEN:
        print("EdenAI API key not found in environment variables")
        # Fall back to NLTK if API key is missing
        return summarizerWithNLTK(text)

    try:
        headers = {"Authorization": f"Bearer {TOKEN}"}

        url = "https://api.edenai.run/v2/text/summarize"
        payload = {
            "providers": "microsoft",  # Using just one provider for reliability
            "language": "en",
            "text": text,
        }

        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code != 200:
            print(f"EdenAI API error: {response.status_code} - {response.text}")
            # Fall back to NLTK if API fails
            return summarizerWithNLTK(text)
            
        result = response.json()
        
        if 'microsoft' in result and 'result' in result['microsoft']:
            return result['microsoft']['result']
        else:
            print("Unexpected response format from EdenAI API")
            print(f"Response: {result}")
            # Fall back to NLTK if response format is unexpected
            return summarizerWithNLTK(text)
            
    except Exception as e:
        print(f"Error using EdenAI API: {e}")
        # Fall back to NLTK in case of any exception
        return summarizerWithNLTK(text)
    
# using llama

from ollama import chat
from ollama import ChatResponse

def summarizerWithLlama(text):
    response: ChatResponse = chat(model='llama3.2', messages=[
        {
            'role': 'user', 
            'content': f'Summarize the following: {text}'
        },
    ])

    return response.message.content
