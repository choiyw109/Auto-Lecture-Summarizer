
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface TranscriptionDisplayProps {
  transcription: string | null;
  summary: string | null;
  isLoading: boolean;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcription,
  summary,
  isLoading,
}) => {
  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Processing your media...</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!transcription && !summary) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      {summary && (
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Summary</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopyText(summary, "Summary")}
            >
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-sm leading-relaxed whitespace-pre-line">
              {summary}
            </div>
          </CardContent>
        </Card>
      )}

      {transcription && (
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Transcription</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopyText(transcription, "Transcription")}
            >
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-sm leading-relaxed max-h-60 overflow-y-auto whitespace-pre-line">
              {transcription}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TranscriptionDisplay;
