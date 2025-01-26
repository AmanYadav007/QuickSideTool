import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import Confetti from 'react-confetti';

const PDFUnlocker = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState('unlock'); // 'unlock' or 'lock'
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  // Theme settings based on action
  const theme = {
    unlock: {
      gradient: 'from-blue-200 via-green-200 to-teal-200',
      bg: 'bg-white bg-opacity-20',
      text: 'text-gray-800',
      border: 'border-gray-300 border-opacity-20',
      icon: <Unlock size={32} className="text-blue-500" />,
    },
    lock: {
      gradient: 'from-gray-800 via-gray-900 to-black',
      bg: 'bg-gray-800 bg-opacity-20',
      text: 'text-gray-100',
      border: 'border-gray-700 border-opacity-20',
      icon: <Lock size={32} className="text-purple-400" />,
    },
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setMessage('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setFile(file);
      setMessage('');
    } else {
      setMessage('Please upload a valid PDF file.');
    }
  };

  const handleAction = async () => {
    if (!file) {
      setMessage('Please upload a PDF file.');
      return;
    }

    if (!password) {
      setMessage('Please enter a password.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    const backendUrl = 'https://quicksidetoolbackend.onrender.com';

    try {
      const endpoint = action === 'unlock' ? '/unlock-pdf' : '/lock-pdf';
      const response = await fetch(`${backendUrl}/${endpoint}`, {
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
          action === 'unlock' ? 'unlocked.pdf' : 'locked.pdf'
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        setMessage(`PDF ${action === 'unlock' ? 'unlocked' : 'locked'} successfully!`);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 seconds
      } else {
        const error = await response.text();
        setMessage(`Failed to ${action} PDF: ${error}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing PDF:`, error);
      setMessage(`Failed to ${action} PDF. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br ${theme[action].gradient} animate-gradient`}
    >
      {/* Confetti Animation */}
      {showConfetti && <Confetti />}

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            to="/"
            className={`inline-flex items-center px-6 py-2 mb-8 ${theme[action].bg} ${theme[action].text} rounded-full hover:bg-opacity-20 transition-all duration-300 backdrop-blur-md ${theme[action].border} hover:shadow-glow`}
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </Link>

          {/* Main Content Container */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`text-4xl font-bold ${theme[action].text} mb-2`}>
                PDF Tools
              </h2>
              <p className={`${theme[action].text} text-opacity-90`}>
                Secure and manage your PDF files with ease
              </p>
            </div>

            {/* Toggle Button for Lock/Unlock */}
            <div className="flex justify-center mb-8">
              <div
                className={`relative w-64 h-12 ${theme[action].bg} backdrop-blur-md rounded-full ${theme[action].border} p-1`}
              >
                <div
                  className={`absolute top-1 left-1 w-1/2 h-10 ${
                    theme[action === 'unlock' ? 'lock' : 'unlock'].bg
                  } rounded-full transition-all duration-300 ${
                    action === 'unlock' ? 'translate-x-0' : 'translate-x-full'
                  }`}
                />
                <div className="relative flex justify-between items-center h-full px-2">
                  <button
                    onClick={() => setAction('unlock')}
                    className={`z-10 w-1/2 h-full flex items-center justify-center ${theme[action].text} text-opacity-80 transition-all duration-300 ${
                      action === 'unlock' ? 'text-opacity-100 font-semibold' : ''
                    }`}
                  >
                    Unlock
                  </button>
                  <button
                    onClick={() => setAction('lock')}
                    className={`z-10 w-1/2 h-full flex items-center justify-center ${theme[action].text} text-opacity-80 transition-all duration-300 ${
                      action === 'lock' ? 'text-opacity-100 font-semibold' : ''
                    }`}
                  >
                    Lock
                  </button>
                </div>
              </div>
            </div>

            {/* Drag-and-Drop File Upload */}
            <div
              className={`mt-8 ${theme[action].bg} backdrop-blur-md rounded-2xl p-6 border-2 border-dashed ${
                isDragging ? `${theme[action].border} border-opacity-50` : `${theme[action].border} border-opacity-20`
              } transition-all duration-300`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className={`block text-center ${theme[action].text} text-opacity-80 cursor-pointer`}
              >
                {file ? (
                  <div className="flex flex-col items-center">
                    <span className={`${theme[action].text} text-opacity-90`}>
                      {file.name}
                    </span>
                    <span className={`text-sm ${theme[action].text} text-opacity-70`}>
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                ) : (
                  'Drag & drop or click to upload a PDF'
                )}
              </label>
            </div>

            {/* Password Input and Action Button */}
            <div
              className={`mt-8 ${theme[action].bg} backdrop-blur-md rounded-2xl p-6 ${theme[action].border} hover:shadow-glow`}
            >
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full mb-4 p-3 ${theme[action].bg} ${theme[action].text} rounded-lg ${theme[action].border} focus:outline-none focus:border-opacity-40 hover:shadow-glow pr-12`}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-3 p-2 ${theme[action].text} text-opacity-80 hover:text-opacity-100 transition-all duration-300`}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button
                onClick={handleAction}
                disabled={isLoading}
                className={`w-full py-3 ${theme[action].bg} ${theme[action].text} rounded-lg hover:bg-opacity-20 transition-all duration-300 backdrop-blur-md ${theme[action].border} hover:shadow-glow flex items-center justify-center`}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                ) : (
                  action === 'unlock' ? 'Unlock PDF' : 'Lock PDF'
                )}
              </button>
              {message && (
                <p className={`mt-4 text-sm ${theme[action].text} text-opacity-90`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFUnlocker;