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
    top: Math.max(0, Math.min(y, window.innerHeight - 60)), // Ensure menu stays within viewport
    left: Math.max(0, Math.min(x, window.innerWidth - 150)), // Ensure menu stays within viewport
  };

  return (
    <div
      className="context-menu fixed rounded-md py-1.5 z-50 border border-gray-300 bg-white shadow-xl animate-scale-in-fast"
      style={menuStyle}
      onClick={(e) => e.stopPropagation()} // Prevent closing on click inside menu
      onContextMenu={(e) => e.preventDefault()} // Prevent browser default context menu
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
  const [isLoading, setIsLoading] = useState(false); // For initial file processing and final PDF creation
  const [replaceLoading, setReplaceLoading] = useState(false); // For single page replacement
  const [loadingProgress, setLoadingProgress] = useState(0); // Not used in current ProgressModal render props
  const [loadingStatus, setLoadingStatus] = useState(''); // Not used in current ProgressModal render props
  const [currentPageModal, setCurrentPageModal] = useState(0); // Not used in current ProgressModal render props
  const [totalPagesModal, setTotalPagesModal] = useState(0); // Not used in current ProgressModal render props
  const [draggedItem, setDraggedItem] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const cancelProcessingRef = useRef(false);
  const pdfCacheRef = useRef(new Map()); // Cache PDFDocument instances
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

  // Clean up object URLs for pages that are removed or replaced dynamically
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
      setDraggedItem(index); // Update dragged item index to follow its new position
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
    const menuX = e.clientX; // Use clientX/Y for mouse position directly
    const menuY = e.clientY;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const menuWidth = 150; 
    const menuHeight = 50; 

    let finalX = menuX;
    let finalY = menuY;

    // Adjust if menu goes off screen to the right
    if (menuX + menuWidth > viewportWidth) {
      finalX = viewportWidth - menuWidth - 10;
    }
    // Adjust if menu goes off screen to the bottom
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
      // Create a dummy input for triggering replacement, or clear current one
      // to ensure `onChange` fires even if same file is selected
      fileInputRef.current.value = ''; 
      fileInputRef.current.dataset.pageIndex = contextMenu.pageIndex;
      fileInputRef.current.click();
    }
  }, [contextMenu]);

  // Helper function to process a single file (PDF or Image) into page data
  const processFileIntoPageData = async (file) => {
    let newPagesData = [];
    if (file.type === FILE_TYPES.PDF) {
      const pdfDocument = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
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
          pageIndex: i, // Index within the original PDF file
          type: 'pdf',
          preview: URL.createObjectURL(blob),
          dimensions: { width: viewport.width, height: viewport.height },
        });
        // Clear canvas dimensions to free memory
        canvas.width = 0;
        canvas.height = 0;
      }
    } else { // Image file
      newPagesData.push({
        file,
        pageIndex: 0, // Image files always have 1 'page' at index 0
        type: 'image',
        preview: URL.createObjectURL(file),
        dimensions: { width: 0, height: 0 }, // Dimensions set during PDF creation, not here
      });
    }
    return newPagesData;
  };


  const handleFileSelect = useCallback(async (event) => {
    const file = event.target.files[0];
    const pageIndexToReplace = parseInt(event.target.dataset.pageIndex); // This is the index in the `pages` array

    if (!file || isNaN(pageIndexToReplace)) {
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

      setReplaceLoading(true); // Start loading overlay for replacement

      // Process the selected file (can be multi-page PDF or single image)
      const replacementPages = await processFileIntoPageData(file);

      setPages((prevPages) => {
        const updatedPages = [...prevPages];
        // Remove 1 page at pageIndexToReplace and insert all replacementPages
        updatedPages.splice(pageIndexToReplace, 1, ...replacementPages);
        return updatedPages;
      });

    } catch (error) {
      console.error('Error replacing page:', error);
      alert('Error replacing page: ' + error.message);
    } finally {
      setReplaceLoading(false); // Hide loading overlay
      setContextMenu(null); // Close context menu
      // Always clear the file input value and dataset after processing
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        delete fileInputRef.current.dataset.pageIndex;
      }
    }
  }, []); // Dependencies: none, as it uses `fileInputRef.current` and `pages` via `setPages`


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu && event.target && !event.target.closest('.context-menu')) {
        setContextMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  // Unified function to process files for preview (used by onDrop)
  const processFileForPreview = async (file, totalFiles, fileIndex, updateProgress) => {
    if (cancelProcessingRef.current) {
      throw new Error('Processing cancelled by user');
    }

    try {
      let filePages = [];
      if (file.type === FILE_TYPES.PDF) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;
        
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
            pageIndex: i, // Index within the original PDF file
            type: 'pdf',
            preview: URL.createObjectURL(blob),
            dimensions: { width: viewport.width, height: viewport.height },
          });

          // Update progress for modal
          updateProgress(
            `Rendering page ${i + 1} of ${numPages} for file ${fileIndex + 1}`,
            (i + 1), // Current page being processed in this file
            numPages // Total pages in this specific file
          );
          await new Promise((resolve) => setTimeout(resolve, 10)); // Small delay for UI update
        }
      } else if (Object.values(FILE_TYPES).includes(file.type)) { // Image file
        filePages.push({
          file,
          type: 'image',
          preview: URL.createObjectURL(file),
          pageIndex: 0,
          dimensions: { width: 0, height: 0 }, // Dimensions will be derived when embedding
        });
        // Update progress for modal
        updateProgress(
          `Processing image file ${fileIndex + 1}`,
          1, // Always 1 page for an image file
          1 // Total pages is 1 for an image file
        );
      }
      return filePages;
    } catch (error) {
      if (error.message === 'Processing cancelled by user') {
        console.log('File preview generation cancelled.');
      } else {
        console.error(`Error processing file ${file.name} for preview:`, error);
      }
      throw error; // Re-throw to be caught by onDrop's outer try-catch
    }
  };

  // Dynamically create and clean up modal root for progress display
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
    let newOverallPages = []; // Accumulate pages from all dropped files

    try {
      const { root: modalRoot, cleanup } = createRootForModal();
      modalCleanup = cleanup;
      
      setIsLoading(true);
      setLoadingProgress(0); // Reset progress on new drop
      setLoadingStatus('Preparing to process files...');
      setCurrentPageModal(0);
      setTotalPagesModal(0);

      // Validate file types first
      const invalidFiles = acceptedFiles.filter(file => !Object.values(FILE_TYPES).includes(file.type));
      if (invalidFiles.length > 0) {
        throw new Error(`Unsupported files: ${invalidFiles.map(f => f.name).join(', ')}. Please use PDF, JPG, JPEG, or PNG.`);
      }

      let cumulativePagesProcessed = 0;
      let totalExpectedPages = 0; // Total pages across ALL accepted files

      // Calculate total expected pages for overall progress
      for(const file of acceptedFiles) {
        if (file.type === FILE_TYPES.PDF) {
          const pdfData = await file.arrayBuffer();
          const tempPdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
          totalExpectedPages += tempPdf.numPages;
        } else {
          totalExpectedPages += 1; // Images are 1 page each
        }
      }
      setTotalPagesModal(totalExpectedPages); // Set for modal display

      // Process each accepted file
      for (let fileIndex = 0; fileIndex < acceptedFiles.length; fileIndex++) {
        if (cancelProcessingRef.current) break; // Check for cancellation

        const file = acceptedFiles[fileIndex];
        
        // Callback to update progress within the modal for the current file being processed
        const updateCurrentFileProgress = (statusText, currentPageNumInFile, totalPagesInFile) => {
          setLoadingStatus(`${statusText} (File ${fileIndex + 1}/${acceptedFiles.length})`);
          setCurrentPageModal(cumulativePagesProcessed + currentPageNumInFile);
          // Calculate overall progress percentage
          const overallProgress = ((cumulativePagesProcessed + currentPageNumInFile) / totalExpectedPages) * 100;
          setLoadingProgress(overallProgress); 
          
          // Render progress modal
          if (modalRoot) {
            modalRoot.render(
              <ProgressModal
                progress={overallProgress}
                status={`${statusText} (File ${fileIndex + 1}/${acceptedFiles.length})`}
                currentPage={cumulativePagesProcessed + currentPageNumInFile}
                totalPages={totalExpectedPages}
                onCancel={() => {
                  cancelProcessingRef.current = true;
                  modalCleanup(); // Immediately unmount modal on cancel
                }}
              />
            );
          }
        };

        const pagesFromFile = await processFileForPreview(file, acceptedFiles.length, fileIndex, updateCurrentFileProgress);
        newOverallPages = [...newOverallPages, ...pagesFromFile]; // Add pages from current file
        cumulativePagesProcessed += pagesFromFile.length; // Update cumulative count
      }

      // If processing was cancelled
      if (cancelProcessingRef.current) {
        alert('File processing was cancelled.');
        newOverallPages.forEach(page => URL.revokeObjectURL(page.preview)); // Revoke URLs for unsaved previews
        return;
      }

      // Add all newly processed pages to the main state
      setPages((prevPages) => [...prevPages, ...newOverallPages]);

    } catch (error) {
      console.error('Error in onDrop:', error);
      alert(error.message || 'An error occurred while processing files.');
      newOverallPages.forEach(page => URL.revokeObjectURL(page.preview)); // Revoke URLs on error
    } finally {
      setIsLoading(false); // Hide main loading state
      setLoadingProgress(0); // Reset progress values
      setLoadingStatus('');
      setCurrentPageModal(0);
      setTotalPagesModal(0);
      modalCleanup(); // Always ensure modal is cleaned up
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
      const pdfCache = new Map(); // Cache loaded PDFDocuments to avoid re-loading same PDF files

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
            // Decide how to handle errors: skip page or throw error to stop process
            continue; // Skip this problematic page and continue
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
              const { width, height } = image.scale(1); // Get original dimensions
              const newPage = pdfDoc.addPage([width, height]); // Add page with image dimensions
              newPage.drawImage(image, { x: 0, y: 0, width, height }); // Draw image full size
            }
          } catch (error) {
            console.error(`Error embedding image page ${i + 1} from file ${page.file.name}:`, error);
            continue;
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 10)); // Small delay for UI update
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
      link.click(); // Trigger download
      document.body.removeChild(link); // Clean up link element
      
      URL.revokeObjectURL(url); // Clean up object URL
      
      setTimeout(modalCleanup, 1500); // Give user time to see 100% and download
      alert('PDF created and downloaded successfully!'); // Success message

    } catch (error) {
      console.error('Error during PDF creation:', error);
      alert(error.message || 'Failed to create PDF. Please ensure all files are valid and try again.');
      // Clean up previews if they were created before cancellation/error
      pages.forEach(page => URL.revokeObjectURL(page.preview)); 
      modalCleanup();
    } finally {
      setIsLoading(false); // Hide main loading state
      // Ensure modal is cleaned up even if there's an unexpected error
      if (modalCleanup) modalCleanup(); 
    }
  };


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    disabled: isLoading || replaceLoading // Disable dropzone during any loading
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

        {/* Hidden file input for replacement functionality */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="application/pdf,image/png,image/jpeg,image/jpg"
          onChange={handleFileSelect}
          disabled={replaceLoading} // Disable file input during replacement
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
                  key={`${page.preview}-${index}`} // Use a more robust key to handle replacements
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