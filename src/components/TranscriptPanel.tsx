
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { FileText, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface TranscriptPanelProps {
  transcript: string;
  isActive: boolean;
}

const TranscriptPanel: React.FC<TranscriptPanelProps> = ({ transcript, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && isActive) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcript, isActive]);

  const handleCopy = () => {
    if (!transcript) return;
    
    navigator.clipboard.writeText(transcript)
      .then(() => {
        toast.success("Transcript copied to clipboard");
      })
      .catch(err => {
        console.error("Failed to copy transcript: ", err);
        toast.error("Failed to copy transcript");
      });
  };

  return (
    <div className={cn(
      "glass-panel panel-shadow rounded-2xl p-5 transition-all duration-300",
      "animate-slide-up",
      isActive ? "border-primary/30" : "border-transparent"
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2 text-primary" />
          <h3 className="text-sm font-medium">Full Transcript</h3>
        </div>
        
        <button
          onClick={handleCopy}
          disabled={!transcript}
          className={cn(
            "flex items-center text-xs px-2 py-1 rounded-md transition-colors",
            "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30",
            !transcript && "opacity-50 cursor-not-allowed"
          )}
        >
          <Copy className="h-3.5 w-3.5 mr-1" />
          Copy
        </button>
      </div>
      
      <div 
        ref={containerRef}
        className="h-64 overflow-y-auto pr-2 transcript-text"
      >
        {transcript ? (
          <p className="leading-relaxed whitespace-pre-wrap">{transcript}</p>
        ) : (
          <p className="text-muted-foreground text-sm italic">
            Complete transcript will appear here as the audio plays...
          </p>
        )}
      </div>
    </div>
  );
};

export default TranscriptPanel;
