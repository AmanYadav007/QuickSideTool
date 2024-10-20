import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Settings } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 to-purple-600 p-4">
      <Link to="/" className="text-white mb-4 flex items-center">
        <ArrowLeft className="mr-2" size={20} />
        Back to Home
      </Link>
      <div className="bg-white bg-opacity-10 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg p-6 flex-grow overflow-y-auto">
        <h1 className="text-3xl font-bold text-white mb-6">QR Code Generator</h1>
        
        <div className="mb-6">
          <label htmlFor="qr-input" className="block text-white text-sm font-bold mb-2">
            Enter text or URL for QR Code
          </label>
          <input
            id="qr-input"
            type="text"
            value={qrValue}
            onChange={(e) => setQrValue(e.target.value)}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            placeholder="Enter text or URL"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-white text-lg font-semibold mb-2 flex items-center">
            <Settings className="mr-2" size={20} />
            QR Code Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="qr-size" className="block text-white text-sm font-bold mb-2">
                Size (px)
              </label>
              <input
                id="qr-size"
                type="number"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                min="128"
                max="512"
              />
            </div>
            <div>
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
            <div>
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
          <h2 className="text-white text-lg font-semibold mb-2">Generated QR Code</h2>
          <div className="flex justify-center bg-white p-4 rounded-lg" ref={qrRef}>
            {generateQRCode()}
          </div>
        </div>

        <div className="flex justify-center items-center space-x-4">
          <select
            value={downloadFormat}
            onChange={(e) => setDownloadFormat(e.target.value)}
            className="px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
          >
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="svg">SVG</option>
          </select>
          <button
            onClick={downloadQRCode}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full text-lg transition-all duration-300 flex items-center"
            disabled={!qrValue}
          >
            <Download className="mr-2" size={20} />
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;