
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlayPause: (isPlaying: boolean) => void;
  onReset: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  audioUrl, 
  isPlaying, 
  onPlayPause, 
  onReset 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Audio play error:", error);
          onPlayPause(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, onPlayPause]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    onPlayPause(!isPlaying);
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      onReset();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCurrentTime(value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
  };

  // Audio visualization bars
  const generateVisualizer = () => {
    return (
      <div className="wave-container">
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "wave-bar", 
              isPlaying ? `animate-wave-${i + 1}` : "h-1",
              "transition-all duration-200"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="glass-panel panel-shadow rounded-2xl p-5 w-full animate-scale-in">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => onPlayPause(false)}
      />
      
      <div className="mb-4 flex items-center space-x-3">
        <button
          className="control-button"
          onClick={handleReset}
          aria-label="Reset"
        >
          <SkipBack className="h-5 w-5" />
        </button>
        
        <button
          className={cn(
            "control-button",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          onClick={handlePlayPause}
          disabled={isLoading}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </button>
        
        {generateVisualizer()}

        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 accent-primary"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleProgressChange}
          className="w-full accent-primary"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
