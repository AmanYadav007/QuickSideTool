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
  <div className="fixed inset-0 bg-gradient-to-br from-blue-700/20 to-teal-700/20 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
    <div className="bg-white/95 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl border border-white/40 transform scale-95 animate-scale-in">
      <h3 className="text-xl font-bold text-gray-800 mb-5 text-center">Processing Files</h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-semibold text-gray-700">
            <span>Overall Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-1 text-center">
          <div className="text-sm font-medium text-gray-700">{status}</div>
          <div className="text-sm font-bold text-gray-800">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        <button 
          className="w-full px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300 transform hover:scale-105 shadow-md"
          onClick={onCancel}
        >
          Cancel Process
        </button>
      </div>
    </div>
  </div>
);

const ContextMenu = ({ x, y, onClose, onReplace }) => {
  const menuStyle = {
    top: Math.max(0, Math.min(y, window.innerHeight - 60)),
    left: Math.max(0, Math.min(x, window.innerWidth - 150)),
  };

  return (
    <div
      className="context-menu fixed rounded-md py-1.5 z-50 border border-gray-300 bg-white shadow-xl animate-scale-in-fast"
      style={menuStyle}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <button
        className="w-full px-3 py-1.5 text-left text-gray-800 text-sm font-medium hover:bg-blue-100 flex items-center transition-colors duration-200"
        onClick={(e) => {
          onReplace();
          onClose();
        }}
      >
        <FileText className="w-4 h-4 mr-2 text-blue-600" />
        <span className="text-gray-800">Replace Page</span>
      </button>
    </div>
  );
};

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white p-5 rounded-xl shadow-2xl flex flex-col items-center space-y-3 animate-scale-in">
        <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
        <span className="text-gray-800 text-base font-medium">Replacing page...</span>
      </div>
    </div>
  );
};

const App = () => {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [replaceLoading, setReplaceLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [currentPageModal, setCurrentPageModal] = useState(0);
  const [totalPagesModal, setTotalPagesModal] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const cancelProcessingRef = useRef(false);
  const pdfCacheRef = useRef(new Map());
  const fileInputRef = useRef(null);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      pages.forEach(page => {
        if (page.preview) {
          URL.revokeObjectURL(page.preview);
        }
      });
    };
  }, []); 

  // Clean up object URLs for pages that are removed or replaced
  const activePreviewUrls = useRef(new Set());
  useEffect(() => {
    const currentPreviews = new Set(pages.map(p => p.preview));
    const toRevoke = new Set();

    activePreviewUrls.current.forEach(url => {
      if (!currentPreviews.has(url)) {
        toRevoke.add(url);
      }
    });

    toRevoke.forEach(url => {
      URL.revokeObjectURL(url);
    });

    activePreviewUrls.current = currentPreviews;
  }, [pages]);


  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('scale-[0.98]', 'opacity-70', 'shadow-2xl');
  };

  const handleDragEnd = (e) => {
    setDraggedItem(null);
    e.currentTarget.classList.remove('scale-[0.98]', 'opacity-70', 'shadow-2xl');
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedItem === null || draggedItem === index) return;

    if (pages[index] && pages[draggedItem] && draggedItem !== index) {
      setPages(prevPages => {
        const newPages = [...prevPages];
        const [draggedPage] = newPages.splice(draggedItem, 1);
        newPages.splice(index, 0, draggedPage);
        return newPages;
      });
      setDraggedItem(index);
    }
  };

  const handleRemovePage = useCallback((indexToRemove) => {
    setPages((prevPages) => {
      const newPages = prevPages.filter((_, index) => index !== indexToRemove);
      return newPages;
    });
  }, []);

  const handleContextMenu = useCallback((e, page, index) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const menuX = rect.left + window.scrollX + 10;
    const menuY = rect.top + window.scrollY + 10;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const menuWidth = 150; 
    const menuHeight = 50; 

    let finalX = menuX;
    let finalY = menuY;

    if (menuX + menuWidth > viewportWidth) {
      finalX = viewportWidth - menuWidth - 10;
    }
    if (menuY + menuHeight > viewportHeight) {
      finalY = viewportHeight - menuHeight - 10;
    }

    setContextMenu({
      x: finalX,
      y: finalY,
      pageIndex: index,
    });
  }, []);

  const handleReplacePage = useCallback(() => {
    if (fileInputRef.current && contextMenu !== null) {
      fileInputRef.current.dataset.pageIndex = contextMenu.pageIndex;
      fileInputRef.current.click();
    }
  }, [contextMenu]);

  const handleFileSelect = useCallback(async (event) => {
    const file = event.target.files[0];
    const pageIndex = parseInt(event.target.dataset.pageIndex);

    if (!file || isNaN(pageIndex)) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        delete fileInputRef.current.dataset.pageIndex;
      }
      return;
    }

    try {
      if (!Object.values(FILE_TYPES).includes(file.type)) {
        alert('Please select a valid PDF or image file (PDF, JPG, JPEG, PNG).');
        return;
      }

      setReplaceLoading(true);
      
      let newPagesData = [];
      let pdfDocument = null;

      if (file.type === FILE_TYPES.PDF) {
        pdfDocument = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
        const totalFilePages = pdfDocument.numPages;

        for (let i = 0; i < totalFilePages; i++) {
          const page = await pdfDocument.getPage(i + 1);
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
            canvas.toBlob(resolve, 'image/jpeg', 0.8)
          );
          newPagesData.push({
            file,
            pageIndex: i,
            type: 'pdf',
            preview: URL.createObjectURL(blob),
            dimensions: { width: viewport.width, height: viewport.height },
          });
          canvas.width = 0;
          canvas.height = 0;
        }
      } else {
        newPagesData.push({
          file,
          type: 'image',
          preview: URL.createObjectURL(file),
          pageIndex: 0,
        });
      }

      setPages((prevPages) => {
        const updatedPages = [...prevPages];
        updatedPages.splice(pageIndex, 1, ...newPagesData);
        return updatedPages;
      });

    } catch (error) {
      console.error('Error replacing page:', error);
      alert('Error replacing page: ' + error.message);
    } finally {
      setReplaceLoading(false);
      setContextMenu(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        delete fileInputRef.current.dataset.pageIndex;
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu && event.target && !event.target.closest('.context-menu')) {
        setContextMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  const processFileForPreview = async (file, totalFiles, fileIndex, updateProgress) => {
    if (cancelProcessingRef.current) {
      throw new Error('Processing cancelled by user');
    }

    try {
      if (file.type === FILE_TYPES.PDF) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;
        const filePages = [];

        for (let i = 0; i < numPages; i++) {
          if (cancelProcessingRef.current) {
            throw new Error('Processing cancelled by user');
          }
          const page = await pdf.getPage(i + 1);
          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport: viewport }).promise;

          const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, 'image/jpeg', 0.8)
          );

          filePages.push({
            file,
            pageIndex: i,
            type: 'pdf',
            preview: URL.createObjectURL(blob),
            dimensions: { width: viewport.width, height: viewport.height },
          });

          updateProgress(
            `Rendering page ${i + 1} of ${numPages} for file ${fileIndex + 1}`,
            (i + 1),
            numPages
          );
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
        return filePages;
      } else if (Object.values(FILE_TYPES).includes(file.type)) {
        const preview = URL.createObjectURL(file);
        return [{
          file,
          type: 'image',
          preview,
          pageIndex: 0,
          dimensions: { width: 0, height: 0 },
        }];
      }
    } catch (error) {
      if (error.message === 'Processing cancelled by user') {
        console.log('File preview generation cancelled.');
      } else {
        console.error(`Error processing file ${file.name} for preview:`, error);
      }
      throw error;
    }
    return [];
  };

  const createRootForModal = () => {
    const progressDiv = document.createElement('div');
    document.body.appendChild(progressDiv);
    const root = createRoot(progressDiv);
    return {
      root,
      cleanup: () => {
        if (root) {
          root.unmount();
        }
        if (progressDiv && document.body.contains(progressDiv)) {
          document.body.removeChild(progressDiv);
        }
      },
    };
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    cancelProcessingRef.current = false;
    let modalCleanup = () => {};
    let newOverallPages = [];

    try {
      const { root: modalRoot, cleanup } = createRootForModal();
      modalCleanup = cleanup;
      
      setIsLoading(true);
      setLoadingProgress(0);
      setLoadingStatus('Preparing to process files...');
      setCurrentPageModal(0);
      setTotalPagesModal(0);

      const invalidFiles = acceptedFiles.filter(file => !Object.values(FILE_TYPES).includes(file.type));
      if (invalidFiles.length > 0) {
        throw new Error(`Unsupported files: ${invalidFiles.map(f => f.name).join(', ')}. Please use PDF, JPG, JPEG, or PNG.`);
      }

      let cumulativePagesProcessed = 0;
      let totalExpectedPages = 0;

      for(const file of acceptedFiles) {
        if (file.type === FILE_TYPES.PDF) {
          const pdfData = await file.arrayBuffer();
          const tempPdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
          totalExpectedPages += tempPdf.numPages;
        } else {
          totalExpectedPages += 1;
        }
      }
      setTotalPagesModal(totalExpectedPages);

      for (let fileIndex = 0; fileIndex < acceptedFiles.length; fileIndex++) {
        if (cancelProcessingRef.current) break;

        const file = acceptedFiles[fileIndex];
        
        const updateCurrentFileProgress = (statusText, currentPageNum, totalPagesInFile) => {
          setLoadingStatus(`${statusText} (File ${fileIndex + 1}/${acceptedFiles.length})`);
          setCurrentPageModal(cumulativePagesProcessed + currentPageNum);
          setLoadingProgress(((cumulativePagesProcessed + currentPageNum) / totalExpectedPages) * 100);
          
          if (modalRoot) {
            modalRoot.render(
              <ProgressModal
                progress={((cumulativePagesProcessed + currentPageNum) / totalExpectedPages) * 100}
                status={`${statusText} (File ${fileIndex + 1}/${acceptedFiles.length})`}
                currentPage={cumulativePagesProcessed + currentPageNum}
                totalPages={totalExpectedPages}
                onCancel={() => {
                  cancelProcessingRef.current = true;
                  modalCleanup();
                }}
              />
            );
          }
        };

        const pagesFromFile = await processFileForPreview(file, acceptedFiles.length, fileIndex, updateCurrentFileProgress);
        newOverallPages = [...newOverallPages, ...pagesFromFile];
        cumulativePagesProcessed += pagesFromFile.length;
      }

      if (cancelProcessingRef.current) {
        alert('File processing was cancelled.');
        newOverallPages.forEach(page => URL.revokeObjectURL(page.preview));
        return;
      }

      setPages((prevPages) => [...prevPages, ...newOverallPages]);

    } catch (error) {
      console.error('Error in onDrop:', error);
      alert(error.message || 'An error occurred while processing files.');
      newOverallPages.forEach(page => URL.revokeObjectURL(page.preview));
    } finally {
      setIsLoading(false);
      setLoadingProgress(0);
      setLoadingStatus('');
      setCurrentPageModal(0);
      setTotalPagesModal(0);
      modalCleanup();
    }
  }, []);

  const createFinalPDF = async () => {
    if (pages.length === 0) {
      alert('Please add files to combine.');
      return;
    }

    let modalCleanup = () => {};

    try {
      const { root: modalRoot, cleanup } = createRootForModal();
      modalCleanup = cleanup;

      setIsLoading(true);
      cancelProcessingRef.current = false;
      const pdfDoc = await PDFDocument.create();
      const pdfCache = new Map();

      const totalItemsToProcess = pages.length;

      for (let i = 0; i < totalItemsToProcess; i++) {
        if (cancelProcessingRef.current) {
          throw new Error('PDF creation cancelled by user.');
        }

        const page = pages[i];
        const currentProgress = ((i + 1) / totalItemsToProcess) * 100;
        
        modalRoot.render(
          <ProgressModal
            progress={currentProgress}
            status={`Adding page ${i + 1} of ${totalItemsToProcess}`}
            currentPage={i + 1}
            totalPages={totalItemsToProcess}
            onCancel={() => {
              cancelProcessingRef.current = true;
              modalCleanup();
            }}
          />
        );

        if (page.type === 'pdf') {
          try {
            let srcDoc = pdfCache.get(page.file);
            if (!srcDoc) {
              const arrayBuffer = await page.file.arrayBuffer();
              srcDoc = await PDFDocument.load(arrayBuffer);
              pdfCache.set(page.file, srcDoc);
            }
            const [copiedPage] = await pdfDoc.copyPages(srcDoc, [page.pageIndex]);
            pdfDoc.addPage(copiedPage);
          } catch (error) {
            console.error(`Error embedding PDF page ${i + 1} from file ${page.file.name}:`, error);
            continue; 
          }
        } else if (page.type === 'image') {
          try {
            const imageBytes = await page.file.arrayBuffer();
            let image;
            if (page.file.type.includes('jpeg')) {
              image = await pdfDoc.embedJpg(imageBytes);
            } else if (page.file.type.includes('png')) {
              image = await pdfDoc.embedPng(imageBytes);
            } else {
              console.warn(`Unsupported image type for page ${i + 1}: ${page.file.type}`);
              continue;
            }
            
            if (image) {
              const { width, height } = image.scale(1);
              const newPage = pdfDoc.addPage([width, height]);
              newPage.drawImage(image, { x: 0, y: 0, width, height });
            }
          } catch (error) {
            console.error(`Error embedding image page ${i + 1} from file ${page.file.name}:`, error);
            continue;
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      if (cancelProcessingRef.current) {
        throw new Error('PDF creation cancelled by user.');
      }
      
      modalRoot.render(
        <ProgressModal
          progress={100}
          status="Finalizing and downloading PDF..."
          currentPage={totalItemsToProcess}
          totalPages={totalItemsToProcess}
          onCancel={() => {
            cancelProcessingRef.current = true;
            modalCleanup();
          }}
        />
      );

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged_and_ordered_document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      setTimeout(modalCleanup, 1500);

    } catch (error) {
      console.error('Error during PDF creation:', error);
      alert(error.message || 'Failed to create PDF. Please ensure all files are valid and try again.');
      pages.forEach(page => URL.revokeObjectURL(page.preview));
      modalCleanup();
    } finally {
      setIsLoading(false);
      if (modalCleanup) modalCleanup(); 
    }
  };


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    disabled: isLoading || replaceLoading
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white font-sans antialiased relative">
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-blue-500/20 blur-3xl animate-blob-fade top-1/4 left-[15%] animation-delay-0"></div>
        <div className="absolute w-80 h-80 rounded-full bg-teal-500/20 blur-3xl animate-blob-fade top-[65%] left-[70%] animation-delay-2000"></div>
        <div className="absolute w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl animate-blob-fade top-[10%] left-[60%] animation-delay-4000"></div>
        <div className="absolute w-56 h-56 rounded-full bg-green-500/20 blur-3xl animate-blob-fade top-[80%] left-[20%] animation-delay-6000"></div>
      </div>

      <div className="container mx-auto p-4 md:p-8 space-y-8 relative z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 drop-shadow-md animate-fade-in-down">
          PDF & Image Combiner
        </h1>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="application/pdf,image/png,image/jpeg,image/jpg"
          onChange={handleFileSelect}
          disabled={replaceLoading}
        />

        <div
          {...getRootProps()}
          className={`
            border-3 border-dashed rounded-2xl p-12 text-center
            transition-all duration-300 ease-in-out cursor-pointer
            ${isDragActive
              ? 'border-teal-400 bg-teal-400/10 scale-[1.01] shadow-lg'
              : 'border-white/30 hover:border-blue-400 hover:bg-blue-400/10'
            }
            ${isLoading || replaceLoading ? 'opacity-70 cursor-not-allowed pointer-events-none' : 'shadow-md'}
            animate-fade-in
          `}
        >
          <input {...getInputProps()} />
          <p className="text-white text-opacity-90 text-lg md:text-xl font-semibold">
            {isDragActive
              ? 'Drop your files here!'
              : 'Drag & drop PDF files or images, or click to add files'}
          </p>
          <p className="text-white text-opacity-70 text-sm mt-1.5">
            (Supports PDF, JPG, JPEG, PNG formats)
          </p>
        </div>

        {pages.length > 0 && (
          <div className="p-7 space-y-7 bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <h2 className="text-2xl font-bold text-white">Your Pages ({pages.length})</h2>
              <button
                onClick={createFinalPDF}
                disabled={isLoading || pages.length === 0}
                className={`px-6 py-2.5 rounded-full flex items-center justify-center font-semibold text-base whitespace-nowrap
                  transition-all duration-300 transform
                  ${isLoading || pages.length === 0
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white shadow-md hover:scale-105'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download Combined PDF
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {pages.map((page, index) => (
                <div
                  key={`${page.preview}-${index}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onContextMenu={(e) => handleContextMenu(e, page, index)}
                  className={`
                    relative group rounded-lg overflow-hidden bg-white/5 border border-white/10
                    transition-all duration-200 ease-in-out transform
                    hover:shadow-lg hover:scale-[1.02] hover:border-blue-400 cursor-grab
                    ${draggedItem === index ? 'opacity-50 scale-[0.98] shadow-xl' : ''}
                    ${replaceLoading && contextMenu?.pageIndex === index ? 'opacity-50 animate-pulse' : ''}
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/50 pointer-events-none z-10" />
                  
                  <div className="absolute top-2 left-2 p-1.5 bg-black/40
                    rounded-full opacity-0 group-hover:opacity-100 group-active:opacity-100
                    transition-opacity cursor-move z-20"
                  >
                    <GripVertical className="w-4 h-4 text-white/90" />
                  </div>
                  
                  <img
                    src={page.preview}
                    alt={`Page ${index + 1}`}
                    className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  <button
                    className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center shadow-sm hover:bg-red-700 z-20"
                    onClick={() => handleRemovePage(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-xs font-medium text-center z-10">
                    Page {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onReplace={handleReplacePage}
          />
        )}
        <LoadingOverlay isLoading={replaceLoading} />
      </div>
    </div>
  );
};

export default App;