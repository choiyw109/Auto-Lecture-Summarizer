
import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload, Mic, Video, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MediaUploaderProps {
  onMediaSelect: (file: File) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onMediaSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<BlobPart[]>([]);
  const [recordingType, setRecordingType] = useState<'audio' | 'video' | null>(null);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
        onMediaSelect(file);
        toast.success(`File "${file.name}" selected`);
      } else {
        toast.error('Please select an audio or video file');
      }
    }
  }, [onMediaSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
        onMediaSelect(file);
        toast.success(`File "${file.name}" selected`);
      } else {
        toast.error('Please select an audio or video file');
      }
    }
  }, [onMediaSelect]);

  const startRecording = async (type: 'audio' | 'video') => {
    try {
      setRecordingType(type);
      const constraints = {
        audio: true,
        video: type === 'video'
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setRecordedChunks((prev) => [...prev, e.data]);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(recordedChunks, {
          type: type === 'audio' ? 'audio/webm' : 'video/webm'
        });
        
        const file = new File([blob], `recording-${Date.now()}.webm`, {
          type: type === 'audio' ? 'audio/webm' : 'video/webm'
        });
        
        onMediaSelect(file);
        setRecordedChunks([]);
        setRecordingType(null);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        toast.success(`${type} recording completed`);
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      toast.info(`${type} recording started`);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error(`Could not start ${type} recording. Please check permissions.`);
      setRecordingType(null);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "media-drop-area flex flex-col items-center justify-center",
          isDragging && "drag-active"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isRecording ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center pulse-animation">
              {recordingType === 'audio' ? <Mic className="text-white w-8 h-8" /> : <Video className="text-white w-8 h-8" />}
            </div>
            <p className="text-sm text-muted-foreground">Recording in progress...</p>
            <Button variant="destructive" onClick={stopRecording}>
              Stop Recording
            </Button>
          </div>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">Drop your media here</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Support for audio and video files
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant="outline"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <File className="mr-2 h-4 w-4" /> Select File
              </Button>
              <Button
                variant="outline"
                onClick={() => startRecording('audio')}
              >
                <Mic className="mr-2 h-4 w-4" /> Record Audio
              </Button>
              <Button
                variant="outline"
                onClick={() => startRecording('video')}
              >
                <Video className="mr-2 h-4 w-4" /> Record Video
              </Button>
            </div>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              accept="audio/*,video/*"
              onChange={handleFileChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MediaUploader;
