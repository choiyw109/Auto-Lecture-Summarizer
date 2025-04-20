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
load_dotenv()


def summarizerWithAPI(text):
    """
    This function uses the EdenAI API to summarize text.
    It requires an API key stored in an environment variable.
    """
    # Ensure that the API key is set in your environment variables
    if "EDENAI_API_KEY" not in os.environ:
        raise ValueError("Please set the EDENAI_API_KEY environment variable.")

    # Use the API key from the environment variable

    TOKEN = os.getenv("EDENAI_API_KEY")

    headers = {"Authorization": TOKEN}

    url = "https://api.edenai.run/v2/text/summarize"
    payload = {
        "providers": "microsoft,connexun",
        "language": "en",
        "text": text,
    }

    response = requests.post(url, json=payload, headers=headers)

    result = response.json()
    return result['microsoft']['result']

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
