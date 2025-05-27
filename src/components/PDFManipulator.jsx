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
} from "lucide-react";
// import { Link } from "react-router-dom";
import Notification from "./Notification";
import PageCard from "./PageCard";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

const ContextMenu = ({ x, y, onClose, onReplace, onRotate, onClearAll }) => {
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
      {/* <button
        className="w-full px-3 py-1.5 text-left text-gray-800 text-sm font-medium hover:bg-blue-100 flex items-center transition-colors duration-200"
        onClick={(e) => {
          onClearAll();
          onClose();
        }}
      >
        <Trash2 className="w-4 h-4 mr-2 text-red-600" />
        <span className="text-gray-800">Clear All Pages</span>
      </button> */}
      {/* <button
        className="w-full px-3 py-1.5 text-left text-gray-800 text-sm font-medium hover:bg-blue-100 flex items-center transition-colors duration-200"
        onClick={(e) => {
          onRotate(90); // Rotate by 90 degrees clockwise
          onClose();
        }}
      >
        <RotateCw className="w-4 h-4 mr-2 text-purple-600" />
        <span className="text-gray-800">Rotate 90° Clockwise</span>
      </button> */}
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

// --- Main App Component ---

const App = () => {
  const [pages, setPages] = useState([]); // Added 'rotation: 0' to page object structure
  const [isLoading, setIsLoading] = useState(false);
  const [replaceLoading, setReplaceLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null); // New state for visual drag-over feedback
  const [contextMenu, setContextMenu] = useState(null);
  const cancelProcessingRef = useRef(false);
  const pdfCacheRef = useRef(new Map()); // Cache for parsed PDF.js documents
  const fileInputRef = useRef(null);
  const dragOverTimeoutRef = useRef(null); // Ref for debouncing drag over

  const [notification, setNotification] = useState({ message: "", type: "" });

  const showNotification = useCallback((message, type = "info") => {
    setNotification({ message, type });
  }, []);

  const clearNotification = useCallback(() => {
    setNotification({ message: "", type: "" });
  }, []);

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

  const handleRemovePage = useCallback(
    (indexToRemove) => {
      setPages((prevPages) => {
        const newPages = prevPages.filter(
          (_, index) => index !== indexToRemove
        );
        showNotification("Page removed successfully!", "success");
        return newPages;
      });
    },
    [showNotification]
  );

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

      progressCallback("Extracting pages from PDF", 0, totalFilePages); // Initial progress
      for (let i = 0; i < totalFilePages; i++) {
        const page = await pdfDocument.getPage(i + 1);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
        progressCallback("Extracting pages from PDF", i + 1, totalFilePages); // Update progress for each page

        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", 0.8)
        );
        newPagesData.push({
          file,
          pageIndex: i,
          type: "pdf",
          preview: URL.createObjectURL(blob),
          dimensions: { width: viewport.width, height: viewport.height },
          rotation: 0, // Default rotation
        });
        canvas.width = 0;
        canvas.height = 0;
      }
    } else {
      // Image file
      newPagesData.push({
        file,
        pageIndex: 0,
        type: "image",
        preview: URL.createObjectURL(file),
        dimensions: { width: 0, height: 0 },
        rotation: 0, // Default rotation
      });
    }
    return newPagesData;
  };

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
          showNotification(
            `Unsupported files: ${invalidFiles
              .map((f) => f.name)
              .join(", ")}. Please use PDF, JPG, JPEG, or PNG.`,
            "error"
          );
          throw new Error("Unsupported file types detected.");
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

        for (let fileIndex = 0; fileIndex < acceptedFiles.length; fileIndex++) {
          if (cancelProcessingRef.current) break;

          const file = acceptedFiles[fileIndex];

          const updateCurrentFileProgress = (
            statusText = "Processing files", // Default status text
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
                status={`${statusText} (File ${fileIndex + 1}/${
                  acceptedFiles.length
                })`}
                currentPage={cumulativePagesProcessed + currentPageNum}
                totalPages={totalExpectedPages}
                onCancel={() => {
                  cancelProcessingRef.current = true;
                  modalCleanup();
                }}
              />
            );
          };

          const pagesFromFile = await processFileIntoPageData(
            file,
            updateCurrentFileProgress
          ); // Pass the progress callback
          newOverallPages.push(...pagesFromFile); // Use push for efficiency
          cumulativePagesProcessed += pagesFromFile.length;
        }

        if (cancelProcessingRef.current) {
          showNotification("File processing was cancelled.", "info");
          newOverallPages.forEach((page) => URL.revokeObjectURL(page.preview));
          return;
        }

        setPages((prevPages) => [...prevPages, ...newOverallPages]);
        showNotification("Files added and processed successfully!", "success");
      } catch (error) {
        console.error("Error in onDrop:", error);
        if (
          !error.message.includes("Unsupported files:") &&
          !error.message.includes("Unsupported file types detected.")
        ) {
          showNotification(
            error.message || "An error occurred while processing files.",
            "error"
          );
        }
        newOverallPages.forEach((page) => URL.revokeObjectURL(page.preview));
      } finally {
        setIsLoading(false);
        modalCleanup();
      }
    },
    [showNotification]
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

      for (let i = 0; i < totalItemsToProcess; i++) {
        if (cancelProcessingRef.current) {
          throw new Error("PDF creation cancelled by user.");
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
          } catch (error) {
            console.error(
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
              console.warn(
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
            }
          } catch (error) {
            console.error(
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
      console.error("Error during PDF creation:", error);
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
    "Download your combined document as a new PDF.",
  ];

  return (
    <div className="text-white font-sans antialiased relative">
    <div className={`container mx-auto pt-16 pb-8 md:pt-24 md:pb-12 space-y-8 relative z-10 ${pages.length === 0 ? 'flex flex-col items-center' : ''}`}>
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
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <h2 className="text-1xl font-bold text-white">
                Your Pages ({pages.length})
              </h2>
              <div className="flex gap-3">
                {/* {pages.length > 0 && ( // Show clear all if there are pages
                  <button
                    onClick={handleClearAll}
                    disabled={isLoading || pages.length === 0}
                    className={`px-6 py-2.5 rounded-full flex items-center justify-center font-semibold text-base whitespace-nowrap
                      transition-all duration-300 transform
                      ${isLoading || pages.length === 0
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:scale-105'
                      }
                    `}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </button>
                )} */}
                <button
                  onClick={createFinalPDF}
                  disabled={isLoading || pages.length === 0}
                  className={`px-6 py-2.5 rounded-full flex items-center justify-center font-semibold text-base whitespace-nowrap
                    transition-all duration-300 transform
                    ${
                      isLoading || pages.length === 0
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white shadow-md hover:scale-105"
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
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
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
                  handleDragLeave={handleDragLeave} // Pass the new handler
                  handleContextMenu={handleContextMenu}
                  handleRemovePage={handleRemovePage}
                />
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
      </div>
    </div>
  );
};
export default App;
