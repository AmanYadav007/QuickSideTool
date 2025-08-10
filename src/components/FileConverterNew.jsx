import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Loader2, 
  ArrowLeft,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import Notification from './Notification';

const FileConverterNew = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [downloadBlob, setDownloadBlob] = useState(null);
  const [conversionType, setConversionType] = useState('pdf-to-word');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');

  const handleNotification = (message, type = 'info') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const onDrop = useCallback((acceptedFiles) => {
    setMessage('');
    setDownloadBlob(null);

    if (acceptedFiles.length === 0) {
      handleNotification('Invalid file type. Please upload a PDF.', 'error');
      setFile(null);
      return;
    }

    const droppedFile = acceptedFiles[0];
    if (droppedFile.name.toLowerCase().endsWith('.pdf')) {
      setFile(droppedFile);
    } else {
      handleNotification('Only PDF files are accepted.', 'error');
      setFile(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: isLoading
  });

  const triggerDownload = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleConversion = async () => {
    if (!file) {
      handleNotification('Please upload a PDF file first.', 'error');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    setDownloadBlob(null);

    const formData = new FormData();
    formData.append('file', file);
    
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    
    const endpoint = conversionType === 'pdf-to-word' 
      ? '/adobe/convert/pdf-to-word' 
      : '/adobe/convert/pdf-to-excel';

    try {
      setMessage('Processing your file...');
      
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = conversionType === 'pdf-to-word' 
          ? file.name.replace(/\.pdf$/i, '.docx')
          : file.name.replace(/\.pdf$/i, '.xlsx');
          
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }
        
        setDownloadBlob({ blob, filename });
        const successMessage = `Success! Your file is ready. Click "Download" to save.`;
        setMessage(successMessage);
        handleNotification('File converted successfully!', 'success');

      } else {
        const errorData = await response.json();
        const errorMessage = errorData.detail || 'Conversion failed. Please try again.';
        setMessage(`Error: ${errorMessage}`);
        setDownloadBlob(null);
        handleNotification(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Network or processing error:', error);
      const errorMessage = 'Failed to convert file. Check your connection or the server status.';
      setMessage(`Error: ${errorMessage}`);
      setDownloadBlob(null);
      handleNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    setFile(null);
    setMessage('');
    setDownloadBlob(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white font-sans antialiased">
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="py-4 px-4 md:px-8 border-b border-white/10">
          <div className="container mx-auto flex justify-between items-center">
            <Link
              to="/toolkit"
              className="inline-flex items-center px-3 py-1.5 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors duration-300 text-sm"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
              File Converter
            </h1>
            <div className="w-[70px]"></div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="max-w-lg w-full bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl space-y-6">
            
            {/* 1. Upload File */}
            <div>
              <label className="block text-lg font-semibold mb-2">1. Upload File</label>
              <div
                {...getRootProps()}
                className={`mt-2 bg-white/10 rounded-xl p-6 border-2 border-dashed ${isDragActive ? 'border-teal-400' : 'border-white/30'} transition-colors duration-300 cursor-pointer text-center`}
              >
                <input {...getInputProps()} />
                <FileText className="w-10 h-10 text-blue-400 mx-auto mb-2" />
                {file ? (
                  <div>
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-xs text-white/70">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <p>{isDragActive ? 'Drop the PDF here...' : 'Drag & drop a PDF, or click to select'}</p>
                )}
              </div>
            </div>

            {/* 2. Select Conversion */}
            <div>
              <label htmlFor="conversionType" className="block text-lg font-semibold mb-2">2. Convert To</label>
              <select
                id="conversionType"
                value={conversionType}
                onChange={(e) => setConversionType(e.target.value)}
                disabled={isLoading}
                className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 transition-colors duration-300 focus:border-blue-400 focus:ring-0"
              >
                <option value="pdf-to-word">PDF to Word (.docx)</option>
                <option value="pdf-to-excel">PDF to Excel (.xlsx)</option>
              </select>
            </div>

            {/* 3. Convert Button */}
            <div className="pt-4">
              <button
                onClick={handleConversion}
                disabled={!file || isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Converting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Convert File</span>
                  </>
                )}
              </button>
            </div>

            {/* Result Area */}
            {message && (
              <div className={`mt-4 text-center p-3 rounded-lg ${message.includes('Error') ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                <p>{message}</p>
              </div>
            )}

            {downloadBlob && (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => triggerDownload(downloadBlob.blob, downloadBlob.filename)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Converted File
                </button>
                <button
                  onClick={handleClearForm}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Notification */}
      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default FileConverterNew;
