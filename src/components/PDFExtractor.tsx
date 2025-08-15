import React, { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PDFExtractor = () => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { toast } = useToast();

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): boolean => {
    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file only.');
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select a PDF file only.",
      });
      return false;
    }
    
    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      toast({
        variant: "destructive",
        title: "File too large",
        description: "File size must be less than 10MB.",
      });
      return false;
    }
    
    return true;
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return;

    setIsLoading(true);
    setError('');
    setExtractedText('');
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setExtractedText(data.text || 'No text found in the PDF.');
      setUploadSuccess(true);
      toast({
        title: "Success!",
        description: "PDF text extracted successfully.",
        className: "bg-success text-success-foreground",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract text from PDF.';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Extraction failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            PDF Text Extractor
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload a PDF and get extracted text instantly. Fast, secure, and easy to use.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <div
            className={`
              relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
              ${isDragActive 
                ? 'border-primary bg-upload-zone-active shadow-upload scale-105' 
                : 'border-upload-zone-border bg-upload-zone hover:border-primary hover:shadow-medium'
              }
              ${isLoading ? 'pointer-events-none opacity-75' : 'cursor-pointer'}
            `}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !isLoading && document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading}
            />
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <p className="text-lg font-medium text-primary">Extracting text...</p>
                  <p className="text-sm text-muted-foreground">This may take a moment</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-center">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-medium mb-2">
                      {isDragActive ? 'Drop your PDF here' : 'Drop your PDF here or click to browse'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports PDF files up to 10MB
                    </p>
                  </div>
                  <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors shadow-soft hover:shadow-medium">
                    Choose File
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start space-x-3 animate-fade-in">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-destructive mb-1">Error</h3>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {uploadSuccess && extractedText && (
          <div className="mb-8 p-4 bg-success/10 border border-success/20 rounded-lg flex items-start space-x-3 animate-fade-in">
            <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-success mb-1">Success</h3>
              <p className="text-sm text-success/80">Text extracted successfully!</p>
            </div>
          </div>
        )}

        {/* Extracted Text Display */}
        {extractedText && (
          <div className="animate-fade-in">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Extracted Text</h2>
            </div>
            <div className="bg-text-display border border-border rounded-lg p-6 max-h-96 overflow-y-auto shadow-soft">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-mono">
                {extractedText}
              </pre>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => navigator.clipboard.writeText(extractedText)}
                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2 px-4 rounded-lg transition-colors shadow-soft hover:shadow-medium"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFExtractor;