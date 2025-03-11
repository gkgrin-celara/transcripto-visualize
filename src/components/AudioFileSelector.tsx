import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileAudio, FolderOpen, Play } from 'lucide-react';
import { toast } from 'sonner';

// Sample audio files for demo purposes
const sampleAudioFiles = [
  { id: '1', name: 'Sample Audio 1', url: 'https://download.samplelib.com/mp3/sample-15s.mp3' },
  { id: '2', name: 'Sample Audio 2', url: 'https://download.samplelib.com/mp3/sample-9s.mp3' },
  { id: '3', name: 'Sample Audio 3', url: 'https://download.samplelib.com/mp3/sample-12s.mp3' },
  { id: '4', name: 'Sample Audio 4', url: 'https://download.samplelib.com/mp3/sample-3s.mp3' },
];

interface AudioFile {
  id: string;
  name: string;
  url: string;
}

interface AudioFileSelectorProps {
  onSelectFile: (file: AudioFile) => void;
}

const AudioFileSelector: React.FC<AudioFileSelectorProps> = ({ onSelectFile }) => {
  const [selectedTab, setSelectedTab] = useState<string>("sample");
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<AudioFile[]>([]);
  
  // Handle file selection from samples
  const handleSelectSampleFile = (fileId: string) => {
    setSelectedFileId(fileId);
  };
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const newFiles: AudioFile[] = [];
    
    Array.from(files).forEach((file) => {
      // Create a URL for the uploaded file
      const url = URL.createObjectURL(file);
      newFiles.push({
        id: `upload-${Date.now()}-${file.name}`,
        name: file.name,
        url: url
      });
    });
    
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    toast.success(`${newFiles.length} file(s) uploaded successfully`);
    
    // Auto-select the first uploaded file if none is selected
    if (selectedTab === "upload" && !selectedFileId && newFiles.length > 0) {
      setSelectedFileId(newFiles[0].id);
    }
    
    // Reset the input
    event.target.value = '';
  };
  
  // Handle play button click
  const handlePlay = () => {
    const files = selectedTab === "sample" ? sampleAudioFiles : uploadedFiles;
    const selectedFile = files.find(file => file.id === selectedFileId);
    
    if (selectedFile) {
      onSelectFile(selectedFile);
    } else {
      toast.error("Please select an audio file first");
    }
  };
  
  // Reset selected file when changing tabs
  useEffect(() => {
    setSelectedFileId("");
  }, [selectedTab]);
  
  return (
    <div className="glass-panel panel-shadow rounded-2xl p-5 w-full animate-scale-in">
      <h2 className="text-xl font-medium mb-4">Select Audio File</h2>
      
      <Tabs defaultValue="sample" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="sample">Sample Files</TabsTrigger>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sample" className="space-y-4">
          <div className="flex items-center space-x-2">
            <FileAudio className="h-5 w-5 text-primary" />
            <Select value={selectedFileId} onValueChange={handleSelectSampleFile}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a sample audio file" />
              </SelectTrigger>
              <SelectContent>
                {sampleAudioFiles.map((file) => (
                  <SelectItem key={file.id} value={file.id}>
                    {file.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <FileAudio className="h-5 w-5 text-primary" />
              <Select value={selectedFileId} onValueChange={setSelectedFileId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an uploaded audio file" />
                </SelectTrigger>
                <SelectContent>
                  {uploadedFiles.map((file) => (
                    <SelectItem key={file.id} value={file.id}>
                      {file.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-center p-4 border-2 border-dashed border-primary/30 rounded-lg">
              <label className="flex flex-col items-center cursor-pointer">
                <FolderOpen className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm text-muted-foreground mb-1">Click to browse files</span>
                <span className="text-xs text-muted-foreground">MP3, WAV, OGG files supported</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="audio/*" 
                  multiple 
                  onChange={handleFileUpload} 
                />
              </label>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handlePlay}
          disabled={!selectedFileId}
          className="flex items-center space-x-2"
        >
          <Play className="h-4 w-4" />
          <span>Play Selected File</span>
        </Button>
      </div>
    </div>
  );
};

export default AudioFileSelector; 