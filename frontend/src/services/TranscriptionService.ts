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

    console.log("Sending request to backend...");
    const res = await fetch('http://localhost:5000/summarize', {
      method: 'POST',
      body: formData,
    });

    console.log(`Server response status: ${res.status}`);
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Server error: ${errorText}`);
      throw new Error(`Server returned ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    console.log("Response received successfully");
    
    return {
      transcription: data.transcription || 'No transcription available',
      summary: data.summary || 'No summary available'
    };
  } catch (error) {
    console.error('Error processing media:', error);
    return {
      transcription: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      summary: 'Could not generate summary due to an error.'
    };
  }
};