import React, { useState, useCallback } from 'react';
import { Link } from "react-router-dom";
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
  FileText,
  Image,
  Camera,
  Search,
  Copy,
  ArrowLeft,
  X
} from 'lucide-react';
import logger from '../utils/logger';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const OCRProcessor = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [ocrResults, setOcrResults] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('eng');
  const [outputFormat, setOutputFormat] = useState('pdf');

  const languages = [
    { code: 'eng', name: 'English', flag: '🇺🇸' },
    { code: 'spa', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fra', name: 'French', flag: '🇫🇷' },
  ];

  const outputFormats = [
    { value: 'pdf', label: 'Text PDF (.pdf)', icon: FileText },
    { value: 'docx', label: 'Word Document (.docx)', icon: FileText },
    { value: 'txt', label: 'Plain Text (.txt)', icon: FileText },
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

  const performOCR = async (file, pageIndex = 0, totalPages = 1) => {
    try {
      const startTime = Date.now();
      
      if (file.type.startsWith('image/')) {
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
          confidence: result.data.confidence / 100,
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
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(pageIndex + 1);
        
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

  const exportResults = async (format) => {
    if (ocrResults.length === 0) return;

    switch (format) {
      case 'txt': {
        const content = ocrResults.map(result => 
          `=== ${result.fileName} - Page ${result.pageIndex + 1} ===\n${result.text}\n\n`
        ).join('');
        const mimeType = 'text/plain';
        const extension = 'txt';
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ocr_results.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      }
      
      case 'docx': {
        try {
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
          const blob = await Packer.toBlob(doc);
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `ocr_results.docx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } catch (error) {
          logger.error('DOCX export failed:', error);
          setCurrentFile(`Export failed: ${error.message}`);
        }
        return;
      }
      
      case 'pdf': {
        try {
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
          const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
          const link = document.createElement('a');
          link.href = url;
          link.download = `ocr_results.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } catch (error) {
          logger.error('PDF export failed:', error);
          setCurrentFile(`Export failed: ${error.message}`);
        }
        return;
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
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
    if (confidence >= 0.9) return 'text-green-500';
    if (confidence >= 0.8) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SEO
        title="OCR PDF to Word/Text – Convert Scanned PDF to Editable"
        description="Turn scans into editable DOCX or text using OCR. Multilingual, accurate, free."
        url="https://quicksidetool.com/ocr-processor"
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
          <h1 className="h1 text-center">OCR Text Recognition</h1>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="card p-6 mb-8">
            <h2 className="h3 mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-[var(--color-primary)]" />
              OCR Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Document Language</label>
                <select 
                  value={selectedLanguage} 
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="input"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Export Format</label>
                <select 
                  value={outputFormat} 
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="input"
                >
                  {outputFormats.map(format => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="card p-6 mb-8">
            <div
              {...getRootProps()}
              className={`upload-zone p-8 text-center ${isDragActive ? 'drag-active' : ''} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />
              <Camera className="w-16 h-16 mx-auto mb-4 text-[var(--color-primary)]" />
              <p className="text-lg font-semibold text-[var(--color-text)] mb-2">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-[var(--color-text-muted)] mb-4">
                or click to select files (PDF, PNG, JPG, TIFF, BMP)
              </p>
              <p className="text-sm text-[var(--color-text-light)]">Maximum file size: 50MB per file</p>
            </div>

            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Selected Files ({files.length})</h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-alt)]">
                      <div className="flex items-center gap-3">
                        {file.type === 'application/pdf' ? 
                          <FileText className="w-5 h-5 text-[var(--color-primary)]" /> : 
                          <Image className="w-5 h-5 text-green-500" />
                        }
                        <div>
                          <p className="text-sm font-medium text-[var(--color-text)]">{file.name}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFiles(files.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {isProcessing && (
            <div className="card p-6 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
                <div>
                  <p className="font-semibold text-[var(--color-text)]">{currentFile}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">Processing with OCR...</p>
                </div>
              </div>
              <div className="w-full bg-[var(--color-bg-alt)] rounded-full h-2">
                <div 
                  className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">{Math.round(progress)}% complete</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={runOCR}
              disabled={files.length === 0 || isProcessing}
              className="btn-primary"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing OCR...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Start OCR Processing
                </>
              )}
            </button>

            {ocrResults.length > 0 && (
              <>
                <button
                  onClick={() => exportResults(outputFormat)}
                  className="btn-primary"
                >
                  <Download className="h-4 w-4" />
                  Export Results
                </button>
                
                <button
                  onClick={clearResults}
                  className="btn-secondary"
                >
                  Clear All
                </button>
              </>
            )}
          </div>

          {ocrResults.length > 0 && (
            <div className="card p-6">
              <h2 className="h3 mb-6 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                OCR Results ({ocrResults.length} pages processed)
              </h2>
              
              <div className="space-y-6">
                {ocrResults.map((result, index) => (
                  <div key={index} className="border border-[var(--color-border)] rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[var(--color-primary)]" />
                        <div>
                          <h4 className="font-semibold text-[var(--color-text)]">{result.fileName}</h4>
                          <p className="text-sm text-[var(--color-text-muted)]">
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
                          className="p-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-light)]/80 transition-colors"
                          title="Copy to clipboard"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-[var(--color-bg-alt)] rounded-lg p-4 mb-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-text)]">{result.text}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-muted)]">
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
        </div>
      </div>
    </div>
  );
};

export default OCRProcessor;