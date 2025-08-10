import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Zap,
  Star,
  Shield,
  Sparkles
} from 'lucide-react';
import Notification from './Notification';

const AdobePDFConverter = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [downloadBlob, setDownloadBlob] = useState(null);
  const [conversionType, setConversionType] = useState('word');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');

  const handleNotification = (message, type = 'info') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setMessage('');
        setDownloadBlob(null);
      } else {
        setFile(null);
        setMessage('Error: Please select a valid PDF file.');
        setDownloadBlob(null);
      }
    } else {
      setFile(null);
      setMessage('');
      setDownloadBlob(null);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    setMessage('');
    setDownloadBlob(null);

    if (acceptedFiles.length === 0) {
      setMessage('Error: No file dropped or invalid file type.');
      setFile(null);
      return;
    }

    const droppedFile = acceptedFiles[0];
    if (droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      setMessage('Error: Only PDF files are accepted. Please drag and drop a .pdf file.');
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
      setMessage('Error: Please upload a PDF file first.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    setDownloadBlob(null);

    const formData = new FormData();
    formData.append('file', file);

    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://quicksidetoolbackend.onrender.com';
    const endpoint = conversionType === 'word' ? '/adobe/convert/pdf-to-word' : '/adobe/convert/pdf-to-excel';

    try {
      setMessage('Processing with Adobe PDF Services...');
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = conversionType === 'word' 
          ? file.name.replace(/\.pdf$/, '.docx')
          : file.name.replace(/\.pdf$/, '.xlsx');
          
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }
        
        setDownloadBlob({ blob, filename });
        setMessage(`Success: PDF converted to ${conversionType === 'word' ? 'Word' : 'Excel'} using Adobe! Click "Download" to save.`);
        handleNotification(`Successfully converted to ${conversionType === 'word' ? 'Word' : 'Excel'} with professional quality!`, 'success');

      } else {
        const errorText = await response.text();
        setMessage(`Error: Conversion failed. ${errorText || 'Please try again.'}`);
        setDownloadBlob(null);
        handleNotification('Conversion failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Network or processing error:', error);
      setMessage('Error: Failed to convert file. Check your connection or try again.');
      setDownloadBlob(null);
      handleNotification('Network error. Please check your connection.', 'error');
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

  const conversionOptions = [
    {
      id: 'word',
      title: 'PDF to Word',
      description: 'Convert PDF to Word with layout preservation',
      icon: <FileText className="w-6 h-6" />,
      features: ['Layout Preservation', 'Font Matching', 'Table Conversion', 'Professional Quality']
    },
    {
      id: 'excel',
      title: 'PDF to Excel',
      description: 'Convert PDF tables to Excel with intelligent detection',
      icon: <FileText className="w-6 h-6" />,
      features: ['Table Detection', 'Data Extraction', 'Formula Preservation', 'Professional Quality']
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 text-white font-sans antialiased">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-blue-500/20 blur-3xl animate-blob-fade top-1/4 left-[15%] animation-delay-0"></div>
        <div className="absolute w-80 h-80 rounded-full bg-teal-500/20 blur-3xl animate-blob-fade top-[65%] left-[70%] animation-delay-2000"></div>
        <div className="absolute w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl animate-blob-fade top-[10%] left-[60%] animation-delay-4000"></div>
        <div className="absolute w-56 h-56 rounded-full bg-green-500/20 blur-3xl animate-blob-fade top-[80%] left-[20%] animation-delay-6000"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="py-4 px-4 md:px-8 border-b border-white border-opacity-10 backdrop-blur-lg shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <Link
              to="/toolkit"
              className="inline-flex items-center px-4 py-1.5 bg-white/10 text-white rounded-full
                         hover:bg-white/20 transition-all duration-300 backdrop-blur-md border border-white/20
                         hover:border-blue-400 transform hover:scale-105 shadow-md animate-fade-in-left text-sm"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl md:text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 drop-shadow-md animate-fade-in-down flex-grow px-4">
              Adobe PDF Converter
            </h1>
            <div className="w-[110px] md:w-[130px] flex-shrink-0"></div>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
          <div className="max-w-4xl w-full">
            {/* Adobe Badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                Powered by Adobe PDF Services
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Professional PDF Conversion
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Convert your PDFs to Word or Excel with Adobe's industry-leading technology. 
                Maintain perfect layout, fonts, and formatting.
              </p>
            </div>

            {/* Conversion Options */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {conversionOptions.map((option) => (
                <div
                  key={option.id}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    conversionType === option.id
                      ? 'border-blue-400 bg-blue-400/10'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                  onClick={() => setConversionType(option.id)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${
                      conversionType === option.id ? 'bg-blue-400/20' : 'bg-white/10'
                    }`}>
                      {option.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{option.title}</h3>
                      <p className="text-white/70 text-sm">{option.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* File Upload */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl mb-8">
              <div className="flex items-center justify-center mb-6">
                <FileText size={30} className="text-blue-400 mr-3" />
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Upload PDF File
                </h3>
              </div>

              <div
                {...getRootProps()}
                className={`mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-dashed
                           ${isDragActive ? 'border-teal-400 bg-teal-400/10' : 'border-white/30'}
                           transition-all duration-300 cursor-pointer hover:border-blue-400 hover:bg-blue-400/10`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center py-4">
                  {file ? (
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <p className="text-white font-semibold">{file.name}</p>
                      <p className="text-white/70 text-sm">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <p className="text-white font-semibold mb-2">
                        {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
                      </p>
                      <p className="text-white/70 text-sm mb-4">
                        or click to browse files
                      </p>
                      <div className="flex items-center gap-4 text-xs text-white/60">
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Secure
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Fast
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Professional
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Display */}
              {message && (
                <div className={`mt-4 p-4 rounded-lg ${
                  message.includes('Success') 
                    ? 'bg-green-500/20 border border-green-400/30' 
                    : 'bg-red-500/20 border border-red-400/30'
                }`}>
                  <p className="text-white">{message}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={handleConversion}
                  disabled={!file || isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600
                           text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg
                           flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing with Adobe...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Convert with Adobe
                    </>
                  )}
                </button>

                {downloadBlob && (
                  <button
                    onClick={() => triggerDownload(downloadBlob.blob, downloadBlob.filename)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600
                             text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300
                             transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Result
                  </button>
                )}

                <button
                  onClick={handleClearForm}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl
                           transition-all duration-300 border border-white/20 hover:border-white/40"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Adobe Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-green-400" />
                  <h3 className="text-lg font-bold text-white">Secure Processing</h3>
                </div>
                <p className="text-white/80 text-sm">
                  Your files are processed securely on Adobe's servers with enterprise-grade security.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">Professional Quality</h3>
                </div>
                <p className="text-white/80 text-sm">
                  Industry-leading Adobe technology ensures perfect layout preservation and formatting.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-8 h-8 text-yellow-400" />
                  <h3 className="text-lg font-bold text-white">Advanced OCR</h3>
                </div>
                <p className="text-white/80 text-sm">
                  Intelligent text recognition and table detection for scanned documents.
                </p>
              </div>
            </div>
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

export default AdobePDFConverter;
