import React, { useState, useCallback, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useDropzone } from "react-dropzone";
import { PDFDocument, degrees } from "pdf-lib"; // Import degrees for rotation
import * as pdfjsLib from "pdfjs-dist";
import {
  FileText,
  Download,
  Loader2,
  Lock,
  Plus,
  UploadCloud,
} from "lucide-react";
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
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
    <div className="w-full max-w-md mx-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-2xl animate-scale-in">
      <h3 className="mb-5 text-center text-lg font-bold text-[var(--color-text)]">
        Processing files
      </h3>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-semibold text-[var(--color-text-muted)]">
            <span>Overall progress</span>
            <span className="tabular-nums text-[var(--color-text)]">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
            <div
              className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-1 text-center">
          <div className="text-sm text-[var(--color-text-muted)]">{status}</div>
          <div className="text-sm font-semibold text-[var(--color-text)]">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        <button className="btn-secondary w-full" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  </div>
);

const ContextMenu = ({ x, y, onClose, onReplace, onInsertBefore, onInsertAfter }) => {
  const menuStyle = {
    top: Math.max(0, Math.min(y, window.innerHeight - 100)), // Ensure menu stays within viewport
    left: Math.max(0, Math.min(x, window.innerWidth - 180)), // Ensure menu stays within viewport
  };

  return (
    <div
      className="context-menu fixed z-50 min-w-[170px] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] py-1.5 shadow-2xl animate-scale-in"
      style={menuStyle}
      onClick={(e) => e.stopPropagation()} // Prevent closing on click inside menu
      onContextMenu={(e) => e.preventDefault()} // Prevent browser default context menu
    >
      {[
        { icon: FileText, label: "Replace page", action: onReplace },
        { icon: Plus, label: "Insert before", action: onInsertBefore },
        { icon: Plus, label: "Insert after", action: onInsertAfter },
      ].map(({ icon: Icon, label, action }) => (
        <button
          key={label}
          className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-primary-light)]"
          onClick={() => {
            action();
            onClose();
          }}
        >
          <Icon className="mr-2.5 h-4 w-4 text-[var(--color-primary)]" />
          {label}
        </button>
      ))}
    </div>
  );
};

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="flex flex-col items-center space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-2xl animate-scale-in">
        <Loader2 className="h-7 w-7 animate-spin text-[var(--color-primary)]" />
        <span className="text-base font-medium text-[var(--color-text)]">
          Updating pages...
        </span>
      </div>
    </div>
  );
};

const InsertSlot = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex aspect-[3/4] items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg)]/40 transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
      title="Insert pages here"
      aria-label="Insert pages here"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg transition-transform group-hover:scale-110">
        <Plus className="h-5 w-5" />
      </span>
    </button>
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
  const cancelProcessingRef = useRef(false);
  const pdfCacheRef = useRef(new Map());
  const fileInputRef = useRef(null);

  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showInlineInsert, setShowInlineInsert] = useState(false);

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
    const pdfCache = pdfCacheRef.current;

    return () => {
      activePreviewUrls.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      pdfCache.forEach((doc) => {
        if (doc?.destroy) doc.destroy();
      });
      pdfCache.clear();
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

      // Reorder synchronously as the pointer crosses each item. A timer here raced
      // the pointer and shuffled pages unpredictably on fast drags.
      setPages((prevPages) => {
        if (draggedItem === index) return prevPages;
        const newPages = [...prevPages];
        const [draggedPage] = newPages.splice(draggedItem, 1);
        newPages.splice(index, 0, draggedPage);
        return newPages;
      });
      setDraggedItem(index); // Dragged item now lives at this index
    },
    [draggedItem]
  );

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null); // Clear indicator when dragging off an item
  }, []);

  const handleRemovePage = useCallback(
    (indexToRemove) => {
      setPages((prevPages) => {
        const removed = prevPages[indexToRemove];
        const newPages = prevPages.filter(
          (_, index) => index !== indexToRemove
        );
        if (removed?.preview) URL.revokeObjectURL(removed.preview);
        // Drop the cached pdf.js document once no page references that file anymore.
        if (removed?.file && !newPages.some((p) => p.file === removed.file)) {
          const cached = pdfCacheRef.current.get(removed.file);
          if (cached?.destroy) cached.destroy();
          pdfCacheRef.current.delete(removed.file);
        }
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
      fileInputRef.current.multiple = false;
      fileInputRef.current.dataset.pageIndex = contextMenu.pageIndex;
      delete fileInputRef.current.dataset.insertMode;
      fileInputRef.current.click();
    }
  }, [contextMenu]);

  const handleInsertBefore = useCallback(() => {
    if (fileInputRef.current && contextMenu !== null) {
      fileInputRef.current.value = "";
      fileInputRef.current.multiple = true;
      fileInputRef.current.dataset.pageIndex = contextMenu.pageIndex;
      fileInputRef.current.dataset.insertMode = "before";
      fileInputRef.current.click();
    }
  }, [contextMenu]);

  const handleInsertAfter = useCallback(() => {
    if (fileInputRef.current && contextMenu !== null) {
      fileInputRef.current.value = "";
      fileInputRef.current.multiple = true;
      fileInputRef.current.dataset.pageIndex = contextMenu.pageIndex;
      fileInputRef.current.dataset.insertMode = "after";
      fileInputRef.current.click();
    }
  }, [contextMenu]);

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
          const processedPagesBeforeCurrentFile = cumulativePagesProcessed;

          const updateCurrentFileProgress = (
            statusText = "Processing files",
            currentPageNum
          ) => {
            modalRoot.render(
              <ProgressModal
                progress={
                  ((processedPagesBeforeCurrentFile + currentPageNum) /
                    totalExpectedPages) *
                  100
                }
                status={`${statusText} (File ${fileIndex + 1}/${
                  acceptedFiles.length
                })`}
                currentPage={processedPagesBeforeCurrentFile + currentPageNum}
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
          );
          newOverallPages.push(...pagesFromFile);
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

  const resetFileInput = useCallback(() => {
    if (!fileInputRef.current) return;
    fileInputRef.current.value = "";
    delete fileInputRef.current.dataset.pageIndex;
    delete fileInputRef.current.dataset.insertMode;
    fileInputRef.current.multiple = true;
  }, []);

  const handleFileSelect = useCallback(
    async (event) => {
      const files = Array.from(event.target.files || []);
      const hasTarget = event.target.dataset.pageIndex !== undefined;
      const targetIndex = parseInt(event.target.dataset.pageIndex, 10);
      const insertMode = event.target.dataset.insertMode;

      if (!files.length) {
        resetFileInput();
        return;
      }

      // "Choose Files" targets no existing page, so append through the same
      // pipeline the dropzone uses instead of bailing out.
      if (!hasTarget || isNaN(targetIndex)) {
        resetFileInput();
        await onDrop(files);
        return;
      }

      try {
        setReplaceLoading(true);

        if (!insertMode) {
          // Replace mode (single file)
          const file = files[0];
          if (!file || !Object.values(FILE_TYPES).includes(file.type)) {
            showNotification(
              "Please select a valid PDF or image file (PDF, JPG, JPEG, PNG).",
              "error"
            );
            return;
          }
          const replacementPages = await processFileIntoPageData(file);
          setPages((prevPages) => {
            const updatedPages = [...prevPages];
            updatedPages.splice(targetIndex, 1, ...replacementPages);
            return updatedPages;
          });
          showNotification("Page(s) replaced successfully!", "success");
        } else {
          // Insert mode (multiple files allowed)
          const invalidFiles = files.filter(
            (f) => !Object.values(FILE_TYPES).includes(f.type)
          );
          if (invalidFiles.length) {
            showNotification(
              `Unsupported files: ${invalidFiles
                .map((f) => f.name)
                .join(", ")}. Please use PDF, JPG, JPEG, or PNG.`,
              "error"
            );
            return;
          }

          let newPagesToInsert = [];
          for (const file of files) {
            const pagesFromFile = await processFileIntoPageData(file);
            newPagesToInsert.push(...pagesFromFile);
          }

          setPages((prevPages) => {
            const updatedPages = [...prevPages];
            const atIndex = insertMode === "before" ? targetIndex : targetIndex + 1;
            updatedPages.splice(atIndex, 0, ...newPagesToInsert);
            return updatedPages;
          });
          showNotification("Page(s) inserted successfully!", "success");
        }
      } catch (error) {
        showNotification("Error processing file(s): " + error.message, "error");
      } finally {
        setReplaceLoading(false);
        setContextMenu(null);
        resetFileInput();
      }
    },
    [showNotification, onDrop, resetFileInput]
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

      const totalItemsToProcess = pages.length;

      // Copy every page a source file contributes in ONE copyPages call. Calling it
      // per page makes pdf-lib duplicate shared fonts/images for each page, which
      // bloats the output enormously and made save() hang at 100% on real PDFs.
      // Each file gets a queue of copies consumed in the user's page order.
      const copiedPagesByFile = new Map();
      const failedFiles = new Set();
      const pageIndicesByFile = new Map();
      pages.forEach((page) => {
        if (page.type !== "pdf") return;
        if (!pageIndicesByFile.has(page.file)) pageIndicesByFile.set(page.file, []);
        pageIndicesByFile.get(page.file).push(page.pageIndex);
      });
      for (const [file, indices] of pageIndicesByFile) {
        if (cancelProcessingRef.current) {
          throw new Error("PDF creation cancelled by user.");
        }
        try {
          const srcDoc = await PDFDocument.load(await file.arrayBuffer());
          copiedPagesByFile.set(file, await pdfDoc.copyPages(srcDoc, indices));
        } catch (error) {
          failedFiles.add(file);
          showNotification(
            `Failed to read ${file.name}. Its pages will be skipped.`,
            "error"
          );
        }
      }

      for (let i = 0; i < totalItemsToProcess; i++) {
        if (cancelProcessingRef.current) {
          throw new Error("PDF creation cancelled by user.");
        }

        const page = pages[i];
        // Reserve the last 10% for saving, so 100% only shows once the file is ready.
        const currentProgress = ((i + 1) / totalItemsToProcess) * 90;

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
          if (failedFiles.has(page.file)) continue;
          try {
            const copiedPage = copiedPagesByFile.get(page.file).shift();
            // Preserve the source page's own rotation (scans/landscape slides often
            // carry 90°) and add any user-applied rotation on top of it.
            const sourceAngle = copiedPage.getRotation().angle || 0;
            const finalAngle = (((sourceAngle + (page.rotation || 0)) % 360) + 360) % 360;
            copiedPage.setRotation(degrees(finalAngle));
            pdfDoc.addPage(copiedPage);
          } catch (error) {
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
            showNotification(
              `Failed to embed image page ${i + 1} from ${
                page.file.name
              }. Skipping page.`,
              "error"
            );
            continue;
          }
        }
        // Yield to the event loop periodically so the progress modal can paint,
        // without adding a fixed delay to every single page.
        if (i % 20 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }

      if (cancelProcessingRef.current) {
        showNotification("PDF creation cancelled by user.", "info");
        throw new Error("PDF creation cancelled by user.");
      }

      if (pdfDoc.getPageCount() === 0) {
        throw new Error("None of the pages could be added to the PDF.");
      }

      modalRoot.render(
        <ProgressModal
          progress={95}
          status="Finalizing PDF..."
          currentPage={totalItemsToProcess}
          totalPages={totalItemsToProcess}
          onCancel={() => {
            cancelProcessingRef.current = true;
            modalCleanup();
          }}
        />
      );
      // Let the modal paint before the save starts.
      await new Promise((resolve) => setTimeout(resolve, 0));

      // objectsPerTick keeps the main thread (and the modal) responsive while saving.
      const pdfBytes = await pdfDoc.save({ objectsPerTick: 50 });
      if (cancelProcessingRef.current) {
        throw new Error("PDF creation cancelled by user.");
      }

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "merged_and_ordered_document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoking synchronously after click() can abort the download in
      // Safari/Firefox, so give the browser time to start it.
      setTimeout(() => URL.revokeObjectURL(url), 60000);

      showNotification("PDF created and downloaded successfully!", "success");
    } catch (error) {
      if (
        !error.message.includes("PDF creation cancelled by user.") &&
        !error.message.includes("Failed to embed") &&
        !error.message.includes("Unsupported image type")
      ) {
        showNotification(
          error.message ||
            "An error occurred while creating the PDF.",
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    noClick: true, // The "Choose Files" button owns the click-to-browse flow
    disabled: isLoading || replaceLoading, // Disable dropzone during any loading
  });

  const hasPages = pages.length > 0;
  const busy = isLoading || replaceLoading;

  const openFilePicker = () => {
    if (!fileInputRef.current) return;
    resetFileInput();
    fileInputRef.current.click();
  };

  return (
    <div className="text-[var(--color-text)]">
      {/* Hidden file input for add / replace / insert functionality */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        className="hidden"
        accept="application/pdf,image/png,image/jpeg,image/jpg"
        onChange={handleFileSelect}
        disabled={busy}
      />

      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-primary)]">
          PDF tool
        </p>
        <h1 className="h2 mt-2">PDF &amp; Image Combiner</h1>
        <p className="mx-auto mt-3 max-w-xl text-[var(--color-text-muted)]">
          Drop in PDFs and images, drag them into the order you want, and
          download the whole thing as a single PDF.
        </p>
      </header>

      {/* Upload: a full panel while empty, a slim bar once pages exist */}
      {!hasPages ? (
        <div className="mx-auto mt-10 max-w-2xl">
          <div
            {...getRootProps({
              className: `rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
                isDragActive
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                  : "border-[var(--color-border-strong)] bg-[var(--color-bg-card)]/50 hover:border-[var(--color-primary)]"
              }`,
            })}
          >
            <input {...getInputProps()} />
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-light)]">
              <UploadCloud className="h-6 w-6 text-[var(--color-primary)]" />
            </span>
            <p className="mt-4 text-base font-semibold">
              {isDragActive ? "Drop your files here" : "Drag & drop files here"}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              PDF, JPG, PNG and JPEG - as many as you like
            </p>
            <button
              type="button"
              disabled={busy}
              className="btn-primary mt-6"
              onClick={openFilePicker}
            >
              <Plus className="h-4 w-4" />
              Choose files
            </button>
          </div>

          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Add", "Pick PDFs and images in any mix."],
              ["Arrange", "Drag pages until the order is right."],
              ["Download", "Save it all as one clean PDF."],
            ].map(([title, copy], i) => (
              <li
                key={title}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]/40 p-4 text-left"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-xs font-bold text-[var(--color-primary)]">
                  {i + 1}
                </span>
                <p className="mt-2.5 text-sm font-semibold">{title}</p>
                <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{copy}</p>
              </li>
            ))}
          </ol>

          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)]">
            <Lock className="h-3.5 w-3.5" />
            Everything runs in your browser - files never leave this device.
          </p>
        </div>
      ) : (
        <div
          {...getRootProps({
            className: `mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed px-4 py-3 transition-colors ${
              isDragActive
                ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                : "border-[var(--color-border-strong)] bg-[var(--color-bg-card)]/40"
            }`,
          })}
        >
          <input {...getInputProps()} />
          <p className="text-sm text-[var(--color-text-muted)]">
            {isDragActive
              ? "Drop to add these files"
              : "Drag more files here to add them to the end"}
          </p>
          <button
            type="button"
            disabled={busy}
            className="btn-secondary py-2 text-sm"
            onClick={openFilePicker}
          >
            <Plus className="h-4 w-4" />
            Add files
          </button>
        </div>
      )}

      {hasPages && (
        <div className="mt-6 animate-fade-in-up">
          <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold">
                {pages.length} page{pages.length === 1 ? "" : "s"} ready
              </h2>
              <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">
                Drag a page to reorder it - right-click for replace and insert.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowInlineInsert((v) => !v)}
                disabled={busy}
                className="btn-secondary"
              >
                {showInlineInsert ? "Done inserting" : "Insert pages"}
              </button>
              <button
                onClick={createFinalPDF}
                disabled={busy}
                className="btn-primary"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download combined PDF
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {showInlineInsert && (
                <InsertSlot
                  key={`insert-start`}
                  onClick={() => {
                    if (!fileInputRef.current) return;
                    fileInputRef.current.value = '';
                    fileInputRef.current.multiple = true;
                    fileInputRef.current.dataset.pageIndex = '0';
                    fileInputRef.current.dataset.insertMode = 'before';
                    fileInputRef.current.click();
                  }}
                />
              )}
              {pages.map((page, index) => (
                <React.Fragment key={`${page.preview}-${index}`}>
                  <PageCard
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
                    handleRemovePage={handleRemovePage}
                    showInsertButtons={false}
                  />
                  {showInlineInsert && (
                    <InsertSlot
                      key={`insert-after-${index}`}
                      onClick={() => {
                        if (!fileInputRef.current) return;
                        fileInputRef.current.value = '';
                        fileInputRef.current.multiple = true;
                        fileInputRef.current.dataset.pageIndex = String(index);
                        fileInputRef.current.dataset.insertMode = 'after';
                        fileInputRef.current.click();
                      }}
                    />
                  )}
                </React.Fragment>
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
          onInsertBefore={handleInsertBefore}
          onInsertAfter={handleInsertAfter}
        />
      )}
      <LoadingOverlay isLoading={replaceLoading} />

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={clearNotification}
      />
    </div>
  );
};
export default App;
