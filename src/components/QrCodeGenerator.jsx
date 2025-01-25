import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Settings, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeGenerator = () => {
  const [qrValue, setQrValue] = useState('');
  const [qrSize, setQrSize] = useState(256);
  const [qrFgColor, setQrFgColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [downloadFormat, setDownloadFormat] = useState('png');
  const qrRef = useRef(null);

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
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = qrSize;
      canvas.height = qrSize;
      ctx.drawImage(img, 0, 0);
      let downloadLink;
      switch(downloadFormat) {
        case 'svg':
          downloadLink = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
          break;
        case 'jpg':
          downloadLink = canvas.toDataURL("image/jpeg");
          break;
        case 'png':
        default:
          downloadLink = canvas.toDataURL("image/png");
          break;
      }
      const link = document.createElement('a');
      link.href = downloadLink;
      link.download = `qrcode.${downloadFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute w-96 h-96 -top-48 -right-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute w-96 h-96 -bottom-48 -left-48 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-white flex items-center hover:text-blue-200 transition-colors">
              <ArrowLeft className="mr-2" size={20} />
              Back to Home
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto ">
          <div className="flex items-center">
              <QrCode size={30} className="text-white mr-2 mb-5 " />
              <h1 className="text-2xl font-bold text-white mb-5">QR Code Generator</h1>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 shadow-xl">
              <div className="mb-6">
                <label htmlFor="qr-input" className="block text-white text-sm font-bold mb-2">
                  Enter text or URL for QR Code
                </label>
                <input
                  id="qr-input"
                  type="text"
                  value={qrValue}
                  onChange={(e) => setQrValue(e.target.value)}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 backdrop-blur-sm"
                  placeholder="Enter text or URL"
                />
              </div>

              <div className="mb-6">
                <h2 className="text-white text-lg font-semibold mb-4 flex items-center">
                  <Settings className="mr-2" size={20} />
                  QR Code Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                    <label htmlFor="qr-size" className="block text-white text-sm font-bold mb-2">
                      Size (px)
                    </label>
                    <input
                      id="qr-size"
                      type="number"
                      value={qrSize}
                      onChange={(e) => setQrSize(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none"
                      min="128"
                      max="512"
                    />
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                    <label htmlFor="qr-fg-color" className="block text-white text-sm font-bold mb-2">
                      Foreground Color
                    </label>
                    <input
                      id="qr-fg-color"
                      type="color"
                      value={qrFgColor}
                      onChange={(e) => setQrFgColor(e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                    <label htmlFor="qr-bg-color" className="block text-white text-sm font-bold mb-2">
                      Background Color
                    </label>
                    <input
                      id="qr-bg-color"
                      type="color"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-white text-lg font-semibold mb-4">Generated QR Code</h2>
                <div className="flex justify-center bg-white bg-opacity-20 p-8 rounded-xl backdrop-blur-sm" ref={qrRef}>
                  {generateQRCode()}
                </div>
              </div>

              <div className="flex justify-center items-center space-x-4">
                <select
                  value={downloadFormat}
                  onChange={(e) => setDownloadFormat(e.target.value)}
                  className="px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white focus:outline-none backdrop-blur-sm"
                >
                  <option value="png" className='bg-black'>PNG</option>
                  <option value="jpg" className='bg-black'>JPG</option>
                  <option value="svg" className='bg-black'>SVG</option>
                </select>
                <button
                  onClick={downloadQRCode}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-2 px-6 rounded-xl text-lg transition-all duration-300 flex items-center backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!qrValue}
                >
                  <Download className="mr-2" size={20} />
                  Download QR Code
                </button>
              </div>
            </div>
          </div>
        </main>


      </div>
    </div>
  );
};

export default QRCodeGenerator;