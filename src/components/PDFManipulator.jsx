import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument } from 'pdf-lib';
import { FileText, Trash2, Download, ArrowLeft, CheckSquare } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Progress Modal Component
const ProgressModal = ({ progress, status, currentPage, totalPages, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
      <h3 className="text-xl font-semibold mb-4">Creating PDF</h3>
      
      {/* Main progress */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Overall Progress</span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current status */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-1">{status}</div>
        <div className="text-sm font-medium">
          Processing page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Time estimate */}
      {progress > 0 && progress < 100 && (
        <div className="text-sm text-gray-500 mb-4">
          Please keep this window open. Large PDFs may take several minutes.
        </div>
      )}

      {/* Cancel button */}
      <button
        onClick={onCancel}
        className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        Cancel
      </button>
    </div>
  </div>
);

const App = () => {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedPages, setSelectedPages] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [processedPages, setProcessedPages] = useState(new Map());

  const onDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) {
      return;
    }

    const items = pages.filter((_, idx) => idx !== draggedItem);
    items.splice(index, 0, pages[draggedItem]);

    setPages(items);
    setDraggedItem(index);
  };

  const onDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSelectAll = () => {
    if (selectedPages.length === pages.length) {
      // If all pages are selected, deselect all
      setSelectedPages([]);
    } else {
      // Select all pages
      setSelectedPages(pages.map((_, index) => index));
    }
  };

 // Optimized page deletion
 const handleDeletePages = useCallback(() => {
  setIsLoading(true);
  try {
    // Create new processed pages map
    const newProcessedPages = new Map(processedPages);
    
    // Remove deleted pages from the map
    selectedPages.forEach(index => {
      newProcessedPages.delete(pages[index].pageIndex);
    });
    
    // Update pages array
    const remainingPages = pages.filter((_, index) => !selectedPages.includes(index));
    
    // Update states
    setProcessedPages(newProcessedPages);
    setPages(remainingPages);
    setSelectedPages([]);
    setIsDeleteMode(false);
  } catch (error) {
    console.error('Error deleting pages:', error);
  } finally {
    setIsLoading(false);
  }
}, [selectedPages, pages, processedPages]);



  const processFile = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const newPages = [];

      const CHUNK_SIZE = 5;
      const chunks = Math.ceil(totalPages / CHUNK_SIZE);

      for (let chunk = 0; chunk < chunks; chunk++) {
        const startPage = chunk * CHUNK_SIZE;
        const endPage = Math.min((chunk + 1) * CHUNK_SIZE, totalPages);
        
        const chunkPromises = [];
        for (let i = startPage; i < endPage; i++) {
          chunkPromises.push(
            pdf.getPage(i + 1).then(async (page) => {
              const viewport = page.getViewport({ scale: 0.5 });
              
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              await page.render({
                canvasContext: context,
                viewport: viewport
              }).promise;

              const blob = await new Promise(resolve => 
                canvas.toBlob(resolve, 'image/jpeg', 0.5)
              );

              newPages.push({
                file,
                pageIndex: i,
                type: 'pdf',
                preview: URL.createObjectURL(blob),
                dimensions: { width: viewport.width, height: viewport.height }
              });

              canvas.width = 0;
              canvas.height = 0;
            })
          );
        }

        await Promise.all(chunkPromises);
        setLoadingProgress(((chunk + 1) / chunks) * 100);
        setPages(prev => [...prev, ...newPages.slice(startPage, endPage)]);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      return newPages;
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setIsLoading(true);
    setLoadingProgress(0);

    try {
      for (const file of acceptedFiles) {
        if (file.type === 'application/pdf') {
          await processFile(file);
        } else if (file.type.startsWith('image/')) {
          const preview = URL.createObjectURL(file);
          setPages(prev => [...prev, { file, type: 'image', preview }]);
        }
      }
    } catch (error) {
      console.error('Error processing files:', error);
      alert('Error processing some files. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    }
  });

  // Optimized PDF creation
  const createFinalPDF = async () => {
    try {
      setIsLoading(true);
      const totalPages = pages.length;
      const pdfDoc = await PDFDocument.create();
      let isCancelled = false;

      // Create progress modal container
      const progressRoot = document.createElement('div');
      document.body.appendChild(progressRoot);
      
      const updateProgress = (progress, status, current) => {
        ReactDOM.render(
          <ProgressModal 
            progress={progress}
            status={status}
            currentPage={current}
            totalPages={totalPages}
            onCancel={() => {
              isCancelled = true;
              document.body.removeChild(progressRoot);
              setIsLoading(false);
            }}
          />,
          progressRoot
        );
      };

      // Process pages in chunks with optimized handling
      const CHUNK_SIZE = 20;
      const chunks = Math.ceil(totalPages / CHUNK_SIZE);
      
      // Create cache for loaded PDF documents
      const pdfCache = new Map();

      for (let chunk = 0; chunk < chunks && !isCancelled; chunk++) {
        const startIdx = chunk * CHUNK_SIZE;
        const endIdx = Math.min((chunk + 1) * CHUNK_SIZE, totalPages);
        
        for (let i = startIdx; i < endIdx && !isCancelled; i++) {
          const page = pages[i];
          updateProgress(
            (i / totalPages) * 100,
            `Processing ${page.type === 'pdf' ? 'PDF page' : 'image'}...`,
            i + 1
          );

          if (page.type === 'pdf') {
            try {
              // Check if we already have this PDF loaded
              let srcDoc = pdfCache.get(page.file.name);
              if (!srcDoc) {
                srcDoc = await PDFDocument.load(await page.file.arrayBuffer());
                pdfCache.set(page.file.name, srcDoc);
              }

              const [copiedPage] = await pdfDoc.copyPages(srcDoc, [page.pageIndex]);
              pdfDoc.addPage(copiedPage);
            } catch (error) {
              console.error(`Error processing PDF page ${i}:`, error);
              continue;
            }
          } else if (page.type === 'image') {
            try {
              const imageBytes = await page.file.arrayBuffer();
              let image;
              
              if (page.file.type.includes('jpeg') || page.file.type.includes('jpg')) {
                image = await pdfDoc.embedJpg(imageBytes);
              } else if (page.file.type.includes('png')) {
                image = await pdfDoc.embedPng(imageBytes);
              }
              
              if (image) {
                const { width, height } = image.scale(1);
                const newPage = pdfDoc.addPage([width, height]);
                newPage.drawImage(image, { x: 0, y: 0, width, height });
              }
            } catch (error) {
              console.error(`Error processing image page ${i}:`, error);
              continue;
            }
          }

          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }

      if (!isCancelled) {
        updateProgress(99, 'Finalizing PDF...', totalPages);
        const pdfBytes = await pdfDoc.save({
          useObjectStreams: true,
          addDefaultPage: false,
          preserveObjectIds: false,
          updateFieldAppearances: false
        });
        
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        updateProgress(100, 'Download starting...', totalPages);

        const link = document.createElement('a');
        link.href = url;
        link.download = `combined_${totalPages}_pages.pdf`;
        link.click();
        
        // Cleanup
        URL.revokeObjectURL(url);
        pdfCache.clear();
        
        setTimeout(() => {
          document.body.removeChild(progressRoot);
        }, 1000);
      }

    } catch (error) {
      console.error('Error creating PDF:', error);
      alert('Error creating PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update the delete button click handler in your JSX
  // Replace the existing delete button onClick with this:
  <button
    onClick={handleDeletePages}
    className="px-6 py-2 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-all duration-300 flex items-center"
    disabled={isLoading}
  >
    <Trash2 className="mr-2" size={20} />
    Confirm Delete ({selectedPages.length})
  </button>

return (
  <div className="fixed inset-0 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 flex flex-col overflow-hidden">
    {/* Main wrapper with proper overflow handling */}
    <div className="flex flex-col h-full">
      {/* Header Section - Fixed */}
      <div className="p-4">
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-2 mb-4 bg-white bg-opacity-10 text-white rounded-full hover:bg-opacity-20 transition-all duration-300 backdrop-blur-md border border-white border-opacity-20"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Home
        </Link>
      </div>

      {/* Content Container with Scroll */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="bg-white bg-opacity-10 backdrop-blur-md m-4 rounded-xl shadow-lg flex flex-col h-full">
          <div className="p-6 border-b border-white border-opacity-20">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-3xl font-bold text-white">PDF ToolKit</h2>
              {isDeleteMode && pages.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all duration-300 flex items-center"
                >
                  <CheckSquare className="mr-2" size={20} />
                  {selectedPages.length === pages.length ? 'Deselect All' : 'Select All'}
                  <span className="ml-2">({selectedPages.length}/{pages.length})</span>
                </button>
              )}
            </div>
            
            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed border-white border-opacity-50 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-opacity-100 ${
                isDragActive ? 'border-blue-500' : ''
              }`}
            >
              <input {...getInputProps()} />
              <FileText className="mx-auto mb-4 text-white" size={48} />
              <p className="text-white text-lg">
                {isDragActive
                  ? "Drop the files here ..."
                  : "Drag 'n' drop PDF files or images here, or click to select files"}
              </p>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading && !pages.length && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl">
                  <div className="mb-4">Processing... {Math.round(loadingProgress)}%</div>
                  <div className="w-64 h-2 bg-gray-200 rounded">
                    <div
                      className="h-full bg-blue-500 rounded transition-all duration-300"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {pages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {pages.map((page, index) => (
                  <div
                    key={index}
                    draggable={!isDeleteMode}
                    onDragStart={(e) => onDragStart(e, index)}
                    onDragOver={(e) => onDragOver(e, index)}
                    onDragEnd={onDragEnd}
                    className={`relative bg-white bg-opacity-20 rounded-lg overflow-hidden shadow-md aspect-[3/4] cursor-move transition-all duration-300 hover:shadow-lg ${
                      draggedItem === index ? 'opacity-50' : ''
                    }`}
                  >
                    <img
                      src={page.preview}
                      alt={`Page ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {index + 1}/{pages.length}
                    </div>
                    {isDeleteMode && (
                      <input
                        type="checkbox"
                        checked={selectedPages.includes(index)}
                        onChange={() => setSelectedPages(prev => 
                          prev.includes(index) 
                            ? prev.filter(i => i !== index)
                            : [...prev, index]
                        )}
                        className="absolute top-2 right-2 w-5 h-5"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        {/* Update footer section */}
        <div className="p-6 bg-white bg-opacity-5 backdrop-blur-sm border-t border-white border-opacity-20">
            <div className="flex justify-center space-x-4">
              {pages.length > 0 && (
                <button
                  onClick={() => {
                    setIsDeleteMode(!isDeleteMode);
                    setSelectedPages([]);
                  }}
                  className={`px-6 py-2 rounded-full text-white font-medium transition-all duration-300 ${
                    isDeleteMode ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                  } flex items-center`}
                  disabled={isLoading}
                >
                  <Trash2 className="mr-2" size={20} />
                  {isDeleteMode ? 'Cancel Delete' : 'Delete Pages'}
                </button>
              )}
              
              {isDeleteMode && selectedPages.length > 0 && (
                <button
                  onClick={handleDeletePages}
                  className="px-6 py-2 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-all duration-300 flex items-center"
                  disabled={isLoading}
                >
                  <Trash2 className="mr-2" size={20} />
                  Confirm Delete ({selectedPages.length})
                </button>
              )}
              
              {!isDeleteMode && pages.length > 0 && (
                <button
                  onClick={createFinalPDF}
                  className="px-6 py-2 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 transition-all duration-300 flex items-center"
                  disabled={isLoading}
                >
                  <Download className="mr-2" size={20} />
                  Download Combined PDF
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default App;