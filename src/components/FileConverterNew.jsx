import React, { useState, useCallback } from 'react';
import SEO from './SEO';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Loader2, 
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Upload,
  CheckCircle,
  XCircle
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
    
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://quicksidetoolbackend.onrender.com';
    
    const preferAdobe = ((process.env.REACT_APP_USE_ADOBE || 'false') + '').toLowerCase() === 'true';
    const endpoint = preferAdobe
      ? (conversionType === 'pdf-to-word' ? '/adobe/convert/pdf-to-word' : '/adobe/convert/pdf-to-excel')
      : (conversionType === 'pdf-to-word' ? '/convert/pdf-to-word' : '/convert/pdf-to-excel');

    try {
      setMessage('Processing your file...');
      
      let response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      // If Adobe was tried and failed, retry with basic converter for Word and Excel
      if (!response.ok && preferAdobe) {
        try {
          setMessage('Adobe conversion failed, retrying with basic converter...');
          const basicEndpoint = conversionType === 'pdf-to-excel' ? '/convert/pdf-to-excel' : '/convert/pdf-to-word';
          response = await fetch(`${backendUrl}${basicEndpoint}`, {
            method: 'POST',
            body: formData,
          });
        } catch (retryErr) {
          // proceed to error handling below
        }
      }

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
        let errorMessage = 'Conversion failed. Please try again.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch {}
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
      <SEO
        title="Free Online File Converter – PDF, DOCX, JPG, PNG"
        description="Convert files between popular formats in your browser. Fast, private, no sign‑up."
        url="https://quicksidetool.com/file-converter"
      />
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
          <div className="max-w-lg w-full bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl space-y-6 hover:shadow-3xl hover:border-white/20 transition-all duration-500 animate-fade-in-up group">
            
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">File Converter</h2>
              <p className="text-gray-400 text-sm">Convert your PDFs to Word or Excel with ease</p>
            </div>

            {/* 1. Upload File */}
            <div>
              <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
                <Upload className="w-5 h-5 text-green-400" />
                1. Upload File
              </label>
              <div
                {...getRootProps()}
                className={`mt-2 bg-white/10 rounded-xl p-6 border-2 border-dashed transition-all duration-300 cursor-pointer text-center group ${
                  isDragActive 
                    ? 'border-teal-400 bg-teal-400/10 scale-[1.02] shadow-lg' 
                    : 'border-white/30 hover:border-blue-400 hover:bg-blue-400/10 hover:scale-[1.01]'
                } ${file ? 'border-green-400 bg-green-400/10' : ''}`}
              >
                <input {...getInputProps()} />
                <div className={`mx-auto mb-3 transition-all duration-300 ${file ? 'scale-110' : ''}`}>
                  {file ? (
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  ) : (
                    <FileText className="w-12 h-12 text-blue-400 group-hover:text-blue-300" />
                  )}
                </div>
                {file ? (
                  <div className="space-y-2">
                    <p className="font-semibold text-lg text-white">{file.name}</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-white/70">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Ready to convert
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-white">
                      {isDragActive ? 'Drop the PDF here!' : 'Drag & drop a PDF, or click to select'}
                    </p>
                    <p className="text-sm text-white/60">
                      Supports PDF files up to 50MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Select Conversion */}
            <div>
              <label htmlFor="conversionType" className="block text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                2. Convert To
              </label>
              <div className="relative">
                <select
                  id="conversionType"
                  value={conversionType}
                  onChange={(e) => setConversionType(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3.5 transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none appearance-none cursor-pointer hover:border-white/50 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                >
                  <option value="pdf-to-word" className="bg-gray-800 text-white">📄 PDF to Word (.docx)</option>
                  <option value="pdf-to-excel" className="bg-gray-800 text-white">📊 PDF to Excel (.xlsx)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {conversionType === 'pdf-to-word' 
                  ? 'Convert PDF to editable Word document with preserved formatting'
                  : 'Extract tables and text from PDF into organized Excel spreadsheet'
                }
              </p>
            </div>

            {/* 3. Convert Button */}
            <div className="pt-4">
              <button
                onClick={handleConversion}
                disabled={!file || isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                    <span className="relative z-10">Converting...</span>
                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full overflow-hidden w-full">
                      <div className="h-full bg-white/60 rounded-full animate-pulse"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Convert File</span>
                  </>
                )}
              </button>
              
              {/* File size info */}
              {file && (
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-400">
                    File size: <span className="text-white/70">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    {conversionType === 'pdf-to-word' && (
                      <span className="ml-2">• Estimated time: <span className="text-white/70">10-30 seconds</span></span>
                    )}
                    {conversionType === 'pdf-to-excel' && (
                      <span className="ml-2">• Estimated time: <span className="text-white/70">15-45 seconds</span></span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Result Area */}
            {message && (
              <div className={`mt-6 p-4 rounded-xl border-2 transition-all duration-300 ${
                message.includes('Error') 
                  ? 'bg-red-500/10 border-red-500/30 text-red-200' 
                  : 'bg-green-500/10 border-green-500/30 text-green-200'
              }`}>
                <div className="flex items-center gap-3">
                  {message.includes('Error') ? (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  )}
                  <p className="font-medium">{message}</p>
                </div>
              </div>
            )}

            {downloadBlob && (
              <div className="mt-6 space-y-4">
                <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <h3 className="text-lg font-semibold text-green-200">Conversion Complete!</h3>
                  </div>
                  <p className="text-green-200/80 text-sm">
                    Your file has been successfully converted and is ready for download.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => triggerDownload(downloadBlob.blob, downloadBlob.filename)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Download className="w-5 h-5" />
                    Download Converted File
                  </button>
                  <button
                    onClick={handleClearForm}
                    className="sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Convert Another
                  </button>
                </div>
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
