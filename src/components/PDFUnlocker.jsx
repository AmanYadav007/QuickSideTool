import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Unlock, Eye, EyeOff, Loader2, Upload, X } from 'lucide-react';
import Confetti from 'react-confetti';

const PDFUnlocker = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState('unlock'); // 'unlock' or 'lock'
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isInvalidDrag, setIsInvalidDrag] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Theme settings based on action - Adjusted for softer color palette
  const theme = {
    unlock: {
      gradient: 'from-blue-800 via-indigo-900 to-purple-900', // Deep, calming blue/indigo/purple
      bgClass: 'bg-blue-800/10', // Softer translucent background
      textClass: 'text-white',
      borderColor: 'border-blue-700/30', // Harmonizing border color
      iconColor: 'text-blue-400',
      activeSliderBg: 'bg-gradient-to-r from-blue-500 to-indigo-500' // Blue-indigo for active slider
    },
    lock: {
      gradient: 'from-gray-900 via-gray-950 to-black', // Deeper, consistent dark for lock
      bgClass: 'bg-gray-800/10',
      textClass: 'text-gray-200',
      borderColor: 'border-gray-700/30',
      iconColor: 'text-gray-400',
      activeSliderBg: 'bg-gradient-to-r from-gray-700 to-gray-800'
    },
  }[action];

  const currentTheme = theme;

  // Clear message when action changes
  useEffect(() => {
    setMessage('');
  }, [action]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setMessage('Error: Please upload a valid PDF file (.pdf).');
        setFile(null);
      } else {
        setFile(selectedFile);
        setMessage('');
      }
    } else {
      setFile(null);
      setMessage('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const items = e.dataTransfer.items;
    if (items && items.length > 0 && items[0].type === 'application/pdf') {
      setIsInvalidDrag(false);
    } else {
      setIsInvalidDrag(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
    setIsInvalidDrag(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setIsInvalidDrag(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setMessage('');
    } else {
      setMessage('Error: Only PDF files are accepted. Please drag and drop a .pdf file.');
      setFile(null);
    }
  };

  const handleAction = async () => {
    if (!file) {
      setMessage('Error: Please upload a PDF file first.');
      return;
    }

    if (!password) {
      setMessage('Error: Please enter a password.');
      return;
    }

    setIsLoading(true);
    setMessage(''); // Clear previous messages

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    // Using environment variable for backend URL
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://quicksidetoolbackend.onrender.com';

    try {
      const endpoint = action === 'unlock' ? '/unlock-pdf' : '/lock-pdf';
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          action === 'unlock' ? `unlocked_${file.name.replace(/\.pdf$/, '')}.pdf` : `locked_${file.name.replace(/\.pdf$/, '')}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        setMessage(`Success: PDF ${action === 'unlock' ? 'unlocked' : 'locked'} successfully! File downloaded.`);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        const errorData = await response.json(); // Expecting JSON response for errors
        let specificMessage = `Failed to ${action} PDF.`;

        if (errorData && errorData.error) { // Check if error key exists in JSON
          if (errorData.error.includes('Incorrect password') && action === 'unlock') {
            specificMessage = 'Error: Incorrect password for this PDF.';
          } else if (errorData.error.includes('already encrypted') && action === 'lock') {
            specificMessage = 'Error: PDF is already locked with this password.';
          } else if (errorData.error.includes('not encrypted') && action === 'unlock') {
            specificMessage = 'Error: This PDF is not encrypted.';
          } else {
            specificMessage = `Error: ${errorData.error}`; // Display generic error from backend
          }
        } else {
          specificMessage += ` Status: ${response.status}`; // Fallback if no specific error message from backend
        }
        setMessage(specificMessage);
      }
    } catch (error) {
      console.error(`Error ${action}ing PDF:`, error);
      setMessage(`Error: Failed to ${action} PDF. Please check your internet connection or try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    setFile(null);
    setPassword('');
    setMessage('');
    setShowConfetti(false);
    setIsDragging(false);
    setIsInvalidDrag(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br ${currentTheme.gradient} animate-gradient-shift`}
    >
      {showConfetti && <Confetti tweenDuration={1000} recycle={false} numberOfPieces={500} />}

      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-blue-500/20 blur-3xl animate-blob-fade top-1/4 left-[15%] animation-delay-0"></div>
        <div className="absolute w-80 h-80 rounded-full bg-teal-500/20 blur-3xl animate-blob-fade top-[65%] left-[70%] animation-delay-2000"></div>
        <div className="absolute w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl animate-blob-fade top-[10%] left-[60%] animation-delay-4000"></div>
        <div className="absolute w-56 h-56 rounded-full bg-green-500/20 blur-3xl animate-blob-fade top-[80%] left-[20%] animation-delay-6000"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
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
              PDF Unlocker & Locker
            </h1>
            <div className="w-[110px] md:w-[130px] flex-shrink-0"></div>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
          <div className="max-w-xl w-full bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-center mb-6">
              {action === 'unlock' ? (
                <Unlock size={30} className={`mr-3 ${currentTheme.iconColor}`} />
              ) : (
                <Lock size={30} className={`mr-3 ${currentTheme.iconColor}`} />
              )}
              <h2 className={`text-2xl md:text-3xl font-bold ${currentTheme.textClass}`}>
                {action === 'unlock' ? 'Unlock Your PDF' : 'Lock Your PDF'}
              </h2>
            </div>

            <div className="flex justify-center mb-8 animate-fade-in-up animation-delay-300">
              <div
                className={`relative w-64 h-12 ${currentTheme.bgClass} backdrop-blur-md rounded-full border ${currentTheme.borderColor} p-1`}
              >
                <div
                  className={`absolute top-1 left-1 w-1/2 h-10 rounded-full transition-all duration-300 ${
                    action === 'unlock' ? 'translate-x-0 bg-gradient-to-r from-blue-500 to-cyan-500 shadow-md' : 'translate-x-full bg-gradient-to-r from-gray-700 to-gray-800 shadow-md'
                  }`}
                />
                <div className="relative flex justify-between items-center h-full px-2">
                  <button
                    onClick={() => setAction('unlock')}
                    className={`z-10 w-1/2 h-full flex items-center justify-center transition-all duration-300 text-base font-semibold
                      ${action === 'unlock' ? 'text-white' : 'text-gray-300 hover:text-white/80'}
                    `}
                  >
                    Unlock
                  </button>
                  <button
                    onClick={() => setAction('lock')}
                    className={`z-10 w-1/2 h-full flex items-center justify-center transition-all duration-300 text-base font-semibold
                      ${action === 'lock' ? 'text-white' : 'text-gray-300 hover:text-white/80'}
                    `}
                  >
                    Lock
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`mt-6 ${currentTheme.bgClass} backdrop-blur-md rounded-2xl p-8 border-2 border-dashed ${
                isDragging
                  ? (isInvalidDrag ? 'border-red-500 ring-2 ring-red-500' : 'border-teal-400')
                  : 'border-white/30'
              } transition-all duration-300 cursor-pointer animate-fade-in-up animation-delay-500`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
                disabled={isLoading}
              />
              <div className="flex flex-col items-center justify-center py-4">
                {file ? (
                  <div className="text-center">
                    <p className={`text-white text-opacity-90 font-medium text-lg`}>
                      {file.name}
                    </p>
                    <p className={`text-sm text-white text-opacity-70 mt-1`}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-sm text-white/60 mt-2">Click to change file</p>
                  </div>
                ) : (
                  <>
                    <Upload size={48} className="text-white/70 mb-4" />
                    <p className={`text-white text-opacity-90 text-lg font-semibold`}>
                      Drag & drop your PDF here, or click to upload
                    </p>
                    <p className="text-white text-opacity-70 text-sm mt-1">
                      (Only PDF files are supported)
                    </p>
                  </>
                )}
                {isDragging && isInvalidDrag && (
                  <p className="text-red-400 text-sm mt-2 font-semibold animate-pulse">
                    🚫 Only PDF files are allowed!
                  </p>
                )}
              </div>
            </div>

            <div
              className={`mt-8 ${currentTheme.bgClass} backdrop-blur-md rounded-2xl p-6 border ${currentTheme.borderColor} shadow-lg animate-fade-in-up animation-delay-700`}
            >
              <div className="relative mb-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={action === 'unlock' ? "Enter password to unlock" : "Enter new password to lock"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // MODIFIED CLASSNAMES FOR VISIBILITY
                  className={`w-full p-3 bg-white/10 text-white rounded-lg border ${currentTheme.borderColor} focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12 placeholder-white/50 transition-all duration-200`}
                  disabled={isLoading}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white text-opacity-80 hover:text-opacity-100 transition-all duration-300`}
                  title={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button
                onClick={handleAction}
                disabled={isLoading || !file || !password}
                className={`w-full py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-3 w-5 h-5" /> Processing...
                  </>
                ) : (
                  action === 'unlock' ? 'Unlock PDF' : 'Lock PDF'
                )}
              </button>
              {message && (
                <p className={`mt-4 text-sm text-center ${message.includes('Success') ? 'text-green-400' : 'text-red-400'} animate-fade-in`}>
                  {message}
                </p>
              )}
              {(message.includes('Success') || message.includes('Error')) && (
                <button
                  onClick={handleClearForm}
                  className="mt-6 w-full py-2 bg-gray-700/80 text-white rounded-lg hover:bg-gray-800/80 transition-colors flex items-center justify-center text-sm shadow-md"
                >
                  <X className="mr-2 w-4 h-4" /> Clear Form / Do Another
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PDFUnlocker;