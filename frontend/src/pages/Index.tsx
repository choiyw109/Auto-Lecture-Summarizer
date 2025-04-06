
import React, { useState } from 'react';
import Header from '@/components/Header';
import MediaUploader from '@/components/MediaUploader';
import TranscriptionDisplay from '@/components/TranscriptionDisplay';
import { transcribeAndSummarize } from '@/services/TranscriptionService';
import { toast } from 'sonner';

const Index = () => {
  const [transcription, setTranscription] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleMediaSelect = async (file: File) => {
    try {
      setSelectedFile(file);
      setIsProcessing(true);
      setTranscription(null);
      setSummary(null);
      
      // Process the file
      const result = await transcribeAndSummarize(file);
      
      setTranscription(result.transcription);
      setSummary(result.summary);
    } catch (error) {
      console.error('Error processing media:', error);
      toast.error('Failed to process media. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-8">
          <section className="text-center">
            <h2 className="text-2xl font-bold mb-2">Convert Your Media to Text</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Upload or record audio/video to get a transcription and summary in seconds.
            </p>
          </section>
          
          <section>
            <MediaUploader onMediaSelect={handleMediaSelect} />
          </section>
          
          {(isProcessing || transcription || summary) && (
            <section>
              <TranscriptionDisplay
                transcription={transcription}
                summary={summary}
                isLoading={isProcessing}
              />
            </section>
          )}
          
          {selectedFile && !isProcessing && (
            <section className="text-center text-sm text-muted-foreground">
              <p>
                Processed file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </p>
              <p className="text-xs mt-1">
                Note: This demo shows simulated transcription. Connect to a real API for production use.
              </p>
            </section>
          )}
        </div>
      </main>
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>WhisperSummarize - Transform your media into actionable insights</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
