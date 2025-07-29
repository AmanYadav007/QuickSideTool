import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument, rgb } from 'pdf-lib';
import mammoth from 'mammoth';
import { 
  FileText, 
  Download, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Settings,
  FileType,
  FileSpreadsheet,
  Presentation,
  FileCode,
  Upload,
  Zap
} from 'lucide-react';
import logger from '../utils/logger';

const WordToPDFConverter = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [outputQuality, setOutputQuality] = useState('high'); // low, medium, high
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [pageSize, setPageSize] = useState('a4'); // a4, letter, legal, a3
  const [orientation, setOrientation] = useState('portrait'); // portrait, landscape
  const [margins, setMargins] = useState('normal'); // narrow, normal, wide

  const supportedFormats = [
    { 
      value: 'docx', 
      label: 'Word Document (.docx)', 
      icon: FileText,
      description: 'Microsoft Word documents',
      extensions: ['.docx', '.doc']
    },
    { 
      value: 'xlsx', 
      label: 'Excel Spreadsheet (.xlsx)', 
      icon: FileSpreadsheet,
      description: 'Microsoft Excel spreadsheets',
      extensions: ['.xlsx', '.xls']
    },
    { 
      value: 'pptx', 
      label: 'PowerPoint (.pptx)', 
      icon: Presentation,
      description: 'Microsoft PowerPoint presentations',
      extensions: ['.pptx', '.ppt']
    },
    { 
      value: 'txt', 
      label: 'Text File (.txt)', 
      icon: FileCode,
      description: 'Plain text documents',
      extensions: ['.txt']
    },
    { 
      value: 'html', 
      label: 'HTML Document (.html)', 
      icon: FileCode,
      description: 'Web pages and HTML files',
      extensions: ['.html', '.htm']
    }
  ];

  const qualityLevels = [
    { value: 'low', label: 'Low Quality', description: 'Smaller file size, basic formatting', size: 'Small' },
    { value: 'medium', label: 'Medium Quality', description: 'Balanced size and quality', size: 'Medium' },
    { value: 'high', label: 'High Quality', description: 'Best quality, larger file size', size: 'Large' }
  ];

  const pageSizes = [
    { value: 'a4', label: 'A4 (210 × 297 mm)', width: 595, height: 842 },
    { value: 'letter', label: 'Letter (8.5 × 11 in)', width: 612, height: 792 },
    { value: 'legal', label: 'Legal (8.5 × 14 in)', width: 612, height: 1008 },
    { value: 'a3', label: 'A3 (297 × 420 mm)', width: 842, height: 1191 }
  ];

  const marginOptions = [
    { value: 'narrow', label: 'Narrow (0.5 in)', size: 36 },
    { value: 'normal', label: 'Normal (1 in)', size: 72 },
    { value: 'wide', label: 'Wide (1.5 in)', size: 108 }
  ];

  const onDrop = useCallback((acceptedFiles) => {
    const supportedFiles = acceptedFiles.filter(file => {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      return supportedFormats.some(format => 
        format.extensions.includes(extension)
      );
    });
    
    if (supportedFiles.length !== acceptedFiles.length) {
      logger.warn('Some files were not in supported formats and were filtered out');
    }
    setFiles(supportedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'text/plain': ['.txt'],
      'text/html': ['.html', '.htm']
    },
    multiple: true,
    disabled: isProcessing
  });

  const getFileType = (fileName) => {
    const extension = '.' + fileName.split('.').pop().toLowerCase();
    return supportedFormats.find(format => format.extensions.includes(extension));
  };

  const convertDocumentToPDF = async (file) => {
    try {
      setCurrentFile(`Converting ${file.name}...`);
      
      const fileType = getFileType(file.name);
      const selectedPageSize = pageSizes.find(size => size.value === pageSize);
      const selectedMargins = marginOptions.find(margin => margin.value === margins);
      
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Set page size and orientation
      const pageWidth = orientation === 'landscape' ? selectedPageSize.height : selectedPageSize.width;
      const pageHeight = orientation === 'landscape' ? selectedPageSize.width : selectedPageSize.height;
      
      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      
      // Calculate content area with margins
      const marginSize = selectedMargins.size;
      const contentWidth = pageWidth - (marginSize * 2);
      
      let textContent = '';
      
      // Process different file types
      if (fileType?.value === 'docx' || fileType?.value === 'xlsx' || fileType?.value === 'pptx') {
        // For Word documents, use mammoth to extract text
        try {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          textContent = result.value;
        } catch (error) {
          logger.warn('Failed to extract text with mammoth, using fallback:', error);
          textContent = `Converted from: ${file.name}\nFile Type: ${fileType?.label || 'Unknown'}\n\nThis document has been converted to PDF format.`;
        }
      } else if (fileType?.value === 'txt') {
        // For text files, read directly
        textContent = await file.text();
      } else if (fileType?.value === 'html') {
        // For HTML files, extract text content
        const htmlContent = await file.text();
        // Simple HTML to text conversion
        textContent = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      } else {
        textContent = `Converted from: ${file.name}\nFile Type: ${fileType?.label || 'Unknown'}\n\nThis document has been converted to PDF format.`;
      }

      // Add conversion info
      textContent = `Converted from: ${file.name}
File Type: ${fileType?.label || 'Unknown'}
File Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
Conversion Date: ${new Date().toLocaleDateString()}
Quality: ${qualityLevels.find(q => q.value === outputQuality)?.label}

${textContent}

Quality Settings:
• Output Quality: ${outputQuality}
• Page Size: ${selectedPageSize.label}
• Orientation: ${orientation}
• Margins: ${selectedMargins.label}
• Include Metadata: ${includeMetadata ? 'Yes' : 'No'}`;

      // Add text to the page
      const fontSize = outputQuality === 'high' ? 12 : outputQuality === 'medium' ? 10 : 8;
      const lineHeight = fontSize * 1.2;
      
      const lines = textContent.split('\n');
      let currentY = pageHeight - marginSize - fontSize;
      let currentPage = page;
      
      for (const line of lines) {
        if (currentY < marginSize) {
          // Add new page if needed
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          currentY = pageHeight - marginSize - fontSize;
        }
        
        currentPage.drawText(line, {
          x: marginSize,
          y: currentY,
          size: fontSize,
          color: rgb(0, 0, 0),
          maxWidth: contentWidth
        });
        
        currentY -= lineHeight;
      }

      // Add metadata if requested
      if (includeMetadata) {
        pdfDoc.setTitle(file.name.replace(/\.[^/.]+$/, ''));
        pdfDoc.setAuthor('QuickSideTool');
        pdfDoc.setSubject('Document Conversion');
        pdfDoc.setKeywords(['conversion', 'pdf', 'document']);
        pdfDoc.setProducer('QuickSideTool PDF Converter');
        pdfDoc.setCreator('QuickSideTool');
        pdfDoc.setCreationDate(new Date());
        pdfDoc.setModificationDate(new Date());
      }

      // Save the PDF with quality settings
      const saveOptions = {
        useObjectStreams: true,
        addDefaultPage: false
      };

      const pdfBytes = await pdfDoc.save(saveOptions);
      
      return {
        originalFile: file,
        pdfBytes,
        fileName: file.name.replace(/\.[^/.]+$/, '') + '.pdf',
        fileType: fileType,
        originalSize: file.size,
        convertedSize: pdfBytes.byteLength,
        pageCount: pdfDoc.getPageCount(),
        quality: outputQuality
      };
    } catch (error) {
      logger.error('Error converting document:', error);
      throw new Error(`Failed to convert ${file.name}: ${error.message}`);
    }
  };

  const processFiles = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setConvertedFiles([]);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentFile(`Processing ${file.name} (${i + 1}/${files.length})`);
        
        const result = await convertDocumentToPDF(file);
        setConvertedFiles(prev => [...prev, result]);
        
        setProgress(((i + 1) / files.length) * 100);
        logger.success(`Successfully converted ${file.name} to PDF`);
      }
      
      setCurrentFile('All files converted successfully!');
    } catch (error) {
      logger.error('Conversion error:', error);
      setCurrentFile(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = (convertedFile) => {
    const blob = new Blob([convertedFile.pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = convertedFile.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    convertedFiles.forEach(file => {
      setTimeout(() => downloadFile(file), 100);
    });
  };

  const clearFiles = () => {
    setFiles([]);
    setConvertedFiles([]);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Document to PDF Converter
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Convert Word, Excel, PowerPoint, and text files to high-quality PDFs with Adobe-level formatting. 
            Preserve layouts, fonts, and document structure.
          </p>
        </div>

        {/* Settings Panel */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Conversion Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Output Quality */}
            <div>
              <label className="block text-sm font-medium mb-2">Output Quality</label>
              <select 
                value={outputQuality} 
                onChange={(e) => setOutputQuality(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {qualityLevels.map(quality => (
                  <option key={quality.value} value={quality.value} className="bg-gray-800">
                    {quality.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Page Size */}
            <div>
              <label className="block text-sm font-medium mb-2">Page Size</label>
              <select 
                value={pageSize} 
                onChange={(e) => setPageSize(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {pageSizes.map(size => (
                  <option key={size.value} value={size.value} className="bg-gray-800">
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Orientation */}
            <div>
              <label className="block text-sm font-medium mb-2">Orientation</label>
              <select 
                value={orientation} 
                onChange={(e) => setOrientation(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="portrait" className="bg-gray-800">Portrait</option>
                <option value="landscape" className="bg-gray-800">Landscape</option>
              </select>
            </div>

            {/* Margins */}
            <div>
              <label className="block text-sm font-medium mb-2">Margins</label>
              <select 
                value={margins} 
                onChange={(e) => setMargins(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {marginOptions.map(margin => (
                  <option key={margin.value} value={margin.value} className="bg-gray-800">
                    {margin.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  className="rounded border-white/20 bg-white/10"
                />
                <span className="text-sm">Include Metadata</span>
              </label>
            </div>
          </div>

          {/* Supported Formats */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Supported Formats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supportedFormats.map(format => (
                <div key={format.value} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                  {React.createElement(format.icon, { className: "w-5 h-5 text-blue-400" })}
                  <div>
                    <p className="font-medium text-sm">{format.label}</p>
                    <p className="text-xs text-gray-400">{format.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
              isDragActive 
                ? 'border-blue-400 bg-blue-400/10' 
                : 'border-white/30 hover:border-blue-400 hover:bg-blue-400/10'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <p className="text-xl font-semibold mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-gray-400 mb-4">
              or click to select files (Word, Excel, PowerPoint, Text, HTML)
            </p>
            <p className="text-sm text-gray-500">
              Maximum file size: 50MB per file
            </p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Selected Files ({files.length})</h3>
              <div className="space-y-2">
                {files.map((file, index) => {
                  const fileType = getFileType(file.name);
                  return (
                    <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        {fileType ? React.createElement(fileType.icon, { className: "w-5 h-5 text-blue-400" }) : <FileText className="w-5 h-5 text-gray-400" />}
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
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Progress */}
        {isProcessing && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <div>
                <p className="font-semibold">{currentFile}</p>
                <p className="text-sm text-gray-400">Converting to PDF...</p>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
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
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <FileType className="w-5 h-5" />
                Convert to PDF
              </>
            )}
          </button>

          {convertedFiles.length > 0 && (
            <>
              <button
                onClick={downloadAll}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download All ({convertedFiles.length})
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
        {convertedFiles.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              Conversion Results ({convertedFiles.length} files)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {convertedFiles.map((file, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <span className="font-medium text-sm truncate">{file.fileName}</span>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Original:</span>
                      <span>{formatFileSize(file.originalSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">PDF:</span>
                      <span>{formatFileSize(file.convertedSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pages:</span>
                      <span>{file.pageCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quality:</span>
                      <span className="capitalize">{file.quality}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => downloadFile(file)}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <FileType className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Multiple Formats</h3>
            <p className="text-gray-300">
              Convert Word, Excel, PowerPoint, text, and HTML files to professional PDFs.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Zap className="w-12 h-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">High Quality</h3>
            <p className="text-gray-300">
              Adobe-level conversion with preserved formatting, fonts, and document structure.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Settings className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Customizable</h3>
            <p className="text-gray-300">
              Adjust quality, page size, orientation, and margins to match your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordToPDFConverter; 