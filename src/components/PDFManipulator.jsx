import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { FileText, Download, Trash2, GripVertical, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const FILE_TYPES = {
  PDF: 'application/pdf',
  JPEG: 'image/jpeg',
  JPG: 'image/jpg',
  PNG: 'image/png',
};

const ProgressModal = ({ progress, status, currentPage, totalPages, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
      <h3 className="text-xl font-semibold mb-4">Processing Files</h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-gray-600">{status}</div>
          <div className="text-sm font-medium">
            Processing page {currentPage} of {totalPages}
          </div>
        </div>

        <button 
          className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

const App = () => {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [replaceLoading, setReplaceLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const cancelProcessingRef = useRef(false);
  const pdfCacheRef = useRef(new Map());
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unusedPreviews = new Set();
    
    // Collect all preview URLs that are no longer referenced
    pages.forEach(page => {
      if (page.preview) {
        unusedPreviews.add(page.preview);
      }
    });

    // Revoke any unused preview URLs
    unusedPreviews.forEach(preview => {
      if (!pages.some(page => page.preview === preview)) {
        URL.revokeObjectURL(preview);
      }
    });
  }, [pages]);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    setDraggedItem(null);
    e.target.style.opacity = '1';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedItem === null || draggedItem === index) return;

    const newPages = [...pages];
    const draggedPage = { ...newPages[draggedItem] };
    
    newPages.splice(draggedItem, 1);
    newPages.splice(index, 0, draggedPage);
    
    setPages(newPages);
    setDraggedItem(index);
  };

  const handleRemovePage = useCallback((indexToRemove) => {
    setPages((prevPages) => {
      const newPages = prevPages.filter((_, index) => index !== indexToRemove);
      const removedPage = prevPages[indexToRemove];
      if (removedPage && removedPage.preview) {
        URL.revokeObjectURL(removedPage.preview);
      }
      return newPages;
    });
  }, []);

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
          if (cancelProcessingRef.current) {
            throw new Error('Processing cancelled');
          }

          chunkPromises.push(
            pdf.getPage(i + 1).then(async (page) => {
              const viewport = page.getViewport({ scale: 0.5 });
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              await page.render({
                canvasContext: context,
                viewport: viewport,
              }).promise;

              const blob = await new Promise((resolve) =>
                canvas.toBlob(resolve, 'image/jpeg', 0.5)
              );

              canvas.width = 0;
              canvas.height = 0;

              return {
                file,
                pageIndex: i,
                type: 'pdf',
                preview: URL.createObjectURL(blob),
                dimensions: { width: viewport.width, height: viewport.height },
              };
            })
          );
        }

        const chunkResults = await Promise.all(chunkPromises);
        newPages.push(...chunkResults);
        
        setLoadingProgress((chunk + 1) / chunks * 100);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      return newPages;
    } catch (error) {
      if (error.message === 'Processing cancelled') {
        console.log('PDF processing was cancelled');
      } else {
        console.error('Error processing PDF:', error);
      }
      throw error;
    }
  };

  const createProgressModal = () => {
    const progressRoot = document.createElement('div');
    document.body.appendChild(progressRoot);
    const root = createRoot(progressRoot);
    
    return {
      root,
      element: progressRoot,
      cleanup: () => {
        if (root) {
          root.unmount();
        }
        if (progressRoot && document.body.contains(progressRoot)) {
          document.body.removeChild(progressRoot);
        }
      },
    };
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const { root, element: progressRoot } = createProgressModal();
    
    try {
      setIsLoading(true);
      setLoadingProgress(0);
      cancelProcessingRef.current = false;

      const invalidFiles = acceptedFiles.filter((file) =>
        !Object.values(FILE_TYPES).includes(file.type)
      );
      
      if (invalidFiles.length > 0) {
        throw new Error('Some files are not supported. Please use only PDF and images.');
      }

      let newPages = [];
      let totalProcessedPages = 0;
      const totalFiles = acceptedFiles.length;

      for (let fileIndex = 0; fileIndex < totalFiles; fileIndex++) {
        if (cancelProcessingRef.current) break;

        const file = acceptedFiles[fileIndex];
        const fileProgress = (fileIndex / totalFiles) * 100;

        if (root) {
          root.render(
            <ProgressModal
              progress={fileProgress}
              status={`Processing file ${fileIndex + 1} of ${totalFiles}`}
              currentPage={totalProcessedPages}
              totalPages={totalProcessedPages}
              onCancel={() => {
                cancelProcessingRef.current = true;
                if (root) {
                  root.unmount();
                }
                if (progressRoot && document.body.contains(progressRoot)) {
                  document.body.removeChild(progressRoot);
                }
              }}
            />
          );
        }

        if (file.type === FILE_TYPES.PDF) {
          const pdfPages = await processFile(file);
          if (pdfPages) {
            newPages = [...newPages, ...pdfPages];
            totalProcessedPages += pdfPages.length;
          }
        } else if (Object.values(FILE_TYPES).includes(file.type)) {
          const preview = URL.createObjectURL(file);
          newPages.push({
            file,
            type: 'image',
            preview,
            pageIndex: newPages.length,
          });
          totalProcessedPages += 1;
        }
      }

      setPages((prevPages) => [...prevPages, ...newPages]);

    } catch (error) {
      console.error('Error processing files:', error);
      alert(error.message || 'Error processing files. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingProgress(0);
      if (root) {
        root.unmount();
      }
      if (progressRoot && document.body.contains(progressRoot)) {
        document.body.removeChild(progressRoot);
      }
    }
  }, []);

  const createFinalPDF = async () => {
    let progressRoot = null;
    let root = null;
  
    try {
      progressRoot = document.createElement('div');
      document.body.appendChild(progressRoot);
      root = createRoot(progressRoot);
      
      setIsLoading(true);
      const totalPages = pages.length;
      cancelProcessingRef.current = false;
      const pdfDoc = await PDFDocument.create();
      const pdfCache = new Map();

      const updateProgress = (progress, status, current) => {
        if (root) {
          root.render(
            <ProgressModal
              progress={progress}
              status={status}
              currentPage={current}
              totalPages={totalPages}
              onCancel={() => {
                cancelProcessingRef.current = true;
                if (root) {
                  root.unmount();
                  root = null;
                }
                if (progressRoot && document.body.contains(progressRoot)) {
                  document.body.removeChild(progressRoot);
                  progressRoot = null;
                }
                setIsLoading(false);
              }}
            />
          );
        }
      };
  
      updateProgress(0, 'Starting PDF merge...', 0);
  
      for (let i = 0; i < totalPages && !cancelProcessingRef.current; i++) {
        const page = pages[i];
        updateProgress(
          (i / totalPages) * 100,
          `Processing ${page.type === 'pdf' ? 'PDF page' : 'image'}...`,
          i + 1
        );

        if (page.type === 'pdf') {
          try {
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

        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      if (cancelProcessingRef.current) {
        throw new Error('Processing cancelled');
      }
  
      updateProgress(90, 'Finalizing PDF...', totalPages);
  
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged-document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      updateProgress(100, 'Complete!', totalPages);
      
      setTimeout(() => {
        if (root) {
          root.unmount();
          root = null;
        }
        if (progressRoot && document.body.contains(progressRoot)) {
          document.body.removeChild(progressRoot);
          progressRoot = null;
        }
      }, 1000);
  
    } catch (error) {
      console.error('Error creating PDF:', error);
      alert('Error creating PDF. Please try again.');
    } finally {
      setIsLoading(false);
      if (root) {
        root.unmount();
      }
      if (progressRoot && document.body.contains(progressRoot)) {
        document.body.removeChild(progressRoot);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600">
      <div className="container mx-auto p-4 space-y-6">
        {/* Back button */}
        {/* <button
          className="text-white hover:bg-white/20 -ml-2 px-3 py-2 rounded-md flex items-center"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button> */}

        {/* Drop zone */}
        <div 
          {...getRootProps()} 
          className={`
            border-2 border-dashed rounded-xl p-12
            transition-all duration-200 ease-in-out
            ${isDragActive
              ? 'border-white bg-white/20'
              : 'border-white/50 hover:border-white hover:bg-white/10'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <input {...getInputProps()} disabled={isLoading} />
          <p className="text-white/90 text-center text-lg">
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag & drop PDF files or images here, or click to select files'}
          </p>
        </div>

        {pages.length > 0 && (
          <div className="p-6 space-y-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <button
                onClick={createFinalPDF}
                disabled={isLoading || pages.length === 0}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  isLoading || pages.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                }`}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Combined PDF
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {pages.map((page, index) => (
                <div
                  key={`${page.preview}-${index}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onContextMenu={(e) => handleContextMenu(e, page, index)}
                  className={`
                    relative group rounded-lg overflow-hidden bg-white
                    transition-all duration-200 ease-in-out
                    ${draggedItem === index
                      ? 'opacity-50 scale-95'
                      : 'hover:shadow-lg hover:scale-[1.02]'
                    }
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/50 pointer-events-none" />
                  
                  <div className="absolute top-2 left-2 p-1.5 bg-black/50
                    rounded-full opacity-0 group-hover:opacity-100
                    transition-opacity cursor-move z-10"
                  >
                    <GripVertical className="w-4 h-4 text-white" />
                  </div>
                  
                  <img
                    src={page.preview}
                    alt={`Page ${index + 1}`}
                    className="w-full aspect-[3/4] object-cover"
                  />
                  
                  <button
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    onClick={() => handleRemovePage(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-sm font-medium">
                    Page {index + 1} of {pages.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

