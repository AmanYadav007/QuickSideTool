import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Settings, Link as LinkIcon, Palette, Image as ImageIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeGenerator = () => {
  const [qrValue, setQrValue] = useState('');
  const [qrSize, setQrSize] = useState(256);
  const [qrFgColor, setQrFgColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [downloadFormat, setDownloadFormat] = useState('png');
  const qrRef = useRef(null);

  // Keep existing function implementations
  const generateQRCode = () => {
    return (
      <QRCodeSVG
        value={qrValue || 'https://aguider.in/'}
        size={qrSize}
        fgColor={qrFgColor}
        bgColor={qrBgColor}
        level="H"
        includeMargin={true}
      />
    );
  };

  const downloadQRCode = () => {
    // Keep existing download implementation
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
      <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-2 mb-8 bg-white bg-opacity-10 text-white rounded-full hover:bg-opacity-20 transition-all duration-300 backdrop-blur-md border border-white border-opacity-20"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </Link>

        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20 shadow-xl">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">QR Code Generator</h1>
            
            {/* Input Section */}
            <div className="mb-8">
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-20">
                <label htmlFor="qr-input" className="block text-white text-lg font-semibold mb-4 flex items-center">
                  <LinkIcon className="mr-2" size={20} />
                  Enter URL or Text
                </label>
                <input
                  id="qr-input"
                  type="text"
                  value={qrValue}
                  onChange={(e) => setQrValue(e.target.value)}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 text-white border border-white border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white placeholder-opacity-50 backdrop-blur-md"
                  placeholder="Enter text or URL"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Settings Section */}
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-20">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Settings className="mr-2" size={20} />
                  Customize QR Code
                </h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="qr-size" className="block text-white text-sm font-medium mb-2">
                      Size (px)
                    </label>
                    <input
                      id="qr-size"
                      type="range"
                      value={qrSize}
                      onChange={(e) => setQrSize(Number(e.target.value))}
                      className="w-full h-2 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer"
                      min="128"
                      max="512"
                      step="8"
                    />
                    <div className="text-white text-sm mt-1">{qrSize}px</div>
                  </div>
                  
                  <div>
                    <label htmlFor="qr-fg-color" className="block text-white text-sm font-medium mb-2">
                      QR Code Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="qr-fg-color"
                        type="color"
                        value={qrFgColor}
                        onChange={(e) => setQrFgColor(e.target.value)}
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white border-opacity-20"
                      />
                      <div className="text-white text-sm">{qrFgColor.toUpperCase()}</div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="qr-bg-color" className="block text-white text-sm font-medium mb-2">
                      Background Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="qr-bg-color"
                        type="color"
                        value={qrBgColor}
                        onChange={(e) => setQrBgColor(e.target.value)}
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white border-opacity-20"
                      />
                      <div className="text-white text-sm">{qrBgColor.toUpperCase()}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="flex items-center justify-between space-x-4">
  <div className="relative">
    <select
      value={downloadFormat}
      onChange={(e) => setDownloadFormat(e.target.value)}
      className="appearance-none px-6 py-2 bg-blue-500 text-white font-medium rounded-lg cursor-pointer hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
    >
      <option value="png">PNG</option>
      <option value="jpg">JPG</option>
      <option value="svg">SVG</option>
    </select>
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
      <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 20 20">
        <path d="M7 10l5 5 5-5H7z"></path>
      </svg>
    </div>
  </div>
  
  <button
    onClick={downloadQRCode}
    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={!qrValue}
  >
    <Download className="mr-2" size={20} />
    Download
  </button>
</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;