import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Settings, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import logger from '../utils/logger';

const QRCodeGenerator = () => {
  const [qrValue, setQrValue] = useState('');
  const [qrSize, setQrSize] = useState(256);
  const [qrFgColor, setQrFgColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [downloadFormat, setDownloadFormat] = useState('png');
  const qrRef = useRef(null);

  const generateQRCode = () => {
    // Ensure qrSize is a number and within a reasonable range
    const effectiveSize = Math.max(64, Math.min(1024, Number(qrSize))); 
    return (
      <QRCodeSVG
        value={qrValue || 'https://quicksidetool.online/'}
        size={effectiveSize}
        fgColor={qrFgColor}
        bgColor={qrBgColor}
        level="H"
        includeMargin={true}
      />
    );
  };

  const downloadQRCode = () => {
    if (!qrRef.current) {
        alert('QR Code not ready for download.');
        return;
    }
    const svg = qrRef.current.querySelector('svg');
    if (!svg) {
        alert('QR Code SVG element not found.');
        return;
    }
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    // Use a blob URL for the image source to avoid potential CORS issues if loading external SVGs
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
        canvas.width = qrSize;
        canvas.height = qrSize;
        ctx.drawImage(img, 0, 0, qrSize, qrSize); // Ensure image draws to fill canvas size
        
        let downloadLink;
        let fileName = (qrValue.substring(0, 20) || 'qrcode').replace(/[^a-z0-9]/gi, '_').toLowerCase(); // Sanitize filename
        
        switch(downloadFormat) {
            case 'svg':
                downloadLink = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
                fileName += '.svg';
                break;
            case 'jpg':
                downloadLink = canvas.toDataURL("image/jpeg", 0.9); // Added quality for JPG
                fileName += '.jpg';
                break;
            case 'png':
            default:
                downloadLink = canvas.toDataURL("image/png");
                fileName += '.png';
                break;
        }
        const link = document.createElement('a');
        link.href = downloadLink;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url); // Clean up the blob URL
    };
    img.onerror = () => {
        logger.error("Failed to load SVG for canvas conversion.", null, 'QRCodeGenerator');
        alert("Could not convert QR code to selected format. Please try PNG or SVG directly.");
        URL.revokeObjectURL(url); // Clean up on error too
    };
    img.src = url; // Use the blob URL as image source
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

      <div className="relative z-10 flex flex-col min-h-screen">
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
              QR Code Generator
            </h1>
            {/* Placeholder for potential other header elements */}
            <div className="w-[110px] md:w-[130px] flex-shrink-0"></div> {/* To balance the Back to Dashboard button */}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
          <div className="max-w-xl w-full bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-center mb-6">
              <QrCode size={30} className="text-white mr-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Generate Your QR Code</h2>
            </div>

            {/* Input Section */}
            <div className="mb-6">
              <label htmlFor="qr-input" className="block text-white text-sm font-semibold mb-2">
                Enter text or URL for QR Code:
              </label>
              <input
                id="qr-input"
                type="text"
                value={qrValue}
                onChange={(e) => setQrValue(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm transition-colors"
                placeholder="e.g., https://yourwebsite.com or Your Text Here"
              />
            </div>

            {/* Settings Section */}
            <div className="mb-6 bg-white/10 rounded-xl p-4 shadow-inner border border-white/15">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
                <Settings className="mr-2 w-5 h-5" />
                QR Code Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="qr-size" className="block text-white text-sm font-medium mb-2">
                    Size (px):
                  </label>
                  <input
                    id="qr-size"
                    type="number"
                    value={qrSize}
                    onChange={(e) => setQrSize(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    min="64" // Adjusted min size
                    max="1024" // Adjusted max size
                    step="1"
                  />
                  <span className="text-gray-300 text-xs mt-1">Min: 64, Max: 1024</span>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="qr-fg-color" className="block text-white text-sm font-medium mb-2">
                    Foreground Color:
                  </label>
                  <input
                    id="qr-fg-color"
                    type="color"
                    value={qrFgColor}
                    onChange={(e) => setQrFgColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-none"
                    style={{backgroundColor: qrFgColor}} // Explicitly set bg color for color picker
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="qr-bg-color" className="block text-white text-sm font-medium mb-2">
                    Background Color:
                  </label>
                  <input
                    id="qr-bg-color"
                    type="color"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-none"
                    style={{backgroundColor: qrBgColor}}
                  />
                </div>
              </div>
            </div>

            {/* Generated QR Code & Download */}
            <div className="text-center mb-6">
              <h3 className="text-white text-lg font-semibold mb-4">Your Generated QR Code:</h3>
              <div className="flex justify-center items-center bg-white/20 p-6 rounded-xl backdrop-blur-sm border border-white/15" ref={qrRef}>
                {generateQRCode()}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
                className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm text-sm"
              >
                <option value="png" className='bg-gray-800 text-white'>PNG</option>
                <option value="jpg" className='bg-gray-800 text-white'>JPG</option>
                <option value="svg" className='bg-gray-800 text-white'>SVG</option>
              </select>
              <button
                onClick={downloadQRCode}
                className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white font-semibold py-2.5 px-6 rounded-full text-base transition-all duration-300 shadow-lg hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!qrValue || !qrRef.current}
              >
                <Download className="mr-2 w-4 h-4" />
                Download QR Code
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QRCodeGenerator;