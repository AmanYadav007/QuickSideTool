import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const PDFUnlocker = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Generate a preview URL for the uploaded file
    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUnlock = async () => {
    if (!file || !password) {
      setMessage('Please upload a PDF and enter a password.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    try {
      const response = await axios.post('https://quick-side-tool.vercel.app/unlock-pdf', formData, {
        responseType: 'blob',
      });

      // Create a download link for the unlocked PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'unlocked.pdf');
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);

      setMessage('PDF unlocked successfully!');
    } catch (error) {
      console.error('Error unlocking PDF:', error);
      setMessage('Failed to unlock PDF. Incorrect password or unsupported file.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute w-96 h-96 -top-48 -right-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute w-96 h-96 -bottom-48 -left-48 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-2 mb-8 bg-white bg-opacity-10 text-white rounded-full hover:bg-opacity-20 transition-all duration-300 backdrop-blur-md border border-white border-opacity-20"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </Link>

          {/* Main Content Container */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-2">PDF Unlocker</h2>
              <p className="text-white text-opacity-90">
                Unlock password-protected PDFs with ease
              </p>
            </div>

            {/* File Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Upload PDF File
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center px-4 py-6 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl border border-white border-opacity-20 cursor-pointer hover:bg-opacity-20 transition-all duration-300">
                  <FileText className="text-white" size={32} />
                  <span className="mt-2 text-sm text-white text-opacity-90">
                    {file ? file.name : 'Choose a file'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Enter PDF Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl border border-white border-opacity-20 text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              />
            </div>

            {/* Unlock Button */}
            <button
              onClick={handleUnlock}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl border border-white border-opacity-20 text-white hover:bg-opacity-20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="ml-2">Unlocking...</span>
                </div>
              ) : (
                'Unlock PDF'
              )}
            </button>

            {/* Message */}
            {message && (
              <p
                className={`mt-4 text-sm text-center ${
                  message.includes('successfully') ? 'text-green-300' : 'text-red-300'
                }`}
              >
                {message}
              </p>
            )}

            {/* PDF Preview */}
            {previewUrl && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-white mb-2">
                  PDF Preview
                </label>
                <iframe
                  src={previewUrl}
                  className="w-full h-64 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl border border-white border-opacity-20"
                  title="PDF Preview"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFUnlocker;