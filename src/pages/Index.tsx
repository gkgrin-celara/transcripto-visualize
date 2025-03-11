
import React from 'react';
import AudioTranscription from '@/components/AudioTranscription';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AudioTranscription />
      </div>
    </div>
  );
};

export default Index;
