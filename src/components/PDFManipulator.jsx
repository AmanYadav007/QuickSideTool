import React, { useState, useCallback, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useDropzone } from "react-dropzone";
import { PDFDocument, degrees } from "pdf-lib"; // Import degrees for rotation
import * as pdfjsLib from "pdfjs-dist";
import {
  FileText,
  Download,
  Trash2,
  GripVertical,
  Loader2,
  RotateCw,
  Keyboard,
  Image as ImageIcon,
  XCircle,
  Plus,
  // RotateCw, // Removed RotateCw import as it was commented out anyway and not used for compression
} from "lucide-react";
// import { Link } from "react-router-dom";
import Notification from "./Notification";
import PageCard from "./PageCard";
// Add import for the worker
// (Assume create-react-app or similar setup with worker-loader)
<<<<<<< HEAD
import logger from '../utils/logger';
=======
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1


const FILE_TYPES = {
  PDF: "application/pdf",
  JPEG: "image/jpeg",
  JPG: "image/jpg",
  PNG: "image/png",
};

// --- Components (ProgressModal, ContextMenu, LoadingOverlay) ---

const ProgressModal = ({
  progress,
  status,
  currentPage,
  totalPages,
  onCancel,
}) => (
  <div className="fixed inset-0 bg-gradient-to-br from-blue-700/20 to-teal-700/20 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
    <div className="bg-white/95 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl border border-white/40 transform scale-95 animate-scale-in">
      <h3 className="text-xl font-bold text-gray-800 mb-5 text-center">
        Processing Files
      </h3>

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

const ContextMenu = ({ x, y, onClose, onReplace, onClearAll }) => {
  const menuStyle = {
    top: Math.max(0, Math.min(y, window.innerHeight - 100)), // Ensure menu stays within viewport
    left: Math.max(0, Math.min(x, window.innerWidth - 180)), // Ensure menu stays within viewport
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
      {/* Removed "Clear All Pages" button from ContextMenu as it was commented out */}
      {/* Removed "Rotate 90° Clockwise" button from ContextMenu as it was commented out */}
    </div>
  );
};

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white p-5 rounded-xl shadow-2xl flex flex-col items-center space-y-3 animate-scale-in">
        <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
        <span className="text-gray-800 text-base font-medium">
          Replacing page...
        </span>
      </div>
    </div>
  );
};

// Help Modal Component with Retro Gaming UI
const HelpModal = ({ isOpen, onClose }) => {
  // Add ESC key functionality
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: "Ctrl+A", action: "Select all pages" },
    { key: "Delete/Backspace", action: "Delete selected pages" },
    { key: "Escape", action: "Clear selection / Close context menu" },
    { key: "Drag & Drop", action: "Reorder pages" },
    { key: "Right-click", action: "Context menu for page actions" },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      {/* Retro Gaming Modal */}
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 rounded-lg p-1 shadow-2xl animate-pulse" style={{
        boxShadow: '0 0 30px rgba(0, 255, 255, 0.5), inset 0 0 30px rgba(255, 0, 255, 0.3)',
        border: '2px solid #00ffff'
      }}>
        <div className="bg-black rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto relative" style={{
          border: '3px solid #ff00ff',
          boxShadow: 'inset 0 0 20px rgba(0, 255, 255, 0.2)'
        }}>
          {/* Retro Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400" style={{
              textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
              fontFamily: 'monospace'
            }}>
              [ KEYBOARD CONTROLS ]
            </h3>
            <button
              onClick={onClose}
              className="text-cyan-400 hover:text-pink-400 transition-colors duration-300 p-2 rounded border border-cyan-400 hover:border-pink-400 hover:bg-pink-400/10"
              aria-label="Close help modal"
              style={{
                boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
                fontFamily: 'monospace'
              }}
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Keyboard Shortcuts Section */}
            <div className="bg-gradient-to-r from-green-900/50 to-cyan-900/50 p-4 rounded border border-green-400" style={{
              boxShadow: 'inset 0 0 10px rgba(0, 255, 0, 0.2)'
            }}>
              <h4 className="text-lg font-semibold text-green-400 mb-3" style={{
                textShadow: '0 0 5px rgba(0, 255, 0, 0.8)',
                fontFamily: 'monospace'
              }}>
                [ SHORTCUTS ]
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-black/30 rounded border border-green-400/50" style={{
                    boxShadow: '0 0 5px rgba(0, 255, 0, 0.3)'
                  }}>
                    <kbd className="px-2 py-1 bg-green-900 text-green-300 rounded text-sm font-mono border border-green-400" style={{
                      boxShadow: '0 0 5px rgba(0, 255, 0, 0.5)',
                      textShadow: '0 0 3px rgba(0, 255, 0, 0.8)'
                    }}>
                      {shortcut.key}
                    </kbd>
                    <span className="text-green-300 text-sm" style={{ fontFamily: 'monospace' }}>
                      {shortcut.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Retro Tip Box */}
            <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 p-4 rounded border border-yellow-400" style={{
              boxShadow: 'inset 0 0 10px rgba(255, 255, 0, 0.2)'
            }}>
              <div className="text-sm text-yellow-300" style={{ fontFamily: 'monospace' }}>
                <span className="text-yellow-400 font-bold" style={{ textShadow: '0 0 5px rgba(255, 255, 0, 0.8)' }}>
                  [ TIP ]
                </span>
                <br />
                Use the selection checkboxes to perform batch operations on multiple pages at once. 
                You can select all pages with Ctrl+A or click individual checkboxes.
              </div>
            </div>

            {/* Retro Footer */}
            <div className="text-center text-cyan-400 text-sm" style={{ fontFamily: 'monospace' }}>
              <span style={{ textShadow: '0 0 5px rgba(0, 255, 255, 0.8)' }}>
                [ PRESS ESC TO CLOSE ]
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Insert Modal Component
const InsertModal = ({ isOpen, onClose, onInsert, isLoading }) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Add ESC key functionality
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleFiles = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFiles,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    disabled: isLoading,
  });

  const handleInsert = () => {
    if (files.length > 0) {
      onInsert(files);
    }
  };

  const handleClose = () => {
    setFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 rounded-lg p-1 shadow-2xl" style={{
        boxShadow: '0 0 30px rgba(0, 255, 0, 0.5), inset 0 0 30px rgba(0, 255, 255, 0.3)',
        border: '2px solid #00ff00'
      }}>
        <div className="bg-black rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto relative" style={{
          border: '3px solid #00ffff',
          boxShadow: 'inset 0 0 20px rgba(0, 255, 0, 0.2)'
        }}>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400" style={{
              textShadow: '0 0 10px rgba(0, 255, 0, 0.8)',
              fontFamily: 'monospace'
            }}>
              [ INSERT PAGES ]
            </h3>
            <button
              onClick={handleClose}
              className="text-green-400 hover:text-purple-400 transition-colors duration-300 p-2 rounded border border-green-400 hover:border-purple-400 hover:bg-purple-400/10"
              aria-label="Close insert modal"
              style={{
                boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                fontFamily: 'monospace'
              }}
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* File Upload Area */}
            <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 p-4 rounded border border-green-400" style={{
              boxShadow: 'inset 0 0 10px rgba(0, 255, 0, 0.2)'
            }}>
              <h4 className="text-lg font-semibold text-green-400 mb-3" style={{
                textShadow: '0 0 5px rgba(0, 255, 0, 0.8)',
                fontFamily: 'monospace'
              }}>
                [ SELECT FILES ]
              </h4>
              
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
                  ${dragActive ? 'border-green-400 bg-green-400/10' : 'border-green-400/50 hover:border-green-400'}
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                style={{
                  boxShadow: dragActive ? '0 0 20px rgba(0, 255, 0, 0.3)' : 'none'
                }}
              >
                <input {...getInputProps()} />
                <div className="space-y-3">
                  <div className="text-green-300 text-lg" style={{ fontFamily: 'monospace' }}>
                    {files.length > 0 ? `${files.length} file(s) selected` : 'Drag & drop files here, or click to select'}
                  </div>
                  <div className="text-green-400/70 text-sm" style={{ fontFamily: 'monospace' }}>
                    Supports PDF, JPG, JPEG, PNG formats
                  </div>
                  {files.length > 0 && (
                    <div className="text-green-300 text-sm mt-4">
                      <div className="font-bold mb-2">Selected files:</div>
                      {files.map((file, index) => (
                        <div key={index} className="text-left bg-black/30 p-2 rounded border border-green-400/30 mb-1 flex items-center justify-between group">
                          <span className="flex-1">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          <button
                            onClick={() => {
                              const newFiles = files.filter((_, i) => i !== index);
                              setFiles(newFiles);
                            }}
                            className="ml-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                            title="Remove file"
                            aria-label="Remove file"
                          >
                            <XCircle className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleInsert}
                disabled={files.length === 0 || isLoading}
                className={`
                  px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2
                  ${files.length === 0 || isLoading
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white hover:scale-105'
                  }
                `}
                style={{
                  boxShadow: files.length > 0 && !isLoading ? '0 0 15px rgba(0, 255, 0, 0.5)' : 'none'
                }}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Insert Pages
              </button>
            </div>

            {/* Info */}
            <div className="text-center text-green-400/70 text-sm" style={{ fontFamily: 'monospace' }}>
              <span style={{ textShadow: '0 0 5px rgba(0, 255, 0, 0.5)' }}>
                [ PRESS ESC TO CLOSE ]
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [replaceLoading, setReplaceLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedPages, setSelectedPages] = useState(new Set()); // For batch actions
  const cancelProcessingRef = useRef(false);
  const pdfCacheRef = useRef(new Map());
  const fileInputRef = useRef(null);
  const dragOverTimeoutRef = useRef(null);
  const [showHelp, setShowHelp] = useState(false);
  
  // Insert functionality state
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [insertAfterIndex, setInsertAfterIndex] = useState(null);
  const [insertLoading, setInsertLoading] = useState(false);

  const [notification, setNotification] = useState({ message: "", type: "" });

  const showNotification = useCallback((message, type = "info") => {
    setNotification({ message, type });
  }, []);

  const clearNotification = useCallback(() => {
    setNotification({ message: "", type: "" });
  }, []);

  // Enhanced page operations with animations
  const addPageWithAnimation = useCallback((pageObj) => {
    setPages(prevPages => {
      const newPages = [...prevPages, { ...pageObj, animateIn: true }];
      // Remove animation class after animation completes
      setTimeout(() => {
        setPages(currentPages => 
          currentPages.map(p => ({ ...p, animateIn: false }))
        );
      }, 300);
      return newPages;
    });
  }, []);

  // Enhanced page operations with animations
  const removePageWithAnimation = useCallback((indexToRemove) => {
<<<<<<< HEAD
    logger.debug(`Attempting to remove page at index: ${indexToRemove}`);
=======
    console.log(`Attempting to remove page at index: ${indexToRemove}`);
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
    
    setPages(prevPages => {
      // Validate index
      if (indexToRemove < 0 || indexToRemove >= prevPages.length) {
<<<<<<< HEAD
        logger.error(`Invalid index to remove: ${indexToRemove}, total pages: ${prevPages.length}`, null, 'PDFManipulator');
=======
        console.error(`Invalid index to remove: ${indexToRemove}, total pages: ${prevPages.length}`);
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
        return prevPages;
      }
      
      const pageToRemove = prevPages[indexToRemove];
<<<<<<< HEAD
      logger.debug(`Page to remove`, { index: indexToRemove, file: pageToRemove.file?.name, preview: pageToRemove.preview?.substring(0, 30) });
=======
      console.log(`Page to remove:`, { index: indexToRemove, file: pageToRemove.file?.name, preview: pageToRemove.preview?.substring(0, 30) });
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
      
      // Mark the specific page for animation
      const newPages = prevPages.map((page, index) => 
        index === indexToRemove ? { ...page, animateOut: true, removeIndex: indexToRemove } : page
      );
      
      // Remove the page after animation using the stored index
      setTimeout(() => {
        setPages(currentPages => {
          // Find the page with the stored removeIndex
          const pageIndex = currentPages.findIndex(page => page.removeIndex === indexToRemove);
          if (pageIndex !== -1) {
<<<<<<< HEAD
            logger.success(`Successfully removing page at index ${pageIndex}`);
=======
            console.log(`Successfully removing page at index ${pageIndex}`);
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
            const filteredPages = currentPages.filter((_, index) => index !== pageIndex);
            showNotification("Page removed successfully!", "success");
            return filteredPages;
          }
<<<<<<< HEAD
          logger.warn(`Page with removeIndex ${indexToRemove} not found`);
=======
          console.warn(`Page with removeIndex ${indexToRemove} not found`);
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
          return currentPages;
        });
      }, 200);
      
      return newPages;
    });
  }, [showNotification]);

  // Batch selection functions
  const togglePageSelection = useCallback((index) => {
    setSelectedPages(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(index)) {
        newSelection.delete(index);
      } else {
        newSelection.add(index);
      }
      return newSelection;
    });
  }, []);

  const selectAllPages = useCallback(() => {
    setSelectedPages(new Set(pages.map((_, index) => index)));
  }, [pages]);

  const clearSelection = useCallback(() => {
    setSelectedPages(new Set());
  }, []);

  // Batch operations
  const batchDelete = useCallback(() => {
    if (selectedPages.size === 0) return;
    
    setPages(prevPages => {
      const newPages = prevPages.filter((_, index) => !selectedPages.has(index));
      showNotification(`${selectedPages.size} pages deleted!`, "success");
      return newPages;
    });
    setSelectedPages(new Set());
  }, [selectedPages, showNotification]);

  const batchRotate = useCallback(async (angle) => {
    if (selectedPages.size === 0) return;
    
    setPages(prevPages => {
      const newPages = prevPages.map((page, index) => {
        if (selectedPages.has(index)) {
          const currentRotation = page.rotation || 0;
          const newRotation = (currentRotation + angle) % 360;
          
          return { 
            ...page, 
            rotation: newRotation
          };
        }
        return page;
      });
      showNotification(`${selectedPages.size} pages rotated by ${angle}°!`, "info");
      return newPages;
    });
  }, [selectedPages, showNotification]);

  // Insert functionality
  const handleInsertPage = useCallback((index) => {
    // Handle special cases for inserting at start or end
    let actualIndex = index;
    if (index === -1) {
      // Insert at the beginning
      actualIndex = -1;
    } else if (index === pages.length - 1 && pages.length > 0) {
      // Insert at the end
      actualIndex = pages.length - 1;
    }
    
    setInsertAfterIndex(actualIndex);
    setShowInsertModal(true);
  }, [pages.length]);

  const handleInsertFiles = useCallback(async (files) => {
    if (files.length === 0 || insertAfterIndex === null) return;

    // Declare modal variables at function level
    let modalCleanup = () => {};
    let modalRoot = null;

    try {
      setInsertLoading(true);
      setShowInsertModal(false);
      
      // Show progress modal for better UX
      try {
        const { root: root, cleanup } = createRootForModal();
        modalRoot = root;
        modalCleanup = cleanup;
        
        modalRoot.render(
          <ProgressModal
            progress={0}
            status="Preparing to insert files..."
            currentPage={0}
            totalPages={1}
            onCancel={() => {
              modalCleanup();
              setInsertLoading(false);
            }}
          />
        );
      } catch (error) {
        console.error("Failed to create progress modal:", error);
        showNotification("Processing files for insertion...", "info");
      }

      const newPages = [];
      let totalPages = 0;
      let processedPages = 0;

      // First pass: count total pages
      for (const file of files) {
        if (file.type === "application/pdf") {
          const pdfDoc = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
          totalPages += pdfDoc.numPages;
        } else {
          totalPages += 1; // Image files count as 1 page each
        }
      }

      // Second pass: process files
      for (const file of files) {
        if (file.type === "application/pdf") {
          const pdfDoc = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
          
          for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: 0.5 });
            
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            await page.render(renderContext).promise;
            
            const preview = canvas.toDataURL("image/jpeg", 0.8);
            
            newPages.push({
              preview,
              file: file,
              pageIndex: pageNum - 1, // Convert to 0-based index
              type: "pdf", // Add type field
              totalPages: pdfDoc.numPages,
              dimensions: {
                width: viewport.width,
                height: viewport.height,
              },
              rotation: 0,
              animateIn: true,
            });

            processedPages++;
            // Update progress modal
            const progress = (processedPages / totalPages) * 100;
            try {
              modalRoot.render(
                <ProgressModal
                  progress={progress}
                  status={`Processing page ${processedPages} of ${totalPages}`}
                  currentPage={processedPages}
                  totalPages={totalPages}
                  onCancel={() => {
                    modalCleanup();
                    setInsertLoading(false);
                  }}
                />
              );
            } catch (error) {
              console.error("Failed to update progress modal:", error);
            }
          }
        } else {
          // Handle image files
          const img = new Image();
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
          });
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const preview = canvas.toDataURL("image/jpeg", 0.8);
          
          newPages.push({
            preview,
            file: file,
            pageIndex: 0, // Use pageIndex instead of pageNumber
            type: "image", // Add type field
            totalPages: 1,
            dimensions: {
              width: img.width,
              height: img.height,
            },
            rotation: 0,
            animateIn: true,
          });

          processedPages++;
          // Update progress for image files too
          const progress = (processedPages / totalPages) * 100;
          try {
            modalRoot.render(
              <ProgressModal
                progress={progress}
                status={`Processing file ${processedPages} of ${totalPages}`}
                currentPage={processedPages}
                totalPages={totalPages}
                onCancel={() => {
                  modalCleanup();
                  setInsertLoading(false);
                }}
              />
            );
          } catch (error) {
            console.error("Failed to update progress modal:", error);
          }
        }
      }

      // Insert the new pages after the specified index
      setPages(prevPages => {
        const updatedPages = [...prevPages];
        if (insertAfterIndex === -1) {
          // Insert at the beginning
          updatedPages.splice(0, 0, ...newPages);
        } else {
          // Insert after the specified index
          updatedPages.splice(insertAfterIndex + 1, 0, ...newPages);
        }
        return updatedPages;
      });

      // Remove animation classes after animation completes
      setTimeout(() => {
        setPages(currentPages => 
          currentPages.map(p => ({ ...p, animateIn: false }))
        );
      }, 300);

      // Show final progress
      try {
        modalRoot.render(
          <ProgressModal
            progress={100}
            status="Inserting pages into document..."
            currentPage={totalPages}
            totalPages={totalPages}
            onCancel={() => {
              modalCleanup();
              setInsertLoading(false);
            }}
          />
        );
      } catch (error) {
        console.error("Failed to update final progress modal:", error);
      }
      
      showNotification(`${newPages.length} pages inserted successfully!`, "success");
      setInsertAfterIndex(null);
      
      // Cleanup modal
      setTimeout(() => {
        modalCleanup();
      }, 1000);

    } catch (error) {
      handleError(error, "inserting pages");
    } finally {
      setInsertLoading(false);
      // Ensure modal cleanup
      if (modalCleanup) {
        modalCleanup();
      }
    }
  }, [insertAfterIndex, showNotification]);

  // Cleanup object URLs when component unmounts or pages change
  const activePreviewUrls = useRef(new Set());
  useEffect(() => {
    const currentPreviews = new Set(pages.map((p) => p.preview));
    const toRevoke = new Set();

    activePreviewUrls.current.forEach((url) => {
      if (!currentPreviews.has(url)) {
        toRevoke.add(url);
      }
    });

    toRevoke.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    activePreviewUrls.current = currentPreviews;
  }, [pages]);

  // Cleanup for component unmount
  useEffect(() => {
    return () => {
      pages.forEach((page) => {
        if (page.preview) {
          URL.revokeObjectURL(page.preview);
        }
      });
      pdfCacheRef.current.clear(); // Clear PDF document cache
      if (dragOverTimeoutRef.current) {
        clearTimeout(dragOverTimeoutRef.current);
      }
    };
  }, []);

  const handleDragStart = useCallback((e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("scale-[0.98]", "opacity-70", "shadow-2xl");
  }, []);

  const handleDragEnd = useCallback((e) => {
    setDraggedItem(null);
    setDragOverIndex(null); // Clear drag over indicator
    e.currentTarget.classList.remove(
      "scale-[0.98]",
      "opacity-70",
      "shadow-2xl"
    );
  }, []);

  const handleDragOver = useCallback(
    (e, index) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      if (draggedItem === null || draggedItem === index) {
        setDragOverIndex(null);
        return;
      }

      setDragOverIndex(index); // Set the index for visual feedback

      if (dragOverTimeoutRef.current) {
        clearTimeout(dragOverTimeoutRef.current);
      }

      // Debounce the actual state update for reordering
      dragOverTimeoutRef.current = setTimeout(() => {
        setPages((prevPages) => {
          const newPages = [...prevPages];
          const [draggedPage] = newPages.splice(draggedItem, 1);
          newPages.splice(index, 0, draggedPage);
          return newPages;
        });
        setDraggedItem(index); // Update dragged item index to follow its new position
      }, 100); // Adjust debounce time as needed
    },
    [draggedItem, pages]
  );

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null); // Clear indicator when dragging off an item
  }, []);

  // Function to create rotated preview
  const createRotatedPreview = useCallback((previewUrl, rotation) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size based on rotation
        if (rotation === 90 || rotation === 270) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }
        
        // Move to center and rotate
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        canvas.toBlob((blob) => {
          resolve(URL.createObjectURL(blob));
        }, 'image/jpeg', 0.9);
      };
      img.src = previewUrl;
    });
  }, []);

  const handleContextMenu = useCallback((e, page, index) => {
    e.preventDefault();
    const menuX = e.clientX;
    const menuY = e.clientY;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const menuWidth = 180;
    const menuHeight = 90; // Approx height for 2 buttons

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
      fileInputRef.current.value = "";
      fileInputRef.current.dataset.pageIndex = contextMenu.pageIndex;
      fileInputRef.current.click();
    }
  }, [contextMenu]);

  const handleRotatePage = useCallback(
    (angle) => {
      if (contextMenu === null) return;
      const pageIndexToRotate = contextMenu.pageIndex;

      setPages((prevPages) => {
        const updatedPages = [...prevPages];
        const pageToUpdate = { ...updatedPages[pageIndexToRotate] };

        const currentRotation = pageToUpdate.rotation || 0;
        const newRotation = (currentRotation + angle) % 360;
        pageToUpdate.rotation = newRotation;

        updatedPages[pageIndexToRotate] = pageToUpdate;
        return updatedPages;
      });
      showNotification(
        `Page ${
          pageIndexToRotate + 1
        } rotated by ${angle} degrees! (Applies to final PDF)`,
        "info"
      );
      setContextMenu(null);
    },
    [contextMenu, showNotification]
  );

  // Helper function to process a single file (PDF or Image) into page data with progress updates
  const processFileIntoPageData = async (file, progressCallback = () => {}) => {
    let newPagesData = [];
    if (file.type === FILE_TYPES.PDF) {
      let pdfDocument = pdfCacheRef.current.get(file);
      if (!pdfDocument) {
        const arrayBuffer = await file.arrayBuffer();
        pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        pdfCacheRef.current.set(file, pdfDocument);
      }
      const totalFilePages = pdfDocument.numPages;

      progressCallback("Extracting pages from PDF", 0, totalFilePages);
      for (let i = 0; i < totalFilePages; i++) {
        const page = await pdfDocument.getPage(i + 1);
        // Use higher scale for better quality
        const viewport = page.getViewport({ scale: 0.5 }); // Increased from 0.3 for better quality
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
        progressCallback("Extracting pages from PDF", i + 1, totalFilePages);

        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", 0.9) // Increased quality from 0.7
        );
        newPagesData.push({
          file,
          pageIndex: i,
          type: "pdf",
          preview: URL.createObjectURL(blob),
          dimensions: { width: viewport.width, height: viewport.height },
          rotation: 0,
        });
        canvas.width = 0;
        canvas.height = 0;
      }
    } else {
      // Image file - create thumbnail for faster loading
      const img = new Image();
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
      
      // Create thumbnail with better quality
      const maxSize = 400; // Increased from 300 for better quality
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      context.drawImage(img, 0, 0, width, height);
      
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9) // Increased quality from 0.7
      );
      
      newPagesData.push({
        file,
        pageIndex: 0,
        type: "image",
        preview: URL.createObjectURL(blob),
        dimensions: { width, height },
        rotation: 0,
      });
      
      URL.revokeObjectURL(img.src);
      canvas.width = 0;
      canvas.height = 0;
    }
    return newPagesData;
  };

  // Better error handling
  const handleError = useCallback((error, context = "processing") => {
    console.error(`Error ${context}:`, error);
    
    let userMessage = "An unexpected error occurred.";
    
    if (error.message.includes("Invalid PDF")) {
      userMessage = "The PDF file appears to be corrupted or invalid. Please try a different file.";
    } else if (error.message.includes("Password")) {
      userMessage = "This PDF is password protected. Please unlock it first using our PDF Unlocker tool.";
    } else if (error.message.includes("File too large")) {
      userMessage = "The file is too large. Please try a smaller file or compress it first.";
    } else if (error.message.includes("Unsupported")) {
      userMessage = "This file type is not supported. Please use PDF, JPG, JPEG, or PNG files.";
    } else if (error.message.includes("Network")) {
      userMessage = "Network error. Please check your connection and try again.";
    }
    
    showNotification(userMessage, "error");
  }, [showNotification]);

  const handleFileSelect = useCallback(
    async (event) => {
      const file = event.target.files[0];
      const pageIndexToReplace = parseInt(event.target.dataset.pageIndex);

      if (!file || isNaN(pageIndexToReplace)) {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
          delete fileInputRef.current.dataset.pageIndex;
        }
        return;
      }

      try {
        if (!Object.values(FILE_TYPES).includes(file.type)) {
          showNotification(
            "Please select a valid PDF or image file (PDF, JPG, JPEG, PNG).",
            "error"
          );
          return;
        }

        setReplaceLoading(true);

        const replacementPages = await processFileIntoPageData(file);

        setPages((prevPages) => {
          const updatedPages = [...prevPages];
          // Remove 1 page at pageIndexToReplace and insert all replacementPages
          // If replacement is a multi-page PDF, it will insert all its pages
          updatedPages.splice(pageIndexToReplace, 1, ...replacementPages);
          return updatedPages;
        });
        showNotification("Page(s) replaced successfully!", "success");
      } catch (error) {
        console.error("Error replacing page:", error);
        showNotification("Error replacing page: " + error.message, "error");
      } finally {
        setReplaceLoading(false);
        setContextMenu(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
          delete fileInputRef.current.dataset.pageIndex;
        }
      }
    },
    [showNotification]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenu &&
        event.target &&
        !event.target.closest(".context-menu")
      ) {
        setContextMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [contextMenu]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'a':
            e.preventDefault();
            selectAllPages();
            break;
          case 'Delete':
          case 'Backspace':
            e.preventDefault();
            if (selectedPages.size > 0) {
              batchDelete();
            }
            break;
        }
      } else {
        switch (e.key) {
          case 'Escape':
            clearSelection();
            setContextMenu(null);
            break;
          case 'Delete':
          case 'Backspace':
            if (selectedPages.size > 0) {
              e.preventDefault();
              batchDelete();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectAllPages, clearSelection, batchDelete, selectedPages]);

  const createRootForModal = () => {
    const progressDiv = document.createElement("div");
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

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      cancelProcessingRef.current = false;
      let modalCleanup = () => {};
      let newOverallPages = [];

      try {
        const { root: modalRoot, cleanup } = createRootForModal();
        modalCleanup = cleanup;

        setIsLoading(true);

        const invalidFiles = acceptedFiles.filter(
          (file) => !Object.values(FILE_TYPES).includes(file.type)
        );
        if (invalidFiles.length > 0) {
          const fileNames = invalidFiles.map(f => f.name).join(", ");
          showNotification(
            `Unsupported files: ${fileNames}. Please use PDF, JPG, JPEG, or PNG files.`,
            "error"
          );
          throw new Error("Unsupported file types detected.");
        }

        // Check file sizes
        const maxSize = 50 * 1024 * 1024; // 50MB
        const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize);
        if (oversizedFiles.length > 0) {
          const fileNames = oversizedFiles.map(f => f.name).join(", ");
          showNotification(
            `Files too large: ${fileNames}. Please use files smaller than 50MB.`,
            "error"
          );
          throw new Error("Files too large");
        }

        let totalExpectedPages = 0;
        for (const file of acceptedFiles) {
          if (file.type === FILE_TYPES.PDF) {
            let pdfDoc = pdfCacheRef.current.get(file);
            if (!pdfDoc) {
              const pdfData = await file.arrayBuffer();
              pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
              pdfCacheRef.current.set(file, pdfDoc);
            }
            totalExpectedPages += pdfDoc.numPages;
          } else {
            totalExpectedPages += 1;
          }
        }

        let cumulativePagesProcessed = 0;

<<<<<<< HEAD
        logger.info(`Starting to process ${acceptedFiles.length} files, expecting ${totalExpectedPages} total pages`);
=======
        console.log(`Starting to process ${acceptedFiles.length} files, expecting ${totalExpectedPages} total pages`);
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
        
        for (let fileIndex = 0; fileIndex < acceptedFiles.length; fileIndex++) {
          if (cancelProcessingRef.current) break;

          const file = acceptedFiles[fileIndex];
<<<<<<< HEAD
          logger.info(`Processing file ${fileIndex + 1}/${acceptedFiles.length}: ${file.name} (${file.type})`);
=======
          console.log(`Processing file ${fileIndex + 1}/${acceptedFiles.length}: ${file.name} (${file.type})`);
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1

          const updateCurrentFileProgress = (
            statusText = "Processing files",
            currentPageNum,
            totalPagesInFile
          ) => {
            modalRoot.render(
              <ProgressModal
                progress={
                  ((cumulativePagesProcessed + currentPageNum) /
                    totalExpectedPages) *
                  100
                }
                status={`${statusText} (File ${fileIndex + 1}/${acceptedFiles.length})`}
                currentPage={cumulativePagesProcessed + currentPageNum}
                totalPages={totalExpectedPages}
                onCancel={() => {
                  cancelProcessingRef.current = true;
                  modalCleanup();
                }}
              />
            );
          };

          // Progressive loading: processFileIntoPageData yields pages one by one
          if (file.type === FILE_TYPES.PDF) {
            let pdfDocument = pdfCacheRef.current.get(file);
            if (!pdfDocument) {
              const arrayBuffer = await file.arrayBuffer();
              pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
              pdfCacheRef.current.set(file, pdfDocument);
            }
            const totalFilePages = pdfDocument.numPages;
            updateCurrentFileProgress("Extracting pages from PDF", 0, totalFilePages);
            for (let i = 0; i < totalFilePages; i++) {
              try {
                const page = await pdfDocument.getPage(i + 1);
                const viewport = page.getViewport({ scale: 0.3 });
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport: viewport }).promise;
                updateCurrentFileProgress("Extracting pages from PDF", i + 1, totalFilePages);
                const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.7));
                const pageObj = {
                  file,
                  pageIndex: i,
                  type: "pdf",
                  preview: URL.createObjectURL(blob),
                  dimensions: { width: viewport.width, height: viewport.height },
                  rotation: 0,
                };
                newOverallPages.push(pageObj);
                addPageWithAnimation(pageObj); // Use animated add
<<<<<<< HEAD
                logger.success(`Successfully processed PDF page ${i + 1}/${totalFilePages} from ${file.name}`);
=======
                console.log(`Successfully processed PDF page ${i + 1}/${totalFilePages} from ${file.name}`);
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
                canvas.width = 0;
                canvas.height = 0;
              } catch (error) {
                handleError(error, `processing PDF page ${i + 1}`);
                continue;
              }
            }
          } else {
            // Image file
            try {
              const img = new Image();
              const canvas = document.createElement("canvas");
              const context = canvas.getContext("2d");
              
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = URL.createObjectURL(file);
              });
              
              const maxSize = 300;
              let { width, height } = img;
              if (width > maxSize || height > maxSize) {
                const ratio = Math.min(maxSize / width, maxSize / height);
                width *= ratio;
                height *= ratio;
              }
              
              canvas.width = width;
              canvas.height = height;
              context.drawImage(img, 0, 0, width, height);
              
              const blob = await new Promise((resolve) =>
                canvas.toBlob(resolve, "image/jpeg", 0.7)
              );
              
              const pageObj = {
                file,
                pageIndex: 0,
                type: "image",
                preview: URL.createObjectURL(blob),
                dimensions: { width, height },
                rotation: 0,
              };
              newOverallPages.push(pageObj);
              addPageWithAnimation(pageObj); // Use animated add
