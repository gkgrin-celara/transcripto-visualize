
import React, { useState, useEffect } from 'react';
import AudioPlayer from './AudioPlayer';
import LiveTranscript from './LiveTranscript';
import MetricsPanel from './MetricsPanel';
import TranscriptPanel from './TranscriptPanel';
import { Clock, LineChart, MicIcon, Volume2 } from 'lucide-react';

// Sample transcript data - in a real app this would come from an API
const sampleAudioUrl = 'https://download.samplelib.com/mp3/sample-15s.mp3';
const sampleTranscript = `
Welcome to our audio transcription application. This is a sample transcript that would normally be generated from your audio file using speech recognition technology. With this application, you can easily play and pause audio, see the live transcription, and view various metrics related to your audio file.
`;

const AudioTranscription: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [liveText, setLiveText] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [accuracy, setAccuracy] = useState(95);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Simulate transcription process
  useEffect(() => {
    if (isPlaying) {
      // Clear any existing interval
      if (timer) clearInterval(timer);
      
      // Start from current transcript length
      let startIndex = transcript.length;
      let words = 0;
      
      const interval = setInterval(() => {
        // Increment elapsed time (in seconds)
        setElapsedTime(prev => prev + 1);
        
        // Getting the next chunk of text to display
        const nextChunkSize = Math.floor(Math.random() * 5) + 3; // Random number of words
        const remainingText = sampleTranscript.slice(startIndex);
        
        if (!remainingText) {
          clearInterval(interval);
          return;
        }
        
        // Find the end of the current chunk
        let endIndex = startIndex;
        for (let i = 0; i < nextChunkSize; i++) {
          const nextSpace = remainingText.indexOf(' ', endIndex - startIndex + 1);
          if (nextSpace === -1) {
            endIndex = startIndex + remainingText.length;
            break;
          }
          endIndex = startIndex + nextSpace;
          words++;
        }
        
        // Update live and full transcript
        const newText = sampleTranscript.slice(0, endIndex);
        setTranscript(newText);
        setLiveText(sampleTranscript.slice(Math.max(0, endIndex - 60), endIndex));
        setWordCount(words);
        
        // Move to next starting point
        startIndex = endIndex;
        
        // If we've reached the end of the sample, stop the interval
        if (endIndex >= sampleTranscript.length) {
          clearInterval(interval);
        }
      }, 1000);
      
      setTimer(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    } else if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [isPlaying, transcript, timer]);
  
  const handlePlayPause = (playing: boolean) => {
    setIsPlaying(playing);
  };
  
  const handleReset = () => {
    setIsPlaying(false);
    setTranscript('');
    setLiveText('');
    setElapsedTime(0);
    setWordCount(0);
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };
  
  // Format elapsed time as mm:ss
  const formatElapsedTime = () => {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="space-y-6">
        <h1 className="text-3xl font-medium tracking-tight">Audio Transcription</h1>
        <p className="text-muted-foreground">
          Play audio and see the live transcript. Metrics are updated in real-time.
        </p>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Audio Player */}
          <AudioPlayer 
            audioUrl={sampleAudioUrl}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
          />
          
          {/* Live Transcript Panel */}
          <LiveTranscript 
            currentText={liveText} 
            isActive={isPlaying} 
          />
          
          {/* Metrics Panels */}
          <div className="grid grid-cols-3 gap-4">
            <MetricsPanel
              title="Duration"
              value={formatElapsedTime()}
              subtitle="Total time"
              icon={<Clock className="h-4 w-4 text-primary" />}
            />
            
            <MetricsPanel
              title="Word Count"
              value={wordCount}
              subtitle={`~${Math.round(wordCount / (elapsedTime / 60) || 0)} wpm`}
              icon={<LineChart className="h-4 w-4 text-primary" />}
              trend="up"
            />
            
            <MetricsPanel
              title="Accuracy"
              value={`${accuracy}%`}
              subtitle="Confidence score"
              icon={<MicIcon className="h-4 w-4 text-primary" />}
              trend="neutral"
            />
          </div>
          
          {/* Full Transcript Panel */}
          <TranscriptPanel 
            transcript={transcript} 
            isActive={isPlaying || transcript.length > 0} 
          />
        </div>
      </div>
    </div>
  );
};

export default AudioTranscription;
