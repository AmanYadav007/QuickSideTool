import React, { useState, useCallback } from "react";
import SEO from "./SEO";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import {
  FileText,
  Download,
  Loader2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Zap,
  Star,
  Shield,
  Sparkles,
  Minus,
  Settings,
  BarChart3,
  Info,
  FileDown,
} from "lucide-react";
import Notification from "./Notification";

const PDFCompressor = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [downloadBlob, setDownloadBlob] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("info");
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const handleNotification = (message, type = "info") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setOriginalSize(selectedFile.size);
        setMessage("");
        setDownloadBlob(null);
        setCompressedSize(0);
      } else {
        setFile(null);
        setMessage("Error: Please select a valid PDF file.");
        setDownloadBlob(null);
      }
    } else {
      setFile(null);
      setMessage("");
      setDownloadBlob(null);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    setMessage("");
    setDownloadBlob(null);

    if (acceptedFiles.length === 0) {
      setMessage("Error: No file dropped or invalid file type.");
      setFile(null);
      return;
    }

    const droppedFile = acceptedFiles[0];
    if (droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setOriginalSize(droppedFile.size);
      setCompressedSize(0);
    } else {
      setMessage(
        "Error: Only PDF files are accepted. Please drag and drop a .pdf file."
      );
      setFile(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    disabled: isLoading,
  });

  const triggerDownload = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleCompression = async () => {
    if (!file) {
      setMessage("Error: Please upload a PDF file first.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setDownloadBlob(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("compression_level", compressionLevel);

    const backendUrl =
      process.env.REACT_APP_BACKEND_URL ||
      "http://127.0.0.1:4000";

    // Use the new PDF compression endpoint
    const endpoint = "/compress-pdf";

    try {
      setMessage("Compressing PDF...");

      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        setCompressedSize(blob.size);

        const contentDisposition = response.headers.get("Content-Disposition");
        let filename = `compressed_${file.name}`;

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }

        setDownloadBlob({ blob, filename });

        const reductionPercent = (
          ((originalSize - blob.size) / originalSize) *
          100
        ).toFixed(1);
        const successMessage = `Success: PDF compressed! Size reduced by ${reductionPercent}%. Click "Download" to save.`;
        setMessage(successMessage);
        handleNotification(
          `Successfully compressed PDF! Size reduced by ${reductionPercent}%`,
          "success"
        );
      } else {
        const errorText = await response.text();
        setMessage(
          `Error: Compression failed. ${errorText || "Please try again."}`
        );
        setDownloadBlob(null);
        handleNotification("Compression failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Network or processing error:", error);
      setMessage(
        "Error: Failed to compress file. Check your connection or try again."
      );
      setDownloadBlob(null);
      handleNotification(
        "Network error. Please check your connection.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    setFile(null);
    setMessage("");
    setDownloadBlob(null);
    setIsLoading(false);
    setOriginalSize(0);
    setCompressedSize(0);
  };

  const compressionLevels = [
    {
      id: "low",
      name: "Light Compression",
      description: "Maintains high quality, minimal size reduction",
      icon: <Star className="w-4 h-4" />,
      color: "from-green-500 to-emerald-500",
      compression: "10-20%"
    },
    {
      id: "medium",
      name: "Balanced",
      description: "Good balance of quality and size reduction",
      icon: <Zap className="w-4 h-4" />,
      color: "from-blue-500 to-cyan-500",
      compression: "30-50%"
    },
    {
      id: "high",
      name: "Maximum Compression",
      description: "Maximum size reduction, some quality loss",
      icon: <Minus className="w-4 h-4" />,
      color: "from-orange-500 to-red-500",
      compression: "50-80%"
    }
  ];

  const selectedLevel = compressionLevels.find(
    (level) => level.id === compressionLevel
  );

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getCompressionSavings = () => {
    if (originalSize === 0 || compressedSize === 0) return null;
    const savings = originalSize - compressedSize;
    const percentage = ((savings / originalSize) * 100).toFixed(1);
    return { savings, percentage };
  };

  const compressionSavings = getCompressionSavings();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 text-white font-sans antialiased">
      <SEO
        title="Compress PDF Online – Reduce PDF Size Without Losing Quality"
        description="Shrink PDF file size for email or upload. Choose target size, no watermark, secure. Fast compression with optional Adobe engine."
        url="https://quicksidetool.com/pdf-compressor"
      />
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-blue-500/20 blur-3xl animate-blob-fade top-1/4 left-[15%] animation-delay-0"></div>
        <div className="absolute w-80 h-80 rounded-full bg-teal-500/20 blur-3xl animate-blob-fade top-[65%] left-[70%] animation-delay-2000"></div>
        <div className="absolute w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl animate-blob-fade top-[10%] left-[60%] animation-delay-4000"></div>
        <div className="absolute w-56 h-56 rounded-full bg-green-500/20 blur-3xl animate-blob-fade top-[80%] left-[20%] animation-delay-6000"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
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
              PDF Compressor
            </h1>
            <div className="w-[110px] md:w-[130px] flex-shrink-0"></div>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
          <div className="max-w-5xl w-full">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Professional PDF Compression
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Compress your PDFs with our efficient compression to reduce file size while maintaining quality. Perfect for
                email, web uploads, and storage optimization.
              </p>
            </div>

            {/* Compression Levels */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {compressionLevels.map((level) => (
                <div
                  key={level.id}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    compressionLevel === level.id
                      ? `border-blue-400 bg-gradient-to-br ${level.color} bg-opacity-20`
                      : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                  }`}
                  onClick={() => setCompressionLevel(level.id)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-3 rounded-xl ${
                        compressionLevel === level.id
                          ? `bg-gradient-to-br ${level.color}`
                          : "bg-white/10"
                      }`}
                    >
                      <div className="text-white">
                        {level.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {level.name}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {level.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Compression ratio badge */}
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    compressionLevel === level.id
                      ? `bg-gradient-to-r ${level.color} text-white`
                      : "bg-white/10 text-white/70"
                  }`}>
                    <Minus className="w-3 h-3 mr-1" />
                    {level.compression} reduction
                  </div>
                  
                  {/* Features */}
                  <div className="mt-4 space-y-2">
                    {level.id === 'low' && (
                      <>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          High quality preservation
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Fast processing
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Print ready
                        </div>
                      </>
                    )}
                    {level.id === 'medium' && (
                      <>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                          Balanced quality & size
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                          Web optimized
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                          Email friendly
                        </div>
                      </>
                    )}
                    {level.id === 'high' && (
                      <>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <CheckCircle className="w-4 h-4 text-orange-400" />
                          Maximum size reduction
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <CheckCircle className="w-4 h-4 text-orange-400" />
                          Storage optimized
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <CheckCircle className="w-4 h-4 text-orange-400" />
                          Fast loading
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Compression Engine Info */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">
                  Compression Engine
                </h3>
              </div>

              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <h4 className="font-semibold text-white">
                    PyMuPDF Powered Compression
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Advanced PDF optimization algorithms
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Intelligent object removal and stream compression
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Web-optimized output with linear PDF structure
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Fast processing with minimal quality loss
                  </li>
                </ul>
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl mb-8">
              <div className="flex items-center justify-center mb-6">
                <FileText size={30} className="text-blue-400 mr-3" />
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Upload PDF File
                </h3>
              </div>

              <div
                {...getRootProps()}
                className={`mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-dashed
                           ${
                             isDragActive
                               ? "border-teal-400 bg-teal-400/10"
                               : "border-white/30"
                           }
                           transition-all duration-300 cursor-pointer hover:border-blue-400 hover:bg-blue-400/10`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center py-4">
                  {file ? (
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <p className="text-white font-semibold">{file.name}</p>
                      <p className="text-white/70 text-sm">
                        Original Size: {formatFileSize(originalSize)}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <p className="text-white font-semibold mb-2">
                        {isDragActive
                          ? "Drop your PDF here"
                          : "Drag & drop your PDF here"}
                      </p>
                      <p className="text-white/70 text-sm mb-4">
                        or click to browse files
                      </p>
                      <div className="flex items-center gap-4 text-xs text-white/60">
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Secure
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Fast
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Reliable
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Compression Results */}
              {compressionSavings && (
                <div className="mt-6 bg-green-500/10 border border-green-400/30 rounded-xl p-4">
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-white/70">Original Size</p>
                      <p className="text-lg font-bold text-white">
                        {formatFileSize(originalSize)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Compressed Size</p>
                      <p className="text-lg font-bold text-green-400">
                        {formatFileSize(compressedSize)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Space Saved</p>
                      <p className="text-lg font-bold text-blue-400">
                        {compressionSavings.percentage}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Message Display */}
              {message && (
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    message.includes("Success")
                      ? "bg-green-500/20 border border-green-400/30"
                      : "bg-red-500/20 border border-red-400/30"
                  }`}
                >
                  <p className="text-white">{message}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={handleCompression}
                  disabled={!file || isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600
                           text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg
                           flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Compressing...
                    </>
                  ) : (
                    <>
                      <Minus className="w-5 h-5" />
                      Compress PDF
                    </>
                  )}
                </button>

                {downloadBlob && (
                  <button
                    onClick={() =>
                      triggerDownload(downloadBlob.blob, downloadBlob.filename)
                    }
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600
                             text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300
                             transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Compressed PDF
                  </button>
                )}

                <button
                  onClick={handleClearForm}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl
                           transition-all duration-300 border border-white/20 hover:border-white/40"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-green-400" />
                  <h3 className="text-lg font-bold text-white">
                    Secure Processing
                  </h3>
                </div>
                <p className="text-white/80 text-sm">
                  Your files are processed securely with enterprise-grade
                  security and automatic cleanup.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">
                    Fast Compression
                  </h3>
                </div>
                <p className="text-white/80 text-sm">
                  Quick compression with reliable results.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-8 h-8 text-yellow-400" />
                  <h3 className="text-lg font-bold text-white">
                    Quality Preservation
                  </h3>
                </div>
                <p className="text-white/80 text-sm">
                  Smart compression preserves document quality.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Notification */}
      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default PDFCompressor;