<<<<<<< HEAD
              logger.success(`Successfully processed image file: ${file.name}`);
=======
              console.log(`Successfully processed image file: ${file.name}`);
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
              
              URL.revokeObjectURL(img.src);
              canvas.width = 0;
              canvas.height = 0;
            } catch (error) {
              handleError(error, `processing image file ${file.name}`);
              continue;
            }
          }
          cumulativePagesProcessed += (file.type === FILE_TYPES.PDF && pdfCacheRef.current.get(file)) ? pdfCacheRef.current.get(file).numPages : 1;
        }

        if (cancelProcessingRef.current) {
          showNotification("File processing was cancelled.", "info");
          newOverallPages.forEach((page) => URL.revokeObjectURL(page.preview));
          return;
        }

<<<<<<< HEAD
        logger.info(`File processing complete. Processed ${newOverallPages.length} pages out of ${totalExpectedPages} expected pages`);
=======
        console.log(`File processing complete. Processed ${newOverallPages.length} pages out of ${totalExpectedPages} expected pages`);
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
        showNotification("Files added and processed successfully!", "success");
      } catch (error) {
        handleError(error, "processing files");
        newOverallPages.forEach((page) => URL.revokeObjectURL(page.preview));
      } finally {
        setIsLoading(false);
        modalCleanup();
      }
    },
    [showNotification, handleError, addPageWithAnimation]
  );

  const createFinalPDF = async () => {
    if (pages.length === 0) {
      showNotification(
        "Please add files to combine before downloading.",
        "info"
      );
      return;
    }

    let modalCleanup = () => {};

    try {
      const { root: modalRoot, cleanup } = createRootForModal();
      modalCleanup = cleanup;

      setIsLoading(true);
      cancelProcessingRef.current = false;
      const pdfDoc = await PDFDocument.create();
      const pdfLibCache = new Map(); // Cache for PDFDocument.load instances

      const totalItemsToProcess = pages.length;
<<<<<<< HEAD
      logger.info(`Starting PDF creation with ${totalItemsToProcess} pages:`, pages.map(p => ({ type: p.type, file: p.file?.name, pageIndex: p.pageIndex })));
=======
      console.log(`Starting PDF creation with ${totalItemsToProcess} pages:`, pages.map(p => ({ type: p.type, file: p.file?.name, pageIndex: p.pageIndex })));
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
      
      // Validate page structure
      const invalidPages = pages.filter(p => !p.type || (p.type === 'pdf' && typeof p.pageIndex !== 'number'));
      if (invalidPages.length > 0) {
<<<<<<< HEAD
        logger.warn('Invalid pages found:', invalidPages);
=======
        console.error('Invalid pages found:', invalidPages);
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
        showNotification(`Found ${invalidPages.length} pages with invalid structure. PDF creation may fail.`, "error");
      }

      for (let i = 0; i < totalItemsToProcess; i++) {
        if (cancelProcessingRef.current) {
          throw new Error("PDF creation cancelled by user.");
        }

        const page = pages[i];
<<<<<<< HEAD
        logger.info(`Processing page ${i + 1}/${totalItemsToProcess}:`, { type: page.type, file: page.file?.name, pageIndex: page.pageIndex });
=======
        console.log(`Processing page ${i + 1}/${totalItemsToProcess}:`, { type: page.type, file: page.file?.name, pageIndex: page.pageIndex });
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
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

        if (page.type === "pdf") {
          try {
            let srcDoc = pdfLibCache.get(page.file);
            if (!srcDoc) {
              const arrayBuffer = await page.file.arrayBuffer();
              srcDoc = await PDFDocument.load(arrayBuffer);
              pdfLibCache.set(page.file, srcDoc);
            }
            const [copiedPage] = await pdfDoc.copyPages(srcDoc, [
              page.pageIndex,
            ]);
            copiedPage.setRotation(degrees(page.rotation || 0)); // Apply rotation
            pdfDoc.addPage(copiedPage);
<<<<<<< HEAD
            logger.success(`Successfully added PDF page ${i + 1} (pageIndex: ${page.pageIndex}) from file: ${page.file.name}`);
=======
            console.log(`Successfully added PDF page ${i + 1} (pageIndex: ${page.pageIndex}) from file: ${page.file.name}`);
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
          } catch (error) {
            logger.error(
              `Error embedding PDF page ${i + 1} from file ${page.file.name}:`,
              error
            );
            showNotification(
              `Failed to embed PDF page ${i + 1} from ${
                page.file.name
              }. Skipping page.`,
              "error"
            );
            continue;
          }
        } else if (page.type === "image") {
          try {
            const imageBytes = await page.file.arrayBuffer();
            let image;
            if (page.file.type.includes("jpeg")) {
              image = await pdfDoc.embedJpg(imageBytes);
            } else if (page.file.type.includes("png")) {
              image = await pdfDoc.embedPng(imageBytes);
            } else {
              logger.warn(
                `Unsupported image type for page ${i + 1}: ${page.file.type}`
              );
              showNotification(
                `Unsupported image type for page ${i + 1} from ${
                  page.file.name
                }. Skipping page.`,
                "error"
              );
              continue;
            }

            if (image) {
              const { width, height } = image.scale(1);
              const newPage = pdfDoc.addPage([width, height]);
              newPage.drawImage(image, {
                x: 0,
                y: 0,
                width,
                height,
                rotate: degrees(page.rotation || 0), // Apply rotation
              });
<<<<<<< HEAD
              logger.success(`Successfully added image page ${i + 1} from file: ${page.file.name}`);
=======
              console.log(`Successfully added image page ${i + 1} from file: ${page.file.name}`);
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
            }
          } catch (error) {
            logger.error(
              `Error embedding image page ${i + 1} from file ${
                page.file.name
              }:`,
              error
            );
            showNotification(
              `Failed to embed image page ${i + 1} from ${
                page.file.name
              }. Skipping page.`,
              "error"
            );
            continue;
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      if (cancelProcessingRef.current) {
        showNotification("PDF creation cancelled by user.", "info");
        throw new Error("PDF creation cancelled by user.");
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
<<<<<<< HEAD
      logger.success(`Final PDF created with ${pdfDoc.getPageCount()} pages out of ${totalItemsToProcess} requested pages`);
=======
      console.log(`Final PDF created with ${pdfDoc.getPageCount()} pages out of ${totalItemsToProcess} requested pages`);
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "merged_and_ordered_document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setTimeout(modalCleanup, 1500);
      showNotification("PDF created and downloaded successfully!", "success");
    } catch (error) {
      logger.error("Error during PDF creation:", error);
      if (
        !error.message.includes("PDF creation cancelled by user.") &&
        !error.message.includes("Failed to embed") &&
        !error.message.includes("Unsupported image type")
      ) {
        showNotification(
          error.message ||
            "An error occurred while creating the PDF. Please check console for details.",
          "error"
        );
      }
      // Do not revoke object URLs here, as they are managed by the useEffect for active previews
      modalCleanup();
    } finally {
      setIsLoading(false);
      if (modalCleanup) modalCleanup();
    }
  };

  const handleClearAll = useCallback(() => {
    pages.forEach((page) => {
      if (page.preview) {
        URL.revokeObjectURL(page.preview);
      }
    });
    setPages([]);
    pdfCacheRef.current.clear(); // Clear the PDF document cache as well
    showNotification("All pages cleared!", "info");
  }, [pages, showNotification]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    disabled: isLoading || replaceLoading, // Disable dropzone during any loading
  });

  // Features to display when no files are loaded
  const featuresList = [
    "Combine multiple PDF documents into one.",
    "Merge images (JPG, JPEG, PNG) with PDF files.",
    "Reorder pages with simple drag & drop.",
    "Replace individual pages within your document.",
    "Batch select and operate on multiple pages.",
    "Rotate pages individually or in batches.",
    "Export as PDF or high-quality images.",
    "Download your combined document as a new PDF.",
    // Removed "Compress PDF files for smaller file sizes."
  ];

  // Multiple export options (removed ZIP)
  const exportIndividualImages = async () => {
    if (pages.length === 0) {
      showNotification("Please add files to export as images.", "info");
      return;
    }

    try {
      setIsLoading(true);
      showNotification("Preparing high-quality images...", "info");

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        // Create high-quality image
        const img = new Image();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = page.preview;
        });
        
        // Use original dimensions for high quality
        canvas.width = page.dimensions.width || img.width;
        canvas.height = page.dimensions.height || img.height;
        
        // Apply rotation if any
        if (page.rotation && page.rotation !== 0) {
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((page.rotation * Math.PI) / 180);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
        } else {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        
        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", 0.95) // Very high quality
        );
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `page_${i + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        
        // Small delay to prevent browser from blocking multiple downloads
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      showNotification("High-quality images exported successfully!", "success");
    } catch (error) {
      handleError(error, "exporting individual images");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-white font-sans antialiased relative">
      <div className={`container mx-auto pt-16 pb-8 md:pt-24 md:pb-12 space-y-8 relative z-10 ${pages.length === 0 ? 'flex flex-col items-center' : ''}`}>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 drop-shadow-md animate-fade-in-down">
            PDF & Image Combiner
          </h1>
          <button
            onClick={() => setShowHelp(true)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 relative group"
            title="Keyboard Shortcuts"
            aria-label="Keyboard Shortcuts"
            style={{
              transform: 'perspective(1000px) rotateX(15deg)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 255, 255, 0.2)'
            }}
          >
            <Keyboard className="w-6 h-6 text-white group-hover:text-cyan-400 transition-all duration-300" style={{
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))',
              transform: 'translateZ(10px)'
            }} />
          </button>
        </div>

        {/* Hidden file input for replacement functionality */}
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
            border-3 border-dashed rounded-2xl p-8 text-center
            transition-all duration-300 ease-in-out cursor-pointer
            ${
              isDragActive
                ? "border-teal-400 bg-teal-400/10 scale-[1.01] shadow-lg"
                : "border-white/30 hover:border-blue-400 hover:bg-blue-400/10"
            }
            ${
              isLoading || replaceLoading
                ? "opacity-70 cursor-not-allowed pointer-events-none"
                : "shadow-md"
            }
            animate-fade-in
          `}
          role="button"
          tabIndex={0}
          aria-label="Drop zone for PDF and image files"
        >
          <input {...getInputProps()} />
          <p className="text-white text-opacity-90 text-lg md:text-xl font-semibold">
            {isDragActive
              ? "Drop your files here!"
              : "Drag & drop PDF files or images, or click to add files"}
          </p>
          <p className="text-white text-opacity-70 text-sm mt-1.5">
            (Supports PDF, JPG, JPEG, PNG formats)
          </p>
        </div>

        {/* Feature List (Conditionally rendered) */}
        {pages.length === 0 && (
        <div className="p-7 space-y-4 bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 animate-fade-in mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">
              What you can do:
            </h2>
            <ul className="list-none p-0 space-y-2 max-w-lg mx-auto text-left">
              {featuresList.map((feature, index) => (
                <li key={index} className="text-white/80 leading-relaxed">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {pages.length > 0 && (
          <div className="p-7 space-y-7 bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 animate-fade-in-up">
            {/* Toolbar with batch actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-1xl font-bold text-white">
                  Your Pages ({pages.length})
                </h2>
              </div>
              
              <div className="flex gap-3">
                {/* Export options */}
                <div className="flex gap-2">
                  <button
                    onClick={createFinalPDF}
                    disabled={isLoading || pages.length === 0}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 ${
                      isLoading || pages.length === 0
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white hover:scale-105"
                    }`}
                    title="Export as PDF"
                    aria-label="Export as PDF"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    PDF
                  </button>
                  <button
                    onClick={exportIndividualImages}
                    disabled={isLoading || pages.length === 0}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 ${
                      isLoading || pages.length === 0
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 text-white hover:scale-105"
                    }`}
                    title="Export individual images"
                    aria-label="Export individual images"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Images
                  </button>
                </div>
              </div>
            </div>

            {/* Selection controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedPages.size === 0 ? (
                  <button
                    onClick={selectAllPages}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                    title="Select all pages (Ctrl+A)"
                    aria-label="Select all pages"
                  >
                    Select All
                  </button>
                ) : (
                  <>
                    <button
                      onClick={clearSelection}
                      className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                      aria-label="Clear selection"
                    >
                      Clear Selection
                    </button>
                    <span className="text-sm text-white/70">
                      {selectedPages.size} page{selectedPages.size !== 1 ? 's' : ''} selected
                    </span>
                  </>
                )}
              </div>
              
              {/* Batch action buttons */}
              {selectedPages.size > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => batchRotate(90)}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                    title="Rotate 90° clockwise"
                    aria-label="Rotate selected pages 90 degrees clockwise"
                  >
                    <RotateCw className="w-4 h-4 mr-1" />
                    Rotate 90°
                  </button>
                  <button
                    onClick={batchDelete}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                    title="Delete selected pages"
                    aria-label="Delete selected pages"
                  >
                    Delete ({selectedPages.size})
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {/* Before First Page Insert Button - Only show when there are pages */}
              {pages.length > 0 && (
                <div className="relative group">
                  <div className="w-full aspect-[3/4] bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center hover:border-green-400 hover:bg-green-400/10 transition-all duration-300 cursor-pointer" onClick={() => handleInsertPage(-1)}>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center shadow-2xl mx-auto mb-2 hover:scale-110 transition-all duration-300" style={{
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
                      }}>
                        <Plus className="w-6 h-6 font-bold" strokeWidth={3} />
                      </div>
                      <div className="text-white/70 text-sm font-medium">Add at Start</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Page Cards */}
              {pages.map((page, index) => (
                <PageCard
                  key={`${page.preview}-${index}`}
                  page={page}
                  index={index}
                  draggedItem={draggedItem}
                  dragOverIndex={dragOverIndex}
                  replaceLoading={replaceLoading}
                  contextMenu={contextMenu}
                  handleDragStart={handleDragStart}
                  handleDragEnd={handleDragEnd}
                  handleDragOver={handleDragOver}
                  handleDragLeave={handleDragLeave}
                  handleContextMenu={handleContextMenu}
                  handleRemovePage={removePageWithAnimation}
                  handleInsertPage={handleInsertPage}
                  togglePageSelection={togglePageSelection}
                  isSelected={selectedPages.has(index)}
                  isFirstPage={index === 0}
                  isLastPage={index === pages.length - 1}
                  totalPages={pages.length}
                />
              ))}

              {/* After Last Page Insert Button - Only show when there are pages */}
              {pages.length > 0 && (
                <div className="relative group">
                  <div className="w-full aspect-[3/4] bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center hover:border-green-400 hover:bg-green-400/10 transition-all duration-300 cursor-pointer" onClick={() => handleInsertPage(pages.length - 1)}>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center shadow-2xl mx-auto mb-2 hover:scale-110 transition-all duration-300" style={{
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
                      }}>
                        <Plus className="w-6 h-6 font-bold" strokeWidth={3} />
                      </div>
                      <div className="text-white/70 text-sm font-medium">Add at End</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onReplace={handleReplacePage}
            onClearAll={handleClearAll}
            onRotate={handleRotatePage}
          />
        )}
        <LoadingOverlay isLoading={replaceLoading} />

        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />

        <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
        
        <InsertModal 
          isOpen={showInsertModal} 
          onClose={() => {
            setShowInsertModal(false);
            setInsertAfterIndex(null);
          }} 
          onInsert={handleInsertFiles}
          isLoading={insertLoading}
        />
      </div>
    </div>
  );
};
export default App;