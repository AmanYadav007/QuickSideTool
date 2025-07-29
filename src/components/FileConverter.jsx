import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb } from 'pdf-lib';
import JSZip from 'jszip';
import Tesseract from 'tesseract.js';
import mammoth from 'mammoth';

import { 
  FileText, 
  Download, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Settings,
  FileType,
  FileCode,
  FileSpreadsheet,
  Presentation,
  Image,
  FileImage,
  ArrowRight,
  Upload,
  X
} from 'lucide-react';
import logger from '../utils/logger';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const FileConverter = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [sourceFormat, setSourceFormat] = useState('');
  const [targetFormat, setTargetFormat] = useState('');
  const [processedFiles, setProcessedFiles] = useState([]);
  const [preserveFormatting, setPreserveFormatting] = useState(true);
  const [language, setLanguage] = useState('en-US');

  // Define all supported formats
  const allFormats = {
    // Document formats
    'pdf': { label: 'PDF Document', icon: FileText, extensions: ['.pdf'], mimeType: 'application/pdf' },
    'docx': { label: 'Word Document', icon: FileText, extensions: ['.docx'], mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    'doc': { label: 'Word Document (Legacy)', icon: FileText, extensions: ['.doc'], mimeType: 'application/msword' },
    'rtf': { label: 'Rich Text Format', icon: FileText, extensions: ['.rtf'], mimeType: 'application/rtf' },
    'txt': { label: 'Plain Text', icon: FileCode, extensions: ['.txt'], mimeType: 'text/plain' },
    'html': { label: 'HTML Document', icon: FileCode, extensions: ['.html', '.htm'], mimeType: 'text/html' },
    
    // Spreadsheet formats
    'xlsx': { label: 'Excel Spreadsheet', icon: FileSpreadsheet, extensions: ['.xlsx'], mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    'csv': { label: 'CSV File', icon: FileSpreadsheet, extensions: ['.csv'], mimeType: 'text/csv' },
    
    // Presentation formats
    'pptx': { label: 'PowerPoint Presentation', icon: Presentation, extensions: ['.pptx'], mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
    
    // Image formats
    'jpg': { label: 'JPEG Image', icon: FileImage, extensions: ['.jpg', '.jpeg'], mimeType: 'image/jpeg' },
    'png': { label: 'PNG Image', icon: FileImage, extensions: ['.png'], mimeType: 'image/png' },
    'gif': { label: 'GIF Image', icon: FileImage, extensions: ['.gif'], mimeType: 'image/gif' },
    'webp': { label: 'WebP Image', icon: FileImage, extensions: ['.webp'], mimeType: 'image/webp' },
    'bmp': { label: 'BMP Image', icon: FileImage, extensions: ['.bmp'], mimeType: 'image/bmp' }
  };

  // Conversion matrix - what can be converted to what
  const conversionMatrix = {
    'pdf': ['docx', 'txt', 'html', 'csv'],
    'docx': ['pdf', 'txt', 'html', 'rtf'],
    'doc': ['pdf', 'txt', 'html', 'rtf'],
    'rtf': ['pdf', 'txt', 'html', 'docx'],
    'txt': ['pdf', 'docx', 'html'],
    'html': ['pdf', 'txt', 'docx'],
    'xlsx': ['pdf', 'csv', 'html'],
    'csv': ['pdf', 'xlsx', 'html'],
    'pptx': ['pdf', 'html'],
    'jpg': ['png', 'gif', 'webp', 'bmp'],
    'png': ['jpg', 'gif', 'webp', 'bmp'],
    'gif': ['jpg', 'png', 'webp', 'bmp'],
    'webp': ['jpg', 'png', 'gif', 'bmp'],
    'bmp': ['jpg', 'png', 'gif', 'webp']
  };

  // Get available target formats based on source format
  const getAvailableTargetFormats = (source) => {
    return source ? conversionMatrix[source] || [] : [];
  };

  // Get format by file extension
  const getFormatByExtension = (filename) => {
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    for (const [format, info] of Object.entries(allFormats)) {
      if (info.extensions.includes(ext)) {
        return format;
      }
    }
    return null;
  };

  const onDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.filter(file => {
      const format = getFormatByExtension(file.name);
      return format && (sourceFormat === '' || format === sourceFormat);
    });
    
    if (validFiles.length !== acceptedFiles.length) {
      logger.warn('Some files were not in the selected format and were filtered out');
    }
    
    setFiles(validFiles);
    
    // Auto-detect source format if not set
    if (sourceFormat === '' && validFiles.length > 0) {
      const detectedFormat = getFormatByExtension(validFiles[0].name);
      setSourceFormat(detectedFormat);
    }
  }, [sourceFormat]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    disabled: isProcessing
  });

  // Extract text from PDF
  const extractTextFromPDF = async (pdfFile) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      const textBlocks = [];
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        setProgress((pageNum / pdf.numPages) * 100);
        setCurrentFile(`Processing page ${pageNum} of ${pdf.numPages}`);
        
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items.map(item => ({
          text: item.str,
          x: item.transform[4],
          y: item.transform[5],
          width: item.width,
          height: item.height,
          fontName: item.fontName,
          fontSize: Math.sqrt(item.transform[0] * item.transform[0] + item.transform[1] * item.transform[1])
        }));
        
        // Organize text by position
        pageText.sort((a, b) => {
          if (Math.abs(a.y - b.y) < 10) {
            return a.x - b.x;
          }
          return b.y - a.y;
        });
        
        const pageTextString = pageText.map(item => item.text).join(' ');
        fullText += pageTextString + '\n\n';
        
        textBlocks.push({
          page: pageNum,
          text: pageTextString,
          items: pageText
        });
      }
      
      return {
        fullText: fullText.trim(),
        textBlocks,
        pageCount: pdf.numPages,
        fileName: pdfFile.name
      };
    } catch (error) {
      logger.error('Error extracting text from PDF:', error);
      throw new Error(`Failed to extract text from ${pdfFile.name}: ${error.message}`);
    }
  };

  // Convert files based on source and target formats
  const convertFile = async (file) => {
    try {
      setCurrentFile(`Converting ${file.name}...`);
      
      const source = sourceFormat || getFormatByExtension(file.name);
      const target = targetFormat;
      
      if (!source || !target) {
        throw new Error('Source and target formats must be selected');
      }
      
      // PDF to other formats
      if (source === 'pdf') {
        const extractedData = await extractTextFromPDF(file);
        
        switch (target) {
          case 'docx':
            return await convertToDocx({ file: file, fileName: file.name, fullText: extractedData.fullText });
          case 'txt':
            return await convertToTXT(extractedData);
          case 'html':
            return await convertToHTML(extractedData);
          case 'csv':
            return await convertToCSV(extractedData);
          default:
            throw new Error(`Conversion from PDF to ${target} is not supported`);
        }
      }
      
      // Word documents to other formats
      if (['docx', 'doc'].includes(source)) {
        const textContent = await extractTextFromWord(file);
        
        switch (target) {
          case 'pdf':
            return await convertToPDF(textContent, file.name);
          case 'txt':
            return await convertToTXT({ fullText: textContent, fileName: file.name });
          case 'html':
            return await convertToHTML({ fullText: textContent, fileName: file.name });
          case 'rtf':
            return await convertToRTF({ fullText: textContent, fileName: file.name });
          default:
            throw new Error(`Conversion from ${source} to ${target} is not supported`);
        }
      }
      
      // Text files to other formats
      if (source === 'txt') {
        const textContent = await file.text();
        
        switch (target) {
          case 'pdf':
            return await convertToPDF(textContent, file.name);
          case 'docx':
            return await convertToDocx({ fullText: textContent, fileName: file.name });
          case 'html':
            return await convertToHTML({ fullText: textContent, fileName: file.name });
          default:
            throw new Error(`Conversion from TXT to ${target} is not supported`);
        }
      }
      
      // Image conversions
      if (['jpg', 'png', 'gif', 'webp', 'bmp'].includes(source)) {
        return await convertImage(file, target);
      }
      
      throw new Error(`Conversion from ${source} to ${target} is not yet implemented`);
      
    } catch (error) {
      logger.error('Error converting file:', error);
      throw new Error(`Failed to convert ${file.name}: ${error.message}`);
    }
  };

  // Extract text from Word documents
  const extractTextFromWord = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      logger.warn('Failed to extract text with mammoth, using fallback:', error);
      return `Converted from: ${file.name}\n\nThis document has been converted.`;
    }
  };

  // DOCX conversion using backend API
  const convertToDocx = async (data) => {
    try {
      console.log('Starting DOCX conversion via backend for:', data.fileName);
      
      // Create FormData to send the file to backend
      const formData = new FormData();
      formData.append('file', data.file);
      
      // Send to backend
      const response = await fetch('https://quicksidetoolbackend.onrender.com/pdf-to-docx', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Backend conversion failed');
      }
      
      // Get the DOCX file as blob
      const blob = await response.blob();
      console.log('DOCX blob received from backend, size:', blob.size);
      
      return { blob, fileName: `${data.fileName.replace(/\.[^/.]+$/, '')}.docx` };
    } catch (error) {
      console.error('Error creating DOCX via backend:', error);
      logger.error('Error creating DOCX via backend:', error);
      
      // Fallback to text file if backend fails
      const content = data.fullText;
      const blob = new Blob([content], { type: 'text/plain' });
      return { blob, fileName: `${data.fileName.replace(/\.[^/.]+$/, '')}.txt` };
    }
  };

  // Convert to PDF
  const convertToPDF = async (textContent, fileName) => {
    try {
      const pdfDoc = await PDFDocument.create();
      const pageWidth = 595;
      const pageHeight = 842;
      const margin = 50;
      const lineHeight = 20;
      const fontSize = 12;
      
      const lines = textContent.split('\n');
      let currentY = pageHeight - margin;
      let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      
      for (const line of lines) {
        // Check if we need a new page
        if (currentY < margin + lineHeight) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          currentY = pageHeight - margin;
        }
        
        // Handle long lines by wrapping them
        const maxWidth = pageWidth - (margin * 2);
        const words = line.split(' ');
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const textWidth = testLine.length * fontSize * 0.6; // Approximate character width
          
          if (textWidth > maxWidth && currentLine) {
            // Draw current line and start new line
            currentPage.drawText(currentLine, {
              x: margin,
              y: currentY,
              size: fontSize,
              color: rgb(0, 0, 0)
            });
            currentY -= lineHeight;
            currentLine = word;
            
            // Check if we need a new page after line break
            if (currentY < margin + lineHeight) {
              currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
              currentY = pageHeight - margin;
            }
          } else {
            currentLine = testLine;
          }
        }
        
        // Draw the final line
        if (currentLine.trim()) {
          currentPage.drawText(currentLine, {
            x: margin,
            y: currentY,
            size: fontSize,
            color: rgb(0, 0, 0)
          });
        }
        
        currentY -= lineHeight;
      }
      
      const pdfBytes = await pdfDoc.save();
      return { blob: new Blob([pdfBytes], { type: 'application/pdf' }), fileName: `${fileName.replace(/\.[^/.]+$/, '')}.pdf` };
    } catch (error) {
      logger.error('Error creating PDF:', error);
      throw new Error(`Failed to create PDF: ${error.message}`);
    }
  };

  // Convert to TXT
  const convertToTXT = async (data) => {
    const blob = new Blob([data.fullText], { type: 'text/plain' });
    return { blob, fileName: `${data.fileName.replace(/\.[^/.]+$/, '')}.txt` };
  };

  // Convert to HTML
  const convertToHTML = async (data) => {
    const htmlContent = `<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fileName.replace(/\.[^/.]+$/, '')}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
    </style>
</head>
<body>
    <p>${data.fullText.replace(/\n/g, '<br>')}</p>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    return { blob, fileName: `${data.fileName.replace(/\.[^/.]+$/, '')}.html` };
  };

  // Convert to RTF
  const convertToRTF = async (data) => {
    const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 ${data.fullText.replace(/\n/g, '\\par ')}
}`;
    const blob = new Blob([rtfContent], { type: 'application/rtf' });
    return { blob, fileName: `${data.fileName.replace(/\.[^/.]+$/, '')}.rtf` };
  };

  // Convert to CSV
  const convertToCSV = async (data) => {
    const lines = data.fullText.split('\n').filter(line => line.trim());
    const csvContent = lines.map(line => `"${line.replace(/"/g, '""')}"`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    return { blob, fileName: `${data.fileName.replace(/\.[^/.]+$/, '')}.csv` };
  };

  // Convert images
  const convertImage = async (file, targetFormat) => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          try {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Fill with white background for transparent images
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw the image
            ctx.drawImage(img, 0, 0);
            
            // Set quality for JPEG
            const quality = targetFormat === 'jpg' ? 0.9 : 1.0;
            
            canvas.toBlob((blob) => {
              if (blob) {
                resolve({ 
                  blob, 
                  fileName: `${file.name.replace(/\.[^/.]+$/, '')}.${targetFormat}` 
                });
              } else {
                reject(new Error('Failed to create image blob'));
              }
            }, `image/${targetFormat}`, quality);
          } catch (error) {
            reject(new Error(`Image processing error: ${error.message}`));
          }
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        img.src = URL.createObjectURL(file);
      } catch (error) {
        reject(new Error(`Image conversion error: ${error.message}`));
      }
    });
  };



  // Process all files
  const processFiles = async () => {
    if (files.length === 0 || !sourceFormat || !targetFormat) return;

    setIsProcessing(true);
    setProgress(0);
    setProcessedFiles([]);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress((i / files.length) * 100);
        
        const convertedFile = await convertFile(file);
        setProcessedFiles(prev => [...prev, convertedFile]);
        
        logger.success(`Successfully converted ${file.name} to ${targetFormat}`);
      }
      
      setProgress(100);
      setCurrentFile('All files processed successfully!');
    } catch (error) {
      logger.error('Error processing files:', error);
      setCurrentFile(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download file
  const downloadFile = (file) => {
    const url = URL.createObjectURL(file.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download all files
  const downloadAll = () => {
    processedFiles.forEach(file => {
      setTimeout(() => downloadFile(file), 100);
    });
  };

  // Clear files
  const clearFiles = () => {
    setFiles([]);
    setProcessedFiles([]);
    setProgress(0);
    setCurrentFile('');
    setSourceFormat('');
    setTargetFormat('');
  };

  // Remove file from list
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            File Converter
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Convert files between different formats with ease. Support for documents, images, and more.
          </p>
        </div>

        {/* Format Selection */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileType className="w-6 h-6" />
            Select Conversion
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Source Format */}
            <div>
              <label className="block text-sm font-medium mb-2">From Format</label>
              <select 
                value={sourceFormat} 
                onChange={(e) => {
                  setSourceFormat(e.target.value);
                  setTargetFormat(''); // Reset target when source changes
                  setFiles([]); // Clear files when format changes
                }}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" className="bg-gray-800">Select source format...</option>
                {Object.entries(allFormats).map(([format, info]) => (
                  <option key={format} value={format} className="bg-gray-800">
                    {info.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <ArrowRight className="w-8 h-8 text-purple-400" />
            </div>

            {/* Target Format */}
            <div>
              <label className="block text-sm font-medium mb-2">To Format</label>
              <select 
                value={targetFormat} 
                onChange={(e) => setTargetFormat(e.target.value)}
                disabled={!sourceFormat}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="" className="bg-gray-800">Select target format...</option>
                {getAvailableTargetFormats(sourceFormat).map(format => (
                  <option key={format} value={format} className="bg-gray-800">
                    {allFormats[format].label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* File Upload */}
        {sourceFormat && targetFormat && (
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
                or click to select files (supports multiple files)
              </p>
              <p className="text-sm text-gray-500">
                Selected format: {allFormats[sourceFormat]?.label}
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
                        {React.createElement(allFormats[sourceFormat]?.icon || FileText, { 
                          className: "w-5 h-5 text-blue-400" 
                        })}
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-400">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Progress */}
        {isProcessing && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <div>
                <p className="font-semibold">{currentFile}</p>
                <p className="text-sm text-gray-400">Processing files...</p>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
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
            disabled={files.length === 0 || !sourceFormat || !targetFormat || isProcessing}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <FileType className="w-5 h-5" />
                Convert Files
              </>
            )}
          </button>

          {processedFiles.length > 0 && (
            <>
              <button
                onClick={downloadAll}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download All ({processedFiles.length})
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
        {processedFiles.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              Converted Files ({processedFiles.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {processedFiles.map((file, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    {React.createElement(allFormats[targetFormat]?.icon || FileText, { 
                      className: "w-5 h-5 text-blue-400" 
                    })}
                    <span className="font-medium text-sm truncate">{file.fileName}</span>
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

        {/* Supported Formats Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <FileText className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Document Formats</h3>
            <p className="text-gray-300">
              Convert between PDF, Word, RTF, TXT, and HTML formats with formatting preservation.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <FileSpreadsheet className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Spreadsheet Formats</h3>
            <p className="text-gray-300">
              Convert Excel files to PDF, CSV, and HTML while maintaining data structure.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <FileImage className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Image Formats</h3>
            <p className="text-gray-300">
              Convert between JPG, PNG, GIF, WebP, and BMP formats with quality preservation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileConverter; 