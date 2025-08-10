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
  Sparkles,
  FileSpreadsheet,
  FileType,
  Settings,
  Info
} from 'lucide-react';
import Notification from './Notification';

const FileConverter = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [downloadBlob, setDownloadBlob] = useState(null);
  const [conversionType, setConversionType] = useState('pdf-to-word');
  const [useAdobe, setUseAdobe] = useState(true);
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
    
    // Choose endpoint based on conversion type and Adobe preference
    let effectiveUseAdobe = useAdobe;
    if (!effectiveUseAdobe && conversionType === 'pdf-to-excel') {
      // Excel conversion requires Adobe in our backend; auto-upgrade and notify
      effectiveUseAdobe = true;
      handleNotification('Excel conversion uses Adobe automatically for best results.', 'info');
    }
    let endpoint = effectiveUseAdobe
      ? (conversionType === 'pdf-to-word' ? '/adobe/convert/pdf-to-word' : '/adobe/convert/pdf-to-excel')
      : '/convert/pdf-to-word';

    try {
      const processingMessage = useAdobe 
        ? 'Processing with Adobe PDF Services...' 
        : 'Processing with basic converter...';
      setMessage(processingMessage);
      
      let response = await fetch(`${backendUrl}${endpoint}`, {
      method: 'POST',
      body: formData,
    });

      // If Adobe conversion fails, attempt basic fallback (only for PDF->Word which we support)
      if (!response.ok && effectiveUseAdobe && conversionType === 'pdf-to-word') {
        try {
          setMessage('Adobe conversion failed, retrying with basic converter...');
          response = await fetch(`${backendUrl}/convert/pdf-to-word`, {
            method: 'POST',
            body: formData,
          });
        } catch (retryError) {
          // continue to error handling
        }
      }

      if (response.ok) {
    const blob = await response.blob();
        
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = conversionType === 'pdf-to-word' 
          ? file.name.replace(/\.pdf$/, '.docx')
          : file.name.replace(/\.pdf$/, '.xlsx');
          
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }
        
        setDownloadBlob({ blob, filename });
        const successMessage = (effectiveUseAdobe && endpoint.includes('/adobe/'))
          ? `Success: PDF converted to ${conversionType === 'pdf-to-word' ? 'Word' : 'Excel'} using Adobe! Click "Download" to save.`
          : `Success: PDF converted to ${conversionType === 'pdf-to-word' ? 'Word' : 'Excel'}! Click "Download" to save.`;
        setMessage(successMessage);
        handleNotification(`Successfully converted to ${conversionType === 'pdf-to-word' ? 'Word' : 'Excel'}!`, 'success');

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
      id: 'pdf-to-word',
      title: 'PDF to Word',
      description: 'Convert PDF to Word document',
      icon: <FileText className="w-6 h-6" />,
      features: ['Layout Preservation', 'Font Matching', 'Table Conversion', 'Professional Quality'],
      adobeFeatures: ['Perfect Layout', 'Advanced OCR', 'Smart Table Detection', 'Adobe Quality']
    },
    {
      id: 'pdf-to-excel',
      title: 'PDF to Excel',
      description: 'Convert PDF tables to Excel',
      icon: <FileSpreadsheet className="w-6 h-6" />,
      features: ['Table Detection', 'Data Extraction', 'Basic Formatting', 'Standard Quality'],
      adobeFeatures: ['Intelligent Tables', 'Formula Detection', 'Perfect Formatting', 'Adobe Quality']
    }
  ];

  const selectedOption = conversionOptions.find(opt => opt.id === conversionType);

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
              File Converter
          </h1>
            <div className="w-[110px] md:w-[130px] flex-shrink-0"></div>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
          <div className="max-w-5xl w-full">
            {/* Header Section */}
            <div className="text-center mb-8">
              {useAdobe && (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Sparkles className="w-4 h-4" />
                  Powered by Adobe PDF Services
                </div>
              )}
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Professional File Conversion
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Convert your PDFs to Word or Excel with {useAdobe ? 'Adobe\'s industry-leading technology' : 'our reliable converter'}. 
                {useAdobe ? ' Maintain perfect layout, fonts, and formatting.' : ' Get your documents converted quickly and efficiently.'}
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
                    {(useAdobe ? option.adobeFeatures : option.features).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quality Toggle */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Conversion Quality</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/70">Basic</span>
                  <button
                    onClick={() => setUseAdobe(!useAdobe)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      useAdobe ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        useAdobe ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-white/70">Adobe Pro</span>
                </div>
            </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-xl border-2 ${!useAdobe ? 'border-blue-400 bg-blue-400/10' : 'border-white/20 bg-white/5'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <FileType className="w-5 h-5 text-gray-400" />
                    <h4 className="font-semibold text-white">Basic Converter</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• Fast processing</li>
                    <li>• Basic layout preservation</li>
                    <li>• Free to use</li>
                    <li>• Standard quality</li>
                  </ul>
            </div>

                <div className={`p-4 rounded-xl border-2 ${useAdobe ? 'border-orange-400 bg-orange-400/10' : 'border-white/20 bg-white/5'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-orange-400" />
                    <h4 className="font-semibold text-white">Adobe Professional</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• Perfect layout preservation</li>
                    <li>• Advanced OCR technology</li>
                    <li>• Industry-leading quality</li>
                    <li>• Professional results</li>
                  </ul>
                </div>
            </div>
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
                          {useAdobe ? 'Professional' : 'Reliable'}
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
                      {useAdobe ? 'Processing with Adobe...' : 'Converting...'}
              </>
            ) : (
              <>
                      {useAdobe ? <Sparkles className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      {useAdobe ? 'Convert with Adobe' : 'Convert File'}
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

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-green-400" />
                  <h3 className="text-lg font-bold text-white">Secure Processing</h3>
                </div>
                <p className="text-white/80 text-sm">
                  Your files are processed securely with enterprise-grade security and automatic cleanup.
                      </p>
                    </div>
              
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">Fast Conversion</h3>
                  </div>
                <p className="text-white/80 text-sm">
                  {useAdobe ? 'Adobe-powered processing ensures quick and accurate conversions.' : 'Quick processing with reliable results.'}
                </p>
                </div>
              
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-8 h-8 text-yellow-400" />
                  <h3 className="text-lg font-bold text-white">High Quality</h3>
            </div>
                <p className="text-white/80 text-sm">
                  {useAdobe ? 'Industry-leading Adobe technology for perfect results.' : 'Quality conversions with layout preservation.'}
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

export default FileConverter; 
