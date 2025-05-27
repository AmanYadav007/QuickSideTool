import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Link as LinkIcon, Upload, Download, FileText, Loader2 } from 'lucide-react';

const PDFLinkRemover = () => {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [downloadBlob, setDownloadBlob] = useState(null); // State to store the Blob for download

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setMessage('');
        setDownloadBlob(null); // Clear any previous download
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

  // Function to trigger download from a blob
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
    setMessage('Processing PDF... This may take a moment.');
    setProcessing(true);
    setDownloadBlob(null); 
    const formData = new FormData();
    formData.append('file', file);

    // Ensure this URL matches your backend's Flask app address and port
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://quicksidetoolbackend.onrender.com';

    try {
      const response = await fetch(`${backendUrl}/remove-pdf-links`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        // Extract filename from response headers if available, otherwise use a default
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `links_removed_${file.name.replace(/\.pdf$/, '')}.pdf`;
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1];
            }
        }
        
        // Store the blob and filename in state for the download button
        setDownloadBlob({ blob, filename });
        setMessage('Success: Links processed! Click "Download" to save your PDF.');

      } else {
        const errorText = await response.text();
        setMessage(`Error: Failed to remove links. Server response: ${errorText || 'Unknown error'}`);
        setDownloadBlob(null); // Clear blob on error
      }
    } catch (error) {
      console.error('Network or processing error:', error);
      setMessage('Error: Failed to remove links. Check your connection or try again.');
      setDownloadBlob(null);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 text-white font-sans antialiased">
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
              to="/"
              className="inline-flex items-center px-4 py-1.5 bg-white/10 text-white rounded-full
                         hover:bg-white/20 transition-all duration-300 backdrop-blur-md border border-white/20
                         hover:border-blue-400 transform hover:scale-105 shadow-md animate-fade-in-left text-sm"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Home
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

            {/* File Upload Section */}
            <div
              className={`mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-dashed border-white/30
                         transition-all duration-300 cursor-pointer hover:border-blue-400 hover:bg-blue-400/10`}
              onClick={() => document.getElementById('pdf-file-input').click()}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-file-input"
                disabled={processing}
              />
              <div className="flex flex-col items-center justify-center py-4">
                {file ? (
                  <div className="text-center">
                    <p className="text-white text-opacity-90 font-medium text-lg">{file.name}</p>
                    <p className="text-sm text-white text-opacity-70 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-sm text-white/60 mt-2">Click to change file</p>
                  </div>
                ) : (
                  <>
                    <Upload size={48} className="text-white/70 mb-4" />
                    <p className="text-white text-opacity-90 text-lg font-semibold">
                      Drag & drop your PDF here, or click to upload
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