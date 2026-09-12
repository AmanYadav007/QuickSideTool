import React, { useState, useCallback } from "react";
import SEO from "./SEO";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import {
  FileText,
  Download,
  Loader2,
  CheckCircle,
  ArrowLeft,
  Zap,
  Star,
  Shield,
  Minus,
  Info,
} from "lucide-react";
import Notification from "./Notification";

const PDFCompressor = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [downloadBlob, setDownloadBlob] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [compressionMode, setCompressionMode] = useState("advanced");
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
      setMessage("Error: Only PDF files are accepted. Please drag and drop a .pdf file.");
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

    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:4000";
    const endpoint = compressionMode === 'advanced' ? "/compress-pdf-advanced" : "/compress-pdf";

    try {
      const processingMessage = compressionMode === 'advanced'
        ? "Starting advanced multi-stage compression..."
        : "Compressing PDF...";
      setMessage(processingMessage);

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

        const reductionPercent = (((originalSize - blob.size) / originalSize) * 100).toFixed(1);

        let successMessage;
        if (reductionPercent < 0) {
          successMessage = `Note: File size increased by ${Math.abs(reductionPercent)}%. This usually means the PDF was already well-optimized. The compressed version may have better web compatibility.`;
        } else if (reductionPercent < 5) {
          successMessage = `Success: PDF compressed! Size reduced by ${reductionPercent}%. The PDF was already well-optimized, so minimal compression was achieved.`;
        } else {
          successMessage = `Success: PDF compressed! Size reduced by ${reductionPercent}%. Click "Download" to save.`;
        }

        setMessage(successMessage);
        handleNotification(
          reductionPercent < 0
            ? `PDF processed! File size increased by ${Math.abs(reductionPercent)}% (already optimized)`
            : `Successfully compressed PDF! Size reduced by ${reductionPercent}%`,
          reductionPercent < 0 ? "info" : "success"
        );
      } else {
        const errorText = await response.text();
        setMessage(`Error: Compression failed. ${errorText || "Please try again."}`);
        setDownloadBlob(null);
        handleNotification("Compression failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Network or processing error:", error);
      setMessage("Error: Failed to compress file. Check your connection or try again.");
      setDownloadBlob(null);
      handleNotification("Network error. Please check your connection.", "error");
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
      name: "Light",
      description: "High quality, minimal size reduction",
      icon: <Star className="w-4 h-4" />,
      compression: "10-20%"
    },
    {
      id: "medium",
      name: "Balanced",
      description: "Good balance of quality and size",
      icon: <Zap className="w-4 h-4" />,
      compression: "30-50%"
    },
    {
      id: "high",
      name: "Maximum",
      description: "Maximum size reduction, some quality loss",
      icon: <Minus className="w-4 h-4" />,
      compression: "50-80%"
    }
  ];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getCompressionSavings = (originalSize, compressedSize) => {
    if (originalSize === 0 || compressedSize === 0) return null;
    const savings = originalSize - compressedSize;
    const percentage = ((savings / originalSize) * 100).toFixed(1);
    return { savings, percentage };
  };

  const compressionSavings = getCompressionSavings(originalSize, compressedSize);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SEO
        title="Compress PDF Online – Reduce PDF Size Without Losing Quality"
        description="Shrink PDF file size for email or upload. Choose target size, no watermark, secure. Fast compression with optional Adobe engine."
        url="https://quicksidetool.com/pdf-compressor"
      />

      <div className="container section">
        <header className="mb-8 flex items-center justify-between">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Tools
          </Link>
          <h1 className="h1 text-center">PDF Compressor</h1>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="card p-6 mb-8">
            <h2 className="h2 text-center mb-4">Professional PDF Compression</h2>
            <p className="text-[var(--color-text-muted)] text-center max-w-2xl mx-auto">
              Compress your PDFs with our efficient compression to reduce file size while maintaining quality. Perfect for email, web uploads, and storage optimization.
            </p>
          </div>

          <div className="card p-6 mb-8">
            <h3 className="h3 mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-[var(--color-primary)]" />
              Compression Mode
            </h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCompressionMode('basic')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${compressionMode === 'basic' ? 'bg-[var(--color-primary)] text-white shadow' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-alt)]'}`}
              >
                Basic
              </button>
              <button
                onClick={() => setCompressionMode('advanced')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${compressionMode === 'advanced' ? 'bg-[var(--color-primary)] text-white shadow' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-alt)]'}`}
              >
                Advanced
              </button>
            </div>
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
              {compressionMode === 'advanced'
                ? 'Multi-stage compression with image optimization. Targets 50%+ reduction.'
                : 'Basic compression for simple PDFs. Good for already-optimized files.'}
            </p>
          </div>

          <div className="card p-6 mb-8">
            <h3 className="h3 mb-4">Compression Level</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {compressionLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setCompressionLevel(level.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${compressionLevel === level.id ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]' : 'border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-primary)] hover:bg-[var(--color-bg-alt)]'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${compressionLevel === level.id ? 'bg-[var(--color-primary-light)]' : 'bg-[var(--color-bg-alt)]'}`}>
                      {level.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--color-text)]">{level.name}</h4>
                      <p className="text-xs text-[var(--color-text-muted)]">{level.compression} reduction</p>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)]">{level.description}</p>
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">Choose your compression level above. Higher compression = smaller files but may reduce quality.</p>
          </div>

          <div className="card p-6 mb-8">
            <div className="flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-[var(--color-primary)] mr-3" />
              <h3 className="h3">Upload PDF File</h3>
            </div>

            <div {...getRootProps()} className={`mt-6 upload-zone p-8 ${isDragActive ? 'drag-active' : ''} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center py-4">
                {file ? (
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="font-semibold text-[var(--color-text)]">{file.name}</p>
                    <p className="text-[var(--color-text-muted)] text-sm mt-1">Original Size: {formatFileSize(originalSize)}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-[var(--color-primary)] mx-auto mb-4" />
                    <p className="font-semibold text-[var(--color-text)] mb-2">{isDragActive ? "Drop your PDF here" : "Drag & drop your PDF here"}</p>
                    <p className="text-[var(--color-text-muted)] text-sm mb-4">or click to browse files</p>
                    <div className="flex items-center justify-center gap-4 text-xs text-[var(--color-text-light)]">
                      <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure</span>
                      <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Fast</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3" /> Reliable</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {compressionSavings && (
              <div className="mt-6 p-4 rounded-xl border border-green-500/30 bg-green-500/10">
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Original Size</p>
                    <p className="text-lg font-bold text-[var(--color-text)]">{formatFileSize(originalSize)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Compressed Size</p>
                    <p className="text-lg font-bold text-green-500">{formatFileSize(compressedSize)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Space Saved</p>
                    <p className="text-lg font-bold text-[var(--color-primary)]">{compressionSavings.percentage}%</p>
                  </div>
                </div>
              </div>
            )}

            {message && (
              <div className={`mt-4 p-4 rounded-lg ${message.startsWith("Error:") ? 'bg-red-500/10 border border-red-500/30' : message.startsWith("Note:") ? 'bg-[var(--color-primary-light)] border border-[var(--color-primary)]/30' : 'bg-green-500/10 border border-green-500/30'}`}>
                <p className={message.startsWith("Error:") ? 'text-red-500' : message.startsWith("Note:") ? 'text-[var(--color-primary)]' : 'text-green-500'}>{message}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button onClick={handleCompression} disabled={!file || isLoading} className="btn-primary flex-1">
                {isLoading ? <> <Loader2 className="w-4 h-4 animate-spin mr-2" /> Compressing... </> : <> <Minus className="w-4 h-4 mr-2" /> Compress PDF </>}
              </button>

              {downloadBlob && (
                <button onClick={() => triggerDownload(downloadBlob.blob, downloadBlob.filename)} className="btn-primary flex-1 bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" /> Download Compressed PDF
                </button>
              )}

              <button onClick={handleClearForm} className="btn-secondary">Clear</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getCompressionSavings = (originalSize, compressedSize) => {
  if (originalSize === 0 || compressedSize === 0) return null;
  const savings = originalSize - compressedSize;
  const percentage = ((savings / originalSize) * 100).toFixed(1);
  return { savings, percentage };
};

export default PDFCompressor;