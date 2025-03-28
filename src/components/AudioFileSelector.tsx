import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileAudio, FolderOpen, Play, CloudDownload } from 'lucide-react';
import { toast } from 'sonner';

// Update sample audio files to use local files from public/audios
const sampleAudioFiles = [
  { id: '101', name: 'Audio Sample 101', url: '/audios/101.mp3' },
  { id: '102', name: 'Audio Sample 102', url: '/audios/102.mp3' },
  { id: '104', name: 'Audio Sample 104', url: '/audios/104.mp3' },
];

interface AudioFile {
  id: string;
  name: string;
  url: string;
}

interface RetrievedFile {
  filename: string;
  path: string;
}

interface AudioFileSelectorProps {
  onSelectFile: (file: AudioFile) => void;
}

const AudioFileSelector: React.FC<AudioFileSelectorProps> = ({ onSelectFile }) => {
  const [selectedTab, setSelectedTab] = useState<string>("sample");
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<AudioFile[]>([]);
  const [retrievedFiles, setRetrievedFiles] = useState<AudioFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getApiUrl = () => {
    return localStorage.getItem('audioApiUrl') || 'http://localhost:8080';
  };

  const fetchRetrievedFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${getApiUrl()}/files`);
      if (!response.ok) throw new Error('Failed to fetch files');
      
      const data: RetrievedFile[] = await response.json();
      const audioFiles: AudioFile[] = data.map(file => ({
        id: `retrieved-${file.filename}`,
        name: file.filename,
        url: file.path
      }));
      
      setRetrievedFiles(audioFiles);
      toast.success('Files retrieved successfully');
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to retrieve files');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTab === 'retrieve') {
      fetchRetrievedFiles();
    }
  }, [selectedTab]);

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
    let files: AudioFile[] = [];
    switch (selectedTab) {
      case "sample":
        files = sampleAudioFiles;
        break;
      case "upload":
        files = uploadedFiles;
        break;
      case "retrieve":
        files = retrievedFiles;
        break;
    }

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
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="sample">Sample Files</TabsTrigger>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="retrieve">Retrieve Files</TabsTrigger>
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

        <TabsContent value="retrieve" className="space-y-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <FileAudio className="h-5 w-5 text-primary" />
              <Select value={selectedFileId} onValueChange={setSelectedFileId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a retrieved audio file" />
                </SelectTrigger>
                <SelectContent>
                  {retrievedFiles.map((file) => (
                    <SelectItem key={file.id} value={file.id}>
                      {file.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-center p-4 border-2 border-dashed border-primary/30 rounded-lg">
              <div className="flex flex-col items-center">
                <CloudDownload className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm text-muted-foreground mb-1">
                  {isLoading ? 'Retrieving files...' : 'Files retrieved from API'}
                </span>
                <span className="text-xs text-muted-foreground">
                  Using API: {getApiUrl()}
                </span>
              </div>
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
