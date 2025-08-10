import React, { useState, useCallback, useRef, useEffect } from 'react';
import SEO from './SEO';
import { Link } from 'react-router-dom';
import { ArrowLeft, Link as LinkIcon, Upload, Download, FileText, Loader2, X, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { createRoot } from 'react-dom/client';

// --- NEW: OrbitalFlowProcessingOverlay Component ---
const OrbitalFlowProcessingOverlay = ({ status, onCancel, currentStep, totalSteps }) => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center z-50 animate-fade-in overflow-hidden">
    
    {/* Background Orbital/Particle Animation */}
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Central Glowing Orb */}
      <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 animate-pulse-orb flex items-center justify-center shadow-lg transform scale-95">
        <Loader2 className="animate-spin-slow w-24 h-24 text-white opacity-80" /> {/* Larger, slower spinner */}
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-full ring-4 ring-blue-400/50 animate-ping-once"></div>
        <div className="absolute inset-0 rounded-full ring-2 ring-teal-400/50 animate-ping-once animation-delay-500"></div>
      </div>

      {/* Orbiting Particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white opacity-60 animate-orbit"
          style={{
            animationDelay: `${i * 0.1}s`, // Staggered delays
            transformOrigin: '50% 50%',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg) translateY(${60 + Math.random() * 80}px)`, // Random initial position/orbit radius
          }}
        ></div>
      ))}
    </div>

    {/* Content Overlay */}
    <div className="relative z-10 bg-gray-900/80 rounded-3xl p-8 w-full max-w-lg mx-4 shadow-3xl border border-gray-700 overflow-hidden text-center animate-scale-in">
      <h3 className="text-3xl font-extrabold text-white mb-6 animate-fade-in-down">
        Working Our Magic...
      </h3>
      
      {/* Dynamic Status Message */}
      <div className="text-xl font-semibold text-gray-200 mb-8 h-8 animate-fade-in-up">
        {status}
      </div>

      {/* Step Indicators (Simplified Visual) */}
      <div className="flex justify-center space-x-3 mb-8">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                            ${currentStep >= 1 ? 'border-blue-400 bg-blue-500 text-white shadow-lg animate-bounce-step' : 'border-gray-600 text-gray-400 bg-gray-700'}`}>
                {currentStep > 1 ? <CheckCircle size={20} /> : <span className="font-bold">1</span>}
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                            ${currentStep >= 2 ? 'border-teal-400 bg-teal-500 text-white shadow-lg animate-bounce-step animation-delay-100' : 'border-gray-600 text-gray-400 bg-gray-700'}`}>
                {currentStep > 2 ? <CheckCircle size={20} /> : <span className="font-bold">2</span>}
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                            ${currentStep >= 3 ? 'border-green-400 bg-green-500 text-white shadow-lg animate-bounce-step animation-delay-200' : 'border-gray-600 text-gray-400 bg-gray-700'}`}>
                {currentStep > 3 ? <CheckCircle size={20} /> : <span className="font-bold">3</span>}
            </div>
        </div>

      <button 
        className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300 transform hover:scale-105 shadow-lg"
        onClick={onCancel}
      >
        Cancel Process
      </button>
    </div>
  </div>
);

// --- Main PDFLinkRemover Component ---
const PDFLinkRemover = () => {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [downloadBlob, setDownloadBlob] = useState(null);

  const processingOverlayRootRef = useRef(null);
  const processingOverlayCleanupRef = useRef(() => {});

  const createAndShowProcessingOverlay = useCallback(() => {
    const overlayDiv = document.createElement('div');
    document.body.appendChild(overlayDiv);
    processingOverlayRootRef.current = createRoot(overlayDiv);
    processingOverlayCleanupRef.current = () => {
      if (processingOverlayRootRef.current) {
        processingOverlayRootRef.current.unmount();
      }
      if (overlayDiv && document.body.contains(overlayDiv)) {
        document.body.removeChild(overlayDiv);
      }
    };
    return processingOverlayRootRef.current;
  }, []);

  const updateProcessingOverlay = useCallback((status, currentStep, totalSteps) => {
    if (processingOverlayRootRef.current) {
      processingOverlayRootRef.current.render(
        <OrbitalFlowProcessingOverlay // Use the new component name
          status={status}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onCancel={() => {
            setMessage('Process cancelled.');
            setProcessing(false);
            processingOverlayCleanupRef.current();
          }}
        />
      );
    }
  }, []);


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
    disabled: processing
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

  const handleProcessPDF = async () => {
    if (!file) {
      setMessage('Error: Please upload a PDF file first.');
      return;
    }
    
    setProcessing(true);
    setMessage('');
    setDownloadBlob(null); 

    // Use the new overlay component
    const modalRoot = createAndShowProcessingOverlay();
    updateProcessingOverlay('Establishing secure connection...', 1, 3); // Initial message

    const formData = new FormData();
    formData.append('file', file);

    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://quicksidetoolbackend.onrender.com';

    try {
      updateProcessingOverlay('Removing your link...', 1, 3);
      const response = await fetch(`${backendUrl}/remove-pdf-links`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        updateProcessingOverlay('Analyzing PDF structure & locating links...', 2, 3); // Step 2
        const blob = await response.blob();
        
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `links_removed_${file.name.replace(/\.pdf$/, '')}.pdf`;
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1];
            }
        }
        
        setDownloadBlob({ blob, filename });
        updateProcessingOverlay('Rebuilding PDF without links... Almost there!', 3, 3); // Step 3
        setMessage('Success: Links processed! Click "Download" to save your PDF.');

      } else {
        const errorText = await response.text();
        setMessage(`Error: Failed to remove links. Server response: ${errorText || 'Unknown error'}`);
        setDownloadBlob(null);
      }
    } catch (error) {
      console.error('Network or processing error:', error);
      setMessage('Error: Failed to remove links. Check your connection or try again.');
      setDownloadBlob(null);
    } finally {
      setTimeout(() => {
        processingOverlayCleanupRef.current();
        setProcessing(false);
      }, 2000); // Keep modal visible for 2 seconds after final update
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 text-white font-sans antialiased">
      <SEO
        title="Remove Hyperlinks from PDF – Clean PDF Links Online"
        description="Strip all links/hyperlinks from PDF in one click. Privacy‑friendly, free tool."
        url="https://quicksidetool.com/pdf-link-remove"
      />
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-blue-500/20 blur-3xl animate-blob-fade top-1/4 left-[15%] animation-delay-0"></div>
        <div className="absolute w-80 h-80 rounded-full bg-teal-500/20 blur-3xl animate-blob-fade top-[65%] left-[70%] animation-delay-2000"></div>
        <div className="absolute w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl animate-blob-fade top-[10%] left-[60%] animation-delay-4000"></div>
        <div className="absolute w-56 h-56 rounded-full bg-green-500/20 blur-3xl animate-blob-fade top-[80%] left-[20%] animation-delay-6000"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header/Back Button */}
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
              PDF Link Remover
            </h1>
            <div className="w-[110px] md:w-[130px] flex-shrink-0"></div>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
          <div className="max-w-xl w-full bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-center mb-6">
              <LinkIcon size={30} className="text-blue-400 mr-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Remove Links from PDF</h2>
            </div>

            {/* File Upload Section - Now using useDropzone props */}
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
                    <p className="text-white text-opacity-90 font-medium text-lg">{file.name}</p>
                    <p className="text-sm text-white text-opacity-70 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-sm text-white/60 mt-2">Click or drag new PDF to change file</p>
                  </div>
                ) : (
                  <>
                    <Upload size={48} className="text-white/70 mb-4" />
                    <p className="text-white text-opacity-90 text-lg font-semibold">
                      {isDragActive ? 'Drop your PDF here!' : 'Drag & drop your PDF here, or click to upload'}
                    </p>
                    <p className="text-white text-opacity-70 text-sm mt-1">
                      (Only PDF files are supported)
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8">
              <button
                onClick={handleProcessPDF}
                disabled={!file || processing}
                className={`w-full py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processing ? (
                  <> <Loader2 className="animate-spin mr-3 w-5 h-5" /> Processing... </>
                ) : (
                  <> <FileText className="mr-3 w-5 h-5" /> Remove Links </>
                )}
              </button>
            </div>

            {/* Message Display */}
            {message && (
              <p className={`mt-4 text-sm text-center ${message.includes('Error') ? 'text-red-400' : 'text-green-400'} animate-fade-in`}>
                {message}
              </p>
            )}
            
            {/* Download Button (now connected to downloadBlob state) */}
            {downloadBlob && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => triggerDownload(downloadBlob.blob, downloadBlob.filename)}
                        className="py-2.5 px-6 bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto"
                    >
                        <Download className="mr-2 w-4 h-4" /> Download Processed PDF
                    </button>
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PDFLinkRemover;