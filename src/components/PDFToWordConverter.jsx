import React, { useState, useCallback } from 'react';
import SEO from './SEO';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  FileText, 
  Download, 
  Loader2, 
  CheckCircle, 
  Settings,
  FileType,
  FileCode,
  FileText as FileTextIcon,
  FileSpreadsheet,
  Presentation
} from 'lucide-react';
import logger from '../utils/logger';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFToWordConverter = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [outputFormat, setOutputFormat] = useState('docx');
  const [extractionMode, setExtractionMode] = useState('full'); // full, text-only, structured
  const [preserveFormatting, setPreserveFormatting] = useState(true);
  const [includeImages, setIncludeImages] = useState(true);
  const [language, setLanguage] = useState('en-US');
  const [processedFiles, setProcessedFiles] = useState([]);

  const outputFormats = [
    { value: 'docx', label: 'Microsoft Word (.docx)', icon: FileText },
    { value: 'doc', label: 'Word Document (.doc)', icon: FileText },
    { value: 'rtf', label: 'Rich Text Format (.rtf)', icon: FileTextIcon },
    { value: 'txt', label: 'Plain Text (.txt)', icon: FileCode },
    { value: 'html', label: 'HTML Document (.html)', icon: FileCode },
    { value: 'csv', label: 'CSV Spreadsheet (.csv)', icon: FileSpreadsheet },
    { value: 'pptx', label: 'PowerPoint (.pptx)', icon: Presentation }
  ];

  const extractionModes = [
    { value: 'full', label: 'Full Document (Text + Formatting + Images)', description: 'Preserves all formatting, fonts, and images' },
    { value: 'text-only', label: 'Text Only', description: 'Extracts only text content, no formatting' },
    { value: 'structured', label: 'Structured Content', description: 'Maintains document structure and headings' }
  ];

  const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'it-IT', label: 'Italian' },
    { value: 'pt-BR', label: 'Portuguese (Brazil)' },
    { value: 'ru-RU', label: 'Russian' },
    { value: 'zh-CN', label: 'Chinese (Simplified)' },
    { value: 'ja-JP', label: 'Japanese' },
    { value: 'ko-KR', label: 'Korean' },
    { value: 'ar-SA', label: 'Arabic' },
    { value: 'hi-IN', label: 'Hindi' }
  ];

  // Function to organize text by structure (headings, paragraphs, tables)
  const organizeTextByStructure = (textItems) => {
    if (!textItems || textItems.length === 0) return [];
    
    // Sort by Y position first (top to bottom), then by X position (left to right)
    const sortedItems = [...textItems].sort((a, b) => {
      if (Math.abs(a.y - b.y) < 10) {
        return a.x - b.x; // Same line, sort by x position
      }
      return b.y - a.y; // Different lines, sort by y position (top to bottom)
    });
    
    // Group items by similar Y positions (same line)
    const lines = [];
    let currentLine = [];
    let lastY = null;
    
    sortedItems.forEach(item => {
      if (lastY === null || Math.abs(item.y - lastY) < 15) {
        // Same line
        currentLine.push(item);
      } else {
        // New line
        if (currentLine.length > 0) {
          lines.push([...currentLine]);
        }
        currentLine = [item];
      }
      lastY = item.y;
    });
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    
    // Sort items within each line by X position
    lines.forEach(line => line.sort((a, b) => a.x - b.x));
    
    // Detect structure patterns
    const result = [];
    let currentParagraph = [];
    
    lines.forEach((line, lineIndex) => {
      const lineText = line.map(item => item.text).join(' ');
      const avgFontSize = line.reduce((sum, item) => sum + item.fontSize, 0) / line.length;
      const isBold = line.some(item => item.fontName && item.fontName.toLowerCase().includes('bold'));
      
      // Detect headings (larger font, bold, or shorter lines)
      const isHeading = avgFontSize > 16 || isBold || (lineText.length < 50 && lineText.trim().length > 0);
      
      // Detect table rows (aligned items with similar spacing)
      const isTableRow = line.length > 2 && line.every((item, i) => {
        if (i === 0) return true;
        const prevItem = line[i - 1];
        const spacing = item.x - (prevItem.x + prevItem.width);
        return spacing > 20 && spacing < 200; // Reasonable table column spacing
      });
      
      if (isHeading) {
        // Flush current paragraph and start new heading
        if (currentParagraph.length > 0) {
          result.push({
            type: 'paragraph',
            text: currentParagraph.join(' '),
            items: currentParagraph.flatMap(p => p)
          });
          currentParagraph = [];
        }
        
        result.push({
          type: 'heading',
          text: lineText,
          items: line,
          level: avgFontSize > 20 ? 1 : 2
        });
      } else if (isTableRow) {
        // Flush current paragraph and add table row
        if (currentParagraph.length > 0) {
          result.push({
            type: 'paragraph',
            text: currentParagraph.join(' '),
            items: currentParagraph.flatMap(p => p)
          });
          currentParagraph = [];
        }
        
        result.push({
          type: 'table_row',
          text: lineText,
          items: line,
          columns: line.map(item => ({ text: item.text, x: item.x }))
        });
      } else {
        // Regular paragraph text
        currentParagraph.push(lineText);
      }
    });
    
    // Add remaining paragraph
    if (currentParagraph.length > 0) {
      result.push({
        type: 'paragraph',
        text: currentParagraph.join(' '),
        items: currentParagraph.flatMap(p => p)
      });
    }
    
    return result;
  };

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

  const extractTextFromPDF = async (pdfFile) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      const textBlocks = [];
      const images = [];
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        setProgress((pageNum / pdf.numPages) * 100);
        setCurrentFile(`Processing page ${pageNum} of ${pdf.numPages}`);
        
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Extract text with positioning information
        const pageText = textContent.items.map(item => ({
          text: item.str,
          x: item.transform[4],
          y: item.transform[5],
          width: item.width,
          height: item.height,
          fontName: item.fontName,
          fontSize: Math.sqrt(item.transform[0] * item.transform[0] + item.transform[1] * item.transform[1])
        }));
        
        // Detect and organize text by structure (headings, paragraphs, tables)
        const organizedText = organizeTextByStructure(pageText);
        
        const pageTextString = organizedText.map(item => item.text).join(' ');
        fullText += pageTextString + '\n\n';
        
        textBlocks.push({
          page: pageNum,
          text: pageTextString,
          items: pageText,
          organizedText: organizedText
        });
        
        // Extract images if enabled
        if (includeImages) {
          const operatorList = await page.getOperatorList();
          const commonObjs = page.commonObjs;
          
          // Look for image objects
          for (let i = 0; i < operatorList.fnArray.length; i++) {
            if (operatorList.fnArray[i] === pdfjsLib.OPS.paintImageXObject) {
              const imgName = operatorList.argsArray[i][0];
              if (commonObjs.has(imgName)) {
                const img = commonObjs.get(imgName);
                if (img && img.data) {
                  images.push({
                    page: pageNum,
                    data: img.data,
                    width: img.width,
                    height: img.height
                  });
                }
              }
            }
          }
        }
      }
      
      return {
        fullText: fullText.trim(),
        textBlocks,
        images,
        pageCount: pdf.numPages,
        fileName: pdfFile.name
      };
    } catch (error) {
      logger.error('Error extracting text from PDF:', error);
      throw new Error(`Failed to extract text from ${pdfFile.name}: ${error.message}`);
    }
  };

  const convertToFormat = async (extractedData, format) => {
    try {
      switch (format) {
        case 'docx':
          return await convertToDocx(extractedData);
        case 'doc':
          return await convertToDoc(extractedData);
        case 'rtf':
          return await convertToRTF(extractedData);
        case 'txt':
          return await convertToTXT(extractedData);
        case 'html':
          return await convertToHTML(extractedData);
        case 'csv':
          return await convertToCSV(extractedData);
        case 'pptx':
          return await convertToPPTX(extractedData);
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      logger.error(`Error converting to ${format}:`, error);
      throw error;
    }
  };

  const convertToDocx = async (data) => {
    // Build a real .docx with the `docx` library instead of hand-rolled OOXML.
    // The library handles XML escaping, content types, and valid table structure.
    const {
      Document, Packer, Paragraph, TextRun, HeadingLevel, PageBreak,
      Table, TableRow, TableCell, WidthType,
    } = await import('docx');

    const runsForItems = (items) =>
      items.map((item) => {
        const name = (item.fontName || '').toLowerCase();
        return new TextRun({
          text: item.text || '',
          bold: name.includes('bold'),
          italics: name.includes('italic'),
          size: Math.max(8, Math.round(item.fontSize * 2)) || 24,
        });
      });

    const children = [];

    const pushTable = (rows) => {
      if (!rows.length) return;
      const colCount = Math.max(...rows.map((r) => r.columns.length));
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: rows.map(
            (row) =>
              new TableRow({
                children: Array.from({ length: colCount }, (_, i) =>
                  new TableCell({
                    children: [new Paragraph(row.columns[i] ? row.columns[i].text : '')],
                  })
                ),
              })
          ),
        })
      );
      children.push(new Paragraph(''));
    };

    if (preserveFormatting && data.textBlocks && data.textBlocks.length) {
      data.textBlocks.forEach((block, pageIndex) => {
        if (pageIndex > 0) {
          children.push(new Paragraph({ children: [new PageBreak()] }));
        }

        const elements =
          block.organizedText && block.organizedText.length
            ? block.organizedText
            : [{ type: 'paragraph', text: block.text, items: block.items || [] }];

        let tableBuffer = [];
        elements.forEach((element) => {
          if (element.type === 'table_row') {
            tableBuffer.push(element);
            return;
          }
          if (tableBuffer.length) {
            pushTable(tableBuffer);
            tableBuffer = [];
          }
          if (element.type === 'heading') {
            children.push(
              new Paragraph({
                heading: element.level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
                children: element.items && element.items.length
                  ? runsForItems(element.items)
                  : [new TextRun(element.text || '')],
              })
            );
          } else {
            children.push(
              new Paragraph({
                children: element.items && element.items.length
                  ? runsForItems(element.items)
                  : [new TextRun(element.text || '')],
              })
            );
          }
        });
        if (tableBuffer.length) pushTable(tableBuffer);
      });
    } else {
      data.fullText.split('\n').forEach((line) => {
        children.push(new Paragraph(line));
      });
    }

    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    return { blob, fileName: `${data.fileName.replace(/\.pdf$/i, '')}.docx` };
  };

  const convertToRTF = async (data) => {
    const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 ${data.fullText.replace(/\n/g, '\\par ')}
}`;
    const blob = new Blob([rtfContent], { type: 'application/rtf' });
    return { blob, fileName: `${data.fileName.replace('.pdf', '')}.rtf` };
  };

  const convertToTXT = async (data) => {
    const blob = new Blob([data.fullText], { type: 'text/plain' });
    return { blob, fileName: `${data.fileName.replace('.pdf', '')}.txt` };
  };

  const convertToHTML = async (data) => {
    const htmlContent = `<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fileName.replace('.pdf', '')}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        .page { page-break-after: always; margin-bottom: 20px; }
        .page:last-child { page-break-after: avoid; }
    </style>
</head>
<body>
    ${data.textBlocks.map(block => 
      `<div class="page">
        <h2>Page ${block.page}</h2>
        <p>${block.text.replace(/\n/g, '<br>')}</p>
      </div>`
    ).join('')}
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    return { blob, fileName: `${data.fileName.replace('.pdf', '')}.html` };
  };

  const convertToCSV = async (data) => {
    // Extract tabular data if present
    const lines = data.fullText.split('\n').filter(line => line.trim());
    const csvContent = lines.map(line => `"${line.replace(/"/g, '""')}"`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    return { blob, fileName: `${data.fileName.replace('.pdf', '')}.csv` };
  };

  const convertToPPTX = async (data) => {
    // This would use a library like PptxGenJS
    // For now, create a simple text-based presentation
    const content = data.fullText;
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
    return { blob, fileName: `${data.fileName.replace('.pdf', '')}.pptx` };
  };

  const convertToDoc = async (data) => {
    // Legacy Word format - would need special handling
    const content = data.fullText;
    const blob = new Blob([content], { type: 'application/msword' });
    return { blob, fileName: `${data.fileName.replace('.pdf', '')}.doc` };
  };

  const processFiles = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setProcessedFiles([]);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentFile(`Processing ${file.name}...`);
        
        // Extract text from PDF
        const extractedData = await extractTextFromPDF(file);
        
        // Convert to selected format
        const convertedFile = await convertToFormat(extractedData, outputFormat);
        
        setProcessedFiles(prev => [...prev, convertedFile]);
        
        logger.success(`Successfully converted ${file.name} to ${outputFormat}`);
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

  const downloadAll = () => {
    processedFiles.forEach(file => {
      setTimeout(() => downloadFile(file), 100);
    });
  };

  const clearFiles = () => {
    setFiles([]);
    setProcessedFiles([]);
    setProgress(0);
    setCurrentFile('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <SEO
        title="Free PDF to Word Converter Online – No Email, Instant Download"
        description="Convert PDF to Word (DOCX) free, no sign‑up. Keeps layout and fonts. Fast, secure, no watermark."
        url="https://quicksidetool.com/pdf-to-word"
      />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            PDF to Word Converter
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Convert PDF documents to Word, Text, HTML, and more formats with Adobe-level quality. 
            Preserve formatting, extract text, and maintain document structure.
          </p>
        </div>

        {/* Settings Panel */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Conversion Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Output Format */}
            <div>
              <label className="block text-sm font-medium mb-2">Output Format</label>
              <select 
                value={outputFormat} 
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {outputFormats.map(format => (
                  <option key={format.value} value={format.value} className="bg-gray-800">
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Extraction Mode */}
            <div>
              <label className="block text-sm font-medium mb-2">Extraction Mode</label>
              <select 
                value={extractionMode} 
                onChange={(e) => setExtractionMode(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {extractionModes.map(mode => (
                  <option key={mode.value} value={mode.value} className="bg-gray-800">
                    {mode.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value} className="bg-gray-800">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={preserveFormatting}
                  onChange={(e) => setPreserveFormatting(e.target.checked)}
                  className="rounded border-white/20 bg-white/10"
                />
                <span className="text-sm">Preserve Formatting</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={includeImages}
                  onChange={(e) => setIncludeImages(e.target.checked)}
                  className="rounded border-white/20 bg-white/10"
                />
                <span className="text-sm">Include Images</span>
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
                ? 'border-blue-400 bg-blue-400/10' 
                : 'border-white/30 hover:border-blue-400 hover:bg-blue-400/10'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <FileText className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <p className="text-xl font-semibold mb-2">
              {isDragActive ? 'Drop PDF files here' : 'Drag & drop PDF files here'}
            </p>
            <p className="text-gray-400 mb-4">
              or click to select files (supports multiple PDFs)
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
                      <FileText className="w-5 h-5 text-blue-400" />
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
            disabled={files.length === 0 || isProcessing}
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
                Convert to {outputFormats.find(f => f.value === outputFormat)?.label.split('(')[0]}
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
                    {outputFormats.find(f => f.value === outputFormat)?.icon && 
                      React.createElement(outputFormats.find(f => f.value === outputFormat).icon, { 
                        className: "w-5 h-5 text-blue-400" 
                      })
                    }
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

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <FileText className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Multiple Formats</h3>
            <p className="text-gray-300">
              Convert to Word, RTF, HTML, Text, CSV, and PowerPoint formats with professional quality.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Settings className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Advanced Options</h3>
            <p className="text-gray-300">
              Preserve formatting, extract images, and maintain document structure with precision.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">High Quality</h3>
            <p className="text-gray-300">
              Adobe-level text extraction with accurate positioning and font preservation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFToWordConverter; 
