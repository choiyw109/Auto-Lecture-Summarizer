// TranscriptionService.ts

export interface TranscriptionResult {
  transcription: string;
  summary: string;
}

export const transcribeAndSummarize = async (mediaFile: File): Promise<TranscriptionResult> => {
  console.log(`Processing file: ${mediaFile.name} (${mediaFile.type})`);
    
  
  try {
    const formData = new FormData();
    formData.append('file', mediaFile);
    formData.append('fileType', mediaFile.type);

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