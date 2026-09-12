import React, { useState, useEffect } from 'react';
import SEO from './SEO';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Unlock, Eye, EyeOff, Loader2, Upload, X } from 'lucide-react';
import Confetti from 'react-confetti';

const PDFUnlocker = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState('unlock');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isInvalidDrag, setIsInvalidDrag] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setMessage('');
    setConfirmPassword('');
  }, [action]);

  useEffect(() => {
    if (typeof caches !== 'undefined') {
      caches.delete('pdf-lock-cache-v1').catch(() => {});
    }
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://quicksidetoolbackend.onrender.com';
    fetch(backendUrl + '/', { method: 'GET', mode: 'cors' }).catch(() => {});
    const interval = setInterval(() => {
      fetch(backendUrl + '/', { method: 'GET', mode: 'cors' }).catch(() => {});
    }, 5 * 60 * 1000);
    return () => { clearInterval(interval); };
  }, []);

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

    if (action === 'lock' && password !== confirmPassword) {
      setMessage('Error: Passwords do not match. Re-enter to confirm.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://quicksidetoolbackend.onrender.com';

    try {
      const endpoint = action === 'unlock' ? '/unlock-pdf' : '/lock-pdf';

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60 * 1000);
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeout);

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
        const errorData = await response.json();
        let specificMessage = `Failed to ${action} PDF.`;

        if (errorData && errorData.error) {
          if (errorData.error.includes('Incorrect password') && action === 'unlock') {
            specificMessage = 'Error: Incorrect password for this PDF.';
          } else if (errorData.error.includes('already encrypted') && action === 'lock') {
            specificMessage = 'Error: PDF is already locked with this password.';
          } else if (errorData.error.includes('not encrypted') && action === 'unlock') {
            specificMessage = 'Error: This PDF is not encrypted.';
          } else {
            specificMessage = `Error: ${errorData.error}`;
          }
        } else {
          specificMessage += ` Status: ${response.status}`;
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
    setConfirmPassword('');
    setMessage('');
    setShowConfetti(false);
    setIsDragging(false);
    setIsInvalidDrag(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SEO
        title="Remove PDF Password Online – Unlock Protected PDF"
        description="Remove password from a PDF you own. Files are processed over an encrypted connection and deleted right after processing."
        url="https://quicksidetool.com/unlock-pdf"
      />
      {showConfetti && <Confetti tweenDuration={1000} recycle={false} numberOfPieces={500} />}

      <div className="container section">
        <header className="mb-8 flex items-center justify-between">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Tools
          </Link>
          <h1 className="h1 text-center">PDF Unlocker & Locker</h1>
        </header>

        <div className="max-w-xl mx-auto">
          <div className="card p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-14 h-14 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center mb-3">
                {action === 'unlock' ? <Unlock className="h-7 w-7 text-[var(--color-primary)]" /> : <Lock className="h-7 w-7 text-[var(--color-primary)]" />}
              </div>
              <h2 className="h2">{action === 'unlock' ? 'Unlock Your PDF' : 'Lock Your PDF'}</h2>
            </div>

            <div className="mb-8">
              <div className="inline-flex rounded-full bg-[var(--color-bg-alt)] p-1">
                <button
                  onClick={() => setAction('unlock')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${action === 'unlock' ? 'bg-[var(--color-primary)] text-white shadow' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-alt)]'}`}
                >
                  Unlock
                </button>
                <button
                  onClick={() => setAction('lock')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${action === 'lock' ? 'bg-[var(--color-primary)] text-white shadow' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-alt)]'}`}
                >
                  Lock
                </button>
              </div>
            </div>

            <div className="upload-zone p-8 text-center mb-8 cursor-pointer transition-colors border-2 border-dashed rounded-3xl" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => document.getElementById('file-input').click()}>
              <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="file-input" disabled={isLoading} />
              <div className="flex flex-col items-center justify-center py-4">
                {file ? (
                  <div className="text-center">
                    <p className="font-medium text-[var(--color-text)] text-lg">{file.name}</p>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p className="text-sm text-[var(--color-text-light)] mt-2">Click to change file</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-[var(--color-primary)] mx-auto mb-4" />
                    <p className="font-semibold text-[var(--color-text)] text-lg mb-1">Drag & drop your PDF here, or click to upload</p>
                    <p className="text-sm text-[var(--color-text-muted)]">(Only PDF files are supported)</p>
                  </>
                )}
                {isDragging && isInvalidDrag && (
                  <p className="text-red-500 text-sm mt-2 font-semibold">Only PDF files are allowed!</p>
                )}
              </div>
            </div>

            <form className="card p-6" onSubmit={(e) => { e.preventDefault(); if (!isLoading) { handleAction(); } }}>
              <div className="relative mb-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={action === 'unlock' ? "Enter password to unlock" : "Enter new password to lock"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-12"
                  disabled={isLoading}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--color-text-light)] hover:text-[var(--color-text-muted)] transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {action === 'lock' && (
                <div className="relative mb-4">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input"
                    disabled={isLoading}
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading || !file || !password || (action === 'lock' && !confirmPassword)}
                className="btn-primary w-full"
              >
                {isLoading ? (
                  <> <Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing... </>
                ) : (
                  action === 'unlock' ? 'Unlock PDF' : 'Lock PDF'
                )}
              </button>
              {message && (
                <p className={`mt-4 text-sm text-center ${message.includes('Success') ? 'text-green-500' : 'text-red-500'}`}>
                  {message}
                </p>
              )}
              {(message.includes('Success') || message.includes('Error')) && (
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="mt-6 w-full btn-secondary"
                >
                  <X className="h-4 w-4 mr-2" /> Clear Form / Do Another
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFUnlocker;