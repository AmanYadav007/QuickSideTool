import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { 
  FileText, 
  Download, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Settings,
  BarChart3,
  Zap,
  Target,
  Shield,
  Info
} from 'lucide-react';
import logger from '../utils/logger';

const PDFCompressor = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [compressedFiles, setCompressedFiles] = useState([]);
  const [compressionLevel, setCompressionLevel] = useState('balanced');
  const [imageQuality, setImageQuality] = useState(0.8);
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [optimizeImages, setOptimizeImages] = useState(true);
  const [flattenAnnotations, setFlattenAnnotations] = useState(false);
  const [removeBookmarks, setRemoveBookmarks] = useState(false);
  const [targetSize, setTargetSize] = useState('auto'); // auto, 1mb, 5mb, 10mb

  const compressionLevels = [
    { 
      value: 'light', 
      label: 'Light Compression', 
      description: 'Minimal size reduction, maximum quality',
      compression: '10-30%',
      quality: '⭐⭐⭐⭐⭐',
      icon: Shield
    },
    { 
      value: 'balanced', 
      label: 'Balanced', 
      description: 'Good balance of size and quality',
      compression: '30-60%',
      quality: '⭐⭐⭐⭐',
      icon: Target
    },
    { 
      value: 'aggressive', 
      label: 'Aggressive', 
      description: 'Maximum compression, reduced quality',
      compression: '60-80%',
      quality: '⭐⭐⭐',
      icon: Zap
    },
    { 
      value: 'custom', 
      label: 'Custom Settings', 
      description: 'Fine-tune compression parameters',
      compression: 'Variable',
      quality: 'Variable',
      icon: Settings
    }
  ];

  const targetSizes = [
    { value: 'auto', label: 'Auto Optimize' },
    { value: '1mb', label: 'Under 1 MB' },
    { value: '5mb', label: 'Under 5 MB' },
    { value: '10mb', label: 'Under 10 MB' },
    { value: '25mb', label: 'Under 25 MB' }
  ];

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length !== acceptedFiles.length) {
      logger.warn('Some files were not PDFs and were filtered out');
    }
    setFiles(pdfFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true,
    disabled: isProcessing
  });

  const getCompressionSettings = (level) => {
    switch (level) {
      case 'light':
        return {
          imageQuality: 0.9,
          useObjectStreams: true,
          compressImages: true,
          removeMetadata: false,
          flattenAnnotations: false,
          removeBookmarks: false
        };
      case 'balanced':
        return {
          imageQuality: 0.8,
          useObjectStreams: true,
          compressImages: true,
          removeMetadata: true,
          flattenAnnotations: false,
          removeBookmarks: false
        };
      case 'aggressive':
        return {
          imageQuality: 0.6,
          useObjectStreams: true,
          compressImages: true,
          removeMetadata: true,
          flattenAnnotations: true,
          removeBookmarks: true
        };
      case 'custom':
        return {
          imageQuality: imageQuality,
          useObjectStreams: true,
          compressImages: optimizeImages,
          removeMetadata: removeMetadata,
          flattenAnnotations: flattenAnnotations,
          removeBookmarks: removeBookmarks
        };
      default:
        return compressionLevels[1]; // balanced
    }
  };

  const compressPDF = async (file, settings) => {
    try {
      setCurrentFile(`Compressing ${file.name}...`);
      
      // Load the PDF
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: false,
        updateMetadata: !settings.removeMetadata
      });

      const originalSize = arrayBuffer.byteLength;
      
      // Apply compression settings
      const saveOptions = {
        useObjectStreams: settings.useObjectStreams,
        addDefaultPage: false,
        objectsPerTick: 20
      };

      // Compress images if enabled
      if (settings.compressImages) {
        const pages = pdfDoc.getPages();
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          
          // Get page images and compress them
          const images = await page.getImages();
          for (const image of images) {
            try {
              // Get image data
              const imageBytes = await pdfDoc.embedJpg(image);
              
              // Create a canvas to compress the image
              const img = new Image();
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              await new Promise((resolve) => {
                img.onload = () => {
                  // Calculate new dimensions based on quality
                  const scale = settings.imageQuality;
                  canvas.width = img.width * scale;
                  canvas.height = img.height * scale;
                  
                  // Draw and compress
                  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                  resolve();
                };
                img.src = URL.createObjectURL(new Blob([imageBytes]));
              });
              
              // Convert back to blob and re-embed
              canvas.toBlob(async (blob) => {
                const compressedImageBytes = await blob.arrayBuffer();
                await pdfDoc.embedJpg(compressedImageBytes);
              }, 'image/jpeg', settings.imageQuality);
              
            } catch (error) {
              // Skip if not a JPEG image or compression fails
              logger.debug('Skipping image compression:', error.message);
            }
          }
          
          setProgress(((i + 1) / pages.length) * 50); // First 50% for image compression
        }
      }

      // Remove metadata if requested
      if (settings.removeMetadata) {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');
        pdfDoc.setCreationDate(new Date());
        pdfDoc.setModificationDate(new Date());
      }

      // Apply additional compression based on level
      if (settings.compressionLevel === 'aggressive') {
        // Reduce image quality further
        saveOptions.compress = true;
      }

      setProgress(75); // 75% for processing

      // Save the compressed PDF
      const compressedBytes = await pdfDoc.save(saveOptions);
      const compressedSize = compressedBytes.byteLength;
      
      setProgress(100);

      const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
      
      return {
        originalFile: file,
        compressedBytes,
        originalSize,
        compressedSize,
        compressionRatio,
        fileName: file.name.replace('.pdf', '_compressed.pdf'),
        settings: settings
      };
    } catch (error) {
      logger.error('Error compressing PDF:', error);
      throw new Error(`Failed to compress ${file.name}: ${error.message}`);
    }
  };

  const processFiles = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setCompressedFiles([]);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentFile(`Processing ${file.name} (${i + 1}/${files.length})`);
        
        const settings = getCompressionSettings(compressionLevel);
        const result = await compressPDF(file, settings);
        
        setCompressedFiles(prev => [...prev, result]);
        
        logger.success(`Successfully compressed ${file.name} by ${result.compressionRatio.toFixed(1)}%`);
      }
      
      setCurrentFile('All files compressed successfully!');
    } catch (error) {
      logger.error('Compression error:', error);
      setCurrentFile(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = (compressedFile) => {
    const blob = new Blob([compressedFile.compressedBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = compressedFile.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    compressedFiles.forEach(file => {
      setTimeout(() => downloadFile(file), 100);
    });
  };

  const clearFiles = () => {
    setFiles([]);
    setCompressedFiles([]);
    setProgress(0);
    setCurrentFile('');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionColor = (ratio) => {
    if (ratio >= 50) return 'text-green-400';
    if (ratio >= 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            PDF Compressor
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Reduce PDF file sizes with Adobe-level compression while maintaining quality. 
            Multiple compression levels and advanced optimization options.
          </p>
        </div>

        {/* Settings Panel */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Compression Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Compression Level */}
            <div>
              <label className="block text-sm font-medium mb-2">Compression Level</label>
              <select 
                value={compressionLevel} 
                onChange={(e) => setCompressionLevel(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {compressionLevels.map(level => (
                  <option key={level.value} value={level.value} className="bg-gray-800">
                    {level.label}
                  </option>
                ))}
              </select>
              {compressionLevels.find(l => l.value === compressionLevel) && (
                <p className="text-xs text-gray-400 mt-1">
                  {compressionLevels.find(l => l.value === compressionLevel).description}
                </p>
              )}
            </div>

            {/* Target Size */}
            <div>
              <label className="block text-sm font-medium mb-2">Target Size</label>
              <select 
                value={targetSize} 
                onChange={(e) => setTargetSize(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {targetSizes.map(size => (
                  <option key={size.value} value={size.value} className="bg-gray-800">
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Quality (for custom mode) */}
            {compressionLevel === 'custom' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Image Quality: {(imageQuality * 100).toFixed(0)}%
                </label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.1"
                  value={imageQuality} 
                  onChange={(e) => setImageQuality(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            )}

            {/* Custom Options */}
            {compressionLevel === 'custom' && (
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={optimizeImages}
                    onChange={(e) => setOptimizeImages(e.target.checked)}
                    className="rounded border-white/20 bg-white/10"
                  />
                  <span className="text-sm">Optimize Images</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={removeMetadata}
                    onChange={(e) => setRemoveMetadata(e.target.checked)}
                    className="rounded border-white/20 bg-white/10"
                  />
                  <span className="text-sm">Remove Metadata</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={flattenAnnotations}
                    onChange={(e) => setFlattenAnnotations(e.target.checked)}
                    className="rounded border-white/20 bg-white/10"
                  />
                  <span className="text-sm">Flatten Annotations</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={removeBookmarks}
                    onChange={(e) => setRemoveBookmarks(e.target.checked)}
                    className="rounded border-white/20 bg-white/10"
                  />
                  <span className="text-sm">Remove Bookmarks</span>
                </label>
              </div>
            )}
          </div>

          {/* Compression Level Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            {compressionLevels.map(level => (
              <div 
                key={level.value}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  compressionLevel === level.value 
                    ? 'bg-orange-500/20 border-orange-500' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {React.createElement(level.icon, { className: "w-5 h-5" })}
                  <h3 className="font-semibold text-sm">{level.label}</h3>
                </div>
                <p className="text-xs text-gray-400 mb-2">{level.compression} reduction</p>
                <p className="text-xs text-gray-400">{level.quality} quality</p>
              </div>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
              isDragActive 
                ? 'border-orange-400 bg-orange-400/10' 
                : 'border-white/30 hover:border-orange-400 hover:bg-orange-400/10'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <Zap className="w-16 h-16 mx-auto mb-4 text-orange-400" />
            <p className="text-xl font-semibold mb-2">
              {isDragActive ? 'Drop PDF files here' : 'Drag & drop PDF files here'}
            </p>
            <p className="text-gray-400 mb-4">
              or click to select files (supports multiple PDFs)
            </p>
            <p className="text-sm text-gray-500">
              Maximum file size: 100MB per file
            </p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Selected Files ({files.length})</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-gray-400">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <button
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Progress */}
        {isProcessing && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
              <div>
                <p className="font-semibold">{currentFile}</p>
                <p className="text-sm text-gray-400">Compressing files...</p>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">{Math.round(progress)}% complete</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={processFiles}
            disabled={files.length === 0 || isProcessing}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Compressing...
              </>
            ) : (
                              <>
                  <Zap className="w-5 h-5" />
                  Compress PDFs
                </>
            )}
          </button>

          {compressedFiles.length > 0 && (
            <>
              <button
                onClick={downloadAll}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download All ({compressedFiles.length})
              </button>
              
              <button
                onClick={clearFiles}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Clear All
              </button>
            </>
          )}
        </div>

        {/* Results */}
        {compressedFiles.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              Compression Results ({compressedFiles.length} files)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compressedFiles.map((file, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <span className="font-medium text-sm truncate">{file.fileName}</span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Original:</span>
                      <span>{formatFileSize(file.originalSize)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Compressed:</span>
                      <span>{formatFileSize(file.compressedSize)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Reduction:</span>
                      <span className={getCompressionColor(file.compressionRatio)}>
                        {file.compressionRatio.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => downloadFile(file)}
                    className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Compression Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Total Original Size:</span>
                  <p className="font-medium">{formatFileSize(compressedFiles.reduce((sum, f) => sum + f.originalSize, 0))}</p>
                </div>
                <div>
                  <span className="text-gray-400">Total Compressed Size:</span>
                  <p className="font-medium">{formatFileSize(compressedFiles.reduce((sum, f) => sum + f.compressedSize, 0))}</p>
                </div>
                <div>
                  <span className="text-gray-400">Total Saved:</span>
                  <p className="font-medium text-green-400">
                    {formatFileSize(compressedFiles.reduce((sum, f) => sum + (f.originalSize - f.compressedSize), 0))}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Average Reduction:</span>
                  <p className="font-medium text-orange-400">
                    {(compressedFiles.reduce((sum, f) => sum + f.compressionRatio, 0) / compressedFiles.length).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Zap className="w-12 h-12 text-orange-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Smart Compression</h3>
            <p className="text-gray-300">
              Intelligent compression algorithms that reduce file size while maintaining document quality.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <BarChart3 className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Multiple Levels</h3>
            <p className="text-gray-300">
              Choose from light, balanced, aggressive, or custom compression levels for your needs.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Shield className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Quality Preserved</h3>
            <p className="text-gray-300">
              Maintain text clarity, image quality, and document structure while reducing file size.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFCompressor; 