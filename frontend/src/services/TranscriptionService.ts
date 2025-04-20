
// This is a placeholder service for transcription and summarization
// In a real implementation, this would connect to a speech-to-text API

export interface TranscriptionResult {
  transcription: string;
  summary: string;
}

export const transcribeAndSummarize = async (mediaFile: File): Promise<TranscriptionResult> => {
  // This is a mock function that simulates processing time
  // In a real app, you would send the file to a backend service
  
  console.log(`Processing file: ${mediaFile.name} (${mediaFile.type})`);
    
  // Simulate different results based on file name to make it more interactive
  const formData = new FormData();
  formData.append('file', mediaFile);
  formData.append('fileType', mediaFile.type);
  try {
    const res = await fetch('http://localhost:5000/summarize', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();

    let transcription = data.transcription;
    let summary = data.summary;


    if (mediaFile.type.startsWith('audio/')) {
      transcription = `[Audio Transcription] ${transcription}`;
    } else {
      transcription = `[Video Transcription] ${transcription}`;
    }

    return {
      transcription,
      summary
    };
  } catch (error) {
    console.error('Error processing media:', error);
    return {
      transcription: 'Error fetching transcription.',
      summary: 'Error fetching summary.'
    };
  }
};