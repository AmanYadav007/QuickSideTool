import React, { useState, useCallback } from 'react';
import SEO from '../components/SEO';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';
import { 
  Eye, 
  Download, 
  Loader2, 
  CheckCircle, 
  Settings,
  Languages,
  FileText,
  Image,
  Camera,
  Search,
  Copy,
  Share2
} from 'lucide-react';
import logger from '../utils/logger';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const OCRProcessor = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [ocrResults, setOcrResults] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('eng');
  const [ocrMode, setOcrMode] = useState('accurate'); // fast, accurate, best
  const [outputFormat, setOutputFormat] = useState('txt');
  const [confidence, setConfidence] = useState(0.8);
  const [extractTables, setExtractTables] = useState(true);
  const [preserveLayout, setPreserveLayout] = useState(true);

  // `code` values are Tesseract traineddata names (https://github.com/tesseract-ocr/tessdata).
  // tesseract.js downloads `<code>.traineddata.gz` on demand, so these must not be ISO-639-1 codes.
  const languages = [
    { code: 'eng', name: 'English', flag: '🇺🇸' },
    { code: 'spa', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fra', name: 'French', flag: '🇫🇷' },
    { code: 'deu', name: 'German', flag: '🇩🇪' },
    { code: 'ita', name: 'Italian', flag: '🇮🇹' },
    { code: 'por', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'rus', name: 'Russian', flag: '🇷🇺' },
    { code: 'chi_sim', name: 'Chinese (Simplified)', flag: '🇨🇳' },
    { code: 'chi_tra', name: 'Chinese (Traditional)', flag: '🇹🇼' },
    { code: 'jpn', name: 'Japanese', flag: '🇯🇵' },
    { code: 'kor', name: 'Korean', flag: '🇰🇷' },
    { code: 'ara', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hin', name: 'Hindi', flag: '🇮🇳' },
    { code: 'tha', name: 'Thai', flag: '🇹🇭' },
    { code: 'vie', name: 'Vietnamese', flag: '🇻🇳' },
    { code: 'nld', name: 'Dutch', flag: '🇳🇱' },
    { code: 'pol', name: 'Polish', flag: '🇵🇱' },
    { code: 'tur', name: 'Turkish', flag: '🇹🇷' },
    { code: 'swe', name: 'Swedish', flag: '🇸🇪' },
    { code: 'dan', name: 'Danish', flag: '🇩🇰' },
    { code: 'nor', name: 'Norwegian', flag: '🇳🇴' },
    { code: 'fin', name: 'Finnish', flag: '🇫🇮' },
    { code: 'ces', name: 'Czech', flag: '🇨🇿' },
    { code: 'hun', name: 'Hungarian', flag: '🇭🇺' },
    { code: 'ron', name: 'Romanian', flag: '🇷🇴' },
    { code: 'bul', name: 'Bulgarian', flag: '🇧🇬' },
    { code: 'hrv', name: 'Croatian', flag: '🇭🇷' },
    { code: 'slk', name: 'Slovak', flag: '🇸🇰' },
    { code: 'slv', name: 'Slovenian', flag: '🇸🇮' },
    { code: 'est', name: 'Estonian', flag: '🇪🇪' },
    { code: 'lav', name: 'Latvian', flag: '🇱🇻' },
    { code: 'lit', name: 'Lithuanian', flag: '🇱🇹' },
    { code: 'mlt', name: 'Maltese', flag: '🇲🇹' },
    { code: 'ell', name: 'Greek', flag: '🇬🇷' },
    { code: 'heb', name: 'Hebrew', flag: '🇮🇱' },
    { code: 'fas', name: 'Persian', flag: '🇮🇷' },
    { code: 'urd', name: 'Urdu', flag: '🇵🇰' },
    { code: 'ben', name: 'Bengali', flag: '🇧🇩' },
    { code: 'tam', name: 'Tamil', flag: '🇮🇳' },
    { code: 'tel', name: 'Telugu', flag: '🇮🇳' },
    { code: 'mal', name: 'Malayalam', flag: '🇮🇳' },
    { code: 'kan', name: 'Kannada', flag: '🇮🇳' },
    { code: 'guj', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'pan', name: 'Punjabi', flag: '🇮🇳' },
    { code: 'mar', name: 'Marathi', flag: '🇮🇳' },
    { code: 'ori', name: 'Odia', flag: '🇮🇳' },
    { code: 'asm', name: 'Assamese', flag: '🇮🇳' },
    { code: 'nep', name: 'Nepali', flag: '🇳🇵' },
    { code: 'sin', name: 'Sinhala', flag: '🇱🇰' },
    { code: 'mya', name: 'Burmese', flag: '🇲🇲' },
    { code: 'khm', name: 'Khmer', flag: '🇰🇭' },
    { code: 'lao', name: 'Lao', flag: '🇱🇦' },
    { code: 'kat', name: 'Georgian', flag: '🇬🇪' },
    { code: 'amh', name: 'Amharic', flag: '🇪🇹' },
    { code: 'swa', name: 'Swahili', flag: '🇹🇿' },
    { code: 'afr', name: 'Afrikaans', flag: '🇿🇦' },
    { code: 'ind', name: 'Indonesian', flag: '🇮🇩' },
    { code: 'msa', name: 'Malay', flag: '🇲🇾' },
    { code: 'fil', name: 'Filipino', flag: '🇵🇭' },
    { code: 'ukr', name: 'Ukrainian', flag: '🇺🇦' },
    { code: 'bel', name: 'Belarusian', flag: '🇧🇾' },
    { code: 'mkd', name: 'Macedonian', flag: '🇲🇰' },
    { code: 'sqi', name: 'Albanian', flag: '🇦🇱' },
    { code: 'bos', name: 'Bosnian', flag: '🇧🇦' },
    { code: 'srp', name: 'Serbian', flag: '🇷🇸' }
  ];

  const ocrModes = [
    { value: 'fast', label: 'Fast Processing', description: 'Quick OCR with basic accuracy', speed: '⚡ Fast' },
    { value: 'accurate', label: 'High Accuracy', description: 'Balanced speed and accuracy', speed: '⚖️ Balanced' },
    { value: 'best', label: 'Best Quality', description: 'Maximum accuracy, slower processing', speed: '🎯 Best' }
  ];

  const outputFormats = [
    { value: 'txt', label: 'Plain Text (.txt)', icon: FileText },
    { value: 'docx', label: 'Word Document (.docx)', icon: FileText },
    { value: 'pdf', label: 'Text PDF (.pdf)', icon: FileText },
    { value: 'json', label: 'Structured JSON (.json)', icon: FileText },
    { value: 'csv', label: 'CSV Spreadsheet (.csv)', icon: FileText },
    { value: 'html', label: 'HTML Document (.html)', icon: FileText }
  ];

  const onDrop = useCallback((acceptedFiles) => {
    const supportedFiles = acceptedFiles.filter(file => 
      file.type === 'application/pdf' || 
      file.type.startsWith('image/')
    );
    setFiles(supportedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif']
    },
    multiple: true,
    disabled: isProcessing
  });

  // Real OCR processing using Tesseract.js
  const performOCR = async (file, pageIndex = 0, totalPages = 1) => {
    try {
      const startTime = Date.now();
      
      if (file.type.startsWith('image/')) {
        // Process image directly
        const result = await Tesseract.recognize(
          file,
          selectedLanguage,
          {
            logger: m => {
              if (m.status === 'recognizing text') {
                setProgress((m.progress * 100) / totalPages);
              }
            }
          }
        );
        
        const processingTime = Date.now() - startTime;
        
        return {
          text: result.data.text,
          confidence: result.data.confidence / 100, // Convert to 0-1 scale
          language: selectedLanguage,
          pageIndex,
          totalPages,
          fileName: file.name,
          fileType: file.type,
          processingTime,
          wordCount: result.data.text.split(' ').length,
          characterCount: result.data.text.length
        };
      } else {
        // For PDFs, we'll extract images and process them
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(pageIndex + 1);
        
        // Get page as image (this is a simplified approach)
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        // Convert canvas to blob and process with OCR
        return new Promise((resolve) => {
          canvas.toBlob(async (blob) => {
            const result = await Tesseract.recognize(
              blob,
              selectedLanguage,
              {
                logger: m => {
                  if (m.status === 'recognizing text') {
                    setProgress((m.progress * 100) / totalPages);
                  }
                }
              }
            );
            
            const processingTime = Date.now() - startTime;
            
            resolve({
              text: result.data.text,
              confidence: result.data.confidence / 100,
              language: selectedLanguage,
              pageIndex,
              totalPages,
              fileName: file.name,
              fileType: file.type,
              processingTime,
              wordCount: result.data.text.split(' ').length,
              characterCount: result.data.text.length
            });
          }, 'image/png');
        });
      }
    } catch (error) {
      logger.error('OCR processing error:', error);
      throw new Error(`OCR failed for ${file.name}: ${error.message}`);
    }
  };

  const processFile = async (file) => {
    try {
      if (file.type === 'application/pdf') {
        // Process PDF pages
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const totalPages = pdf.numPages;
        
        const results = [];
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          setProgress((pageNum / totalPages) * 100);
          setCurrentFile(`Processing page ${pageNum} of ${totalPages} in ${file.name}`);
          
          const result = await performOCR(file, pageNum - 1, totalPages);
          results.push(result);
        }
        return results;
      } else {
        // Process single image
        setCurrentFile(`Processing image: ${file.name}`);
        const result = await performOCR(file, 0, 1);
        return [result];
      }
    } catch (error) {
      logger.error('Error processing file:', error);
      throw new Error(`Failed to process ${file.name}: ${error.message}`);
    }
  };

  const runOCR = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setOcrResults([]);

    try {
      const allResults = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentFile(`Starting OCR on ${file.name}...`);
        
        const fileResults = await processFile(file);
        allResults.push(...fileResults);
        
        setProgress(((i + 1) / files.length) * 100);
      }
      
      setOcrResults(allResults);
      setCurrentFile('OCR processing completed successfully!');
      logger.success(`OCR completed for ${files.length} files`);
    } catch (error) {
      logger.error('OCR processing error:', error);
      setCurrentFile(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const buildDocxBlob = async () => {
    const { Document, Packer, Paragraph, HeadingLevel, TextRun } = await import('docx');
    const children = [];
    ocrResults.forEach((result) => {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          text: `${result.fileName} - Page ${result.pageIndex + 1}`,
        })
      );
      (result.text || '').split('\n').forEach((line) => {
        children.push(new Paragraph({ children: [new TextRun(line)] }));
      });
      children.push(new Paragraph({ text: '' }));
    });
    const doc = new Document({ sections: [{ children }] });
    return Packer.toBlob(doc);
  };

  const buildPdfBlob = async () => {
    const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;
    const margin = 50;
    const pageWidth = 595;
    const pageHeight = 842;
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = fontSize * 1.4;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;
    const newPage = () => {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    };
    // pdf-lib's StandardFonts only support WinAnsi; drop characters it cannot encode.
    // eslint-disable-next-line no-control-regex
    const sanitize = (s) => (s || '').replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, '?');
    const drawLine = (text, size = fontSize) => {
      if (y < margin + lineHeight) newPage();
      page.drawText(text, { x: margin, y, size, font, color: rgb(0, 0, 0) });
      y -= lineHeight;
    };
    const wrap = (text) => {
      const words = sanitize(text).split(/\s+/);
      let current = '';
      const lines = [];
      words.forEach((word) => {
        const candidate = current ? `${current} ${word}` : word;
        if (font.widthOfTextAtSize(candidate, fontSize) > maxWidth && current) {
          lines.push(current);
          current = word;
        } else {
          current = candidate;
        }
      });
      if (current) lines.push(current);
      return lines.length ? lines : [''];
    };

    ocrResults.forEach((result) => {
      drawLine(sanitize(`${result.fileName} - Page ${result.pageIndex + 1}`), 13);
      y -= lineHeight * 0.3;
      (result.text || '').split('\n').forEach((rawLine) => {
        wrap(rawLine).forEach((line) => drawLine(line));
      });
      y -= lineHeight;
    });

    const bytes = await pdfDoc.save();
    return new Blob([bytes], { type: 'application/pdf' });
  };

  const exportResults = async (format) => {
    if (ocrResults.length === 0) return;

    let content = '';
    let mimeType = '';
    let extension = '';
    let blobOverride = null;

    switch (format) {
      case 'txt':
        content = ocrResults.map(result => 
          `=== ${result.fileName} - Page ${result.pageIndex + 1} ===\n${result.text}\n\n`
        ).join('');
        mimeType = 'text/plain';
        extension = 'txt';
        break;
      
      case 'json':
        content = JSON.stringify(ocrResults, null, 2);
        mimeType = 'application/json';
        extension = 'json';
        break;
      
      case 'csv':
        content = 'FileName,Page,Text,Confidence,Language,WordCount,CharacterCount\n';
        content += ocrResults.map(result => 
          `"${result.fileName}",${result.pageIndex + 1},"${result.text.replace(/"/g, '""')}",${result.confidence},${result.language},${result.wordCount},${result.characterCount}`
        ).join('\n');
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      
      case 'html':
        content = `<!DOCTYPE html>
<html lang="${selectedLanguage}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OCR Results</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        .page { page-break-after: always; margin-bottom: 20px; }
        .page:last-child { page-break-after: avoid; }
        .header { background: #f0f0f0; padding: 10px; margin-bottom: 10px; border-radius: 5px; }
        .confidence { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    ${ocrResults.map(result => 
      `<div class="page">
        <div class="header">
          <h2>${result.fileName} - Page ${result.pageIndex + 1}</h2>
          <div class="confidence">
            Confidence: ${(result.confidence * 100).toFixed(1)}% | 
            Language: ${languages.find(l => l.code === result.language)?.name || result.language} | 
            Words: ${result.wordCount} | 
            Characters: ${result.characterCount}
          </div>
        </div>
        <p>${result.text.replace(/\n/g, '<br>')}</p>
      </div>`
    ).join('')}
</body>
</html>`;
        mimeType = 'text/html';
        extension = 'html';
        break;
      
      case 'docx':
        try {
          blobOverride = await buildDocxBlob();
        } catch (error) {
          logger.error('DOCX export failed:', error);
          setCurrentFile(`Export failed: ${error.message}`);
          return;
        }
        extension = 'docx';
        break;

      case 'pdf':
        try {
          blobOverride = await buildPdfBlob();
        } catch (error) {
          logger.error('PDF export failed:', error);
          setCurrentFile(`Export failed: ${error.message}`);
          return;
        }
        extension = 'pdf';
        break;

      default:
        return;
    }

    const blob = blobOverride || new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ocr_results.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show success message
      logger.success('Text copied to clipboard');
    });
  };

  const clearResults = () => {
    setFiles([]);
    setOcrResults([]);
    setProgress(0);
    setCurrentFile('');
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.8) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <SEO
        title="OCR PDF to Word/Text – Convert Scanned PDF to Editable"
        description="Turn scans into editable DOCX or text using OCR. Multilingual, accurate, free."
        url="https://quicksidetool.com/ocr-processor"
      />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            OCR Text Recognition
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Convert scanned documents, images, and PDFs into searchable text with Adobe-level accuracy. 
            Support for 50+ languages and advanced text recognition.
          </p>
        </div>

        {/* Settings Panel */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            OCR Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Document Language</label>
              <select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-gray-800">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* OCR Mode */}
            <div>
              <label className="block text-sm font-medium mb-2">Processing Mode</label>
              <select 
                value={ocrMode} 
                onChange={(e) => setOcrMode(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {ocrModes.map(mode => (
                  <option key={mode.value} value={mode.value} className="bg-gray-800">
                    {mode.speed} {mode.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Output Format */}
            <div>
              <label className="block text-sm font-medium mb-2">Export Format</label>
              <select 
                value={outputFormat} 
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {outputFormats.map(format => (
                  <option key={format.value} value={format.value} className="bg-gray-800">
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Confidence Threshold */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Confidence Threshold: {(confidence * 100).toFixed(0)}%
              </label>
              <input 
                type="range" 
                min="0.5" 
                max="1" 
                step="0.05"
                value={confidence} 
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Options */}
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={extractTables}
                  onChange={(e) => setExtractTables(e.target.checked)}
                  className="rounded border-white/20 bg-white/10"
                />
                <span className="text-sm">Extract Tables</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={preserveLayout}
                  onChange={(e) => setPreserveLayout(e.target.checked)}
                  className="rounded border-white/20 bg-white/10"
                />
                <span className="text-sm">Preserve Layout</span>
              </label>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
              isDragActive 
                ? 'border-green-400 bg-green-400/10' 
                : 'border-white/30 hover:border-green-400 hover:bg-green-400/10'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <Camera className="w-16 h-16 mx-auto mb-4 text-green-400" />
            <p className="text-xl font-semibold mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-gray-400 mb-4">
              or click to select files (PDF, PNG, JPG, TIFF, BMP)
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
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      {file.type === 'application/pdf' ? 
                        <FileText className="w-5 h-5 text-blue-400" /> : 
                        <Image className="w-5 h-5 text-green-400" />
                      }
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-gray-400">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
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
              <Loader2 className="w-6 h-6 animate-spin text-green-400" />
              <div>
                <p className="font-semibold">{currentFile}</p>
                <p className="text-sm text-gray-400">Processing with OCR...</p>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">{Math.round(progress)}% complete</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={runOCR}
            disabled={files.length === 0 || isProcessing}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing OCR...
              </>
            ) : (
              <>
                <Eye className="w-5 h-5" />
                Start OCR Processing
              </>
            )}
          </button>

          {ocrResults.length > 0 && (
            <>
              <button
                onClick={() => exportResults(outputFormat)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export Results
              </button>
              
              <button
                onClick={clearResults}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Clear All
              </button>
            </>
          )}
        </div>

        {/* Results */}
        {ocrResults.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              OCR Results ({ocrResults.length} pages processed)
            </h3>
            
            <div className="space-y-6">
              {ocrResults.map((result, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <div>
                        <h4 className="font-semibold">{result.fileName}</h4>
                        <p className="text-sm text-gray-400">
                          Page {result.pageIndex + 1} of {result.totalPages}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                        {(result.confidence * 100).toFixed(1)}% confidence
                      </span>
                      <button
                        onClick={() => copyToClipboard(result.text)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 rounded-lg p-4 mb-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.text}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span>Language: {languages.find(l => l.code === result.language)?.name || result.language}</span>
                    <span>Words: {result.wordCount}</span>
                    <span>Characters: {result.characterCount}</span>
                    <span>Processing time: {(result.processingTime / 1000).toFixed(1)}s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Languages className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">50+ Languages</h3>
            <p className="text-gray-300">
              Support for major world languages including Asian scripts, Arabic, and European languages.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Search className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">High Accuracy</h3>
            <p className="text-gray-300">
              Adobe-level OCR accuracy with confidence scoring and multiple processing modes.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Share2 className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Multiple Formats</h3>
            <p className="text-gray-300">
              Export to Word, PDF, HTML, JSON, CSV, or plain text with preserved formatting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OCRProcessor; 
