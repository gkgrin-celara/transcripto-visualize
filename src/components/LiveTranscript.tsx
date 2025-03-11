
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';

interface LiveTranscriptProps {
  currentText: string;
  isActive: boolean;
}

const LiveTranscript: React.FC<LiveTranscriptProps> = ({ currentText, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentText]);

  return (
    <div className={cn(
      "glass-panel panel-shadow rounded-2xl p-5 transition-all duration-300 h-40",
      "animate-slide-up",
      isActive ? "border-primary/30" : "border-transparent"
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <MessageSquare className="h-4 w-4 mr-2 text-primary" />
          <h3 className="text-sm font-medium">Live Transcript</h3>
        </div>
        {isActive && (
          <div className="flex items-center space-x-1">
            <span className="h-2 w-2 bg-primary animate-pulse rounded-full" />
            <span className="text-xs text-primary">Live</span>
          </div>
        )}
      </div>
      
      <div 
        ref={containerRef}
        className="h-[calc(100%-1.75rem)] overflow-y-auto pr-2 transcript-text"
      >
        {currentText ? (
          <p className="leading-relaxed">{currentText}</p>
        ) : (
          <p className="text-muted-foreground text-sm italic">
            Transcription will appear here when audio playback begins...
          </p>
        )}
      </div>
    </div>
  );
};

export default LiveTranscript;
