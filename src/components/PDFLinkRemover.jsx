import React, { useState, useCallback, useRef } from "react";
import SEO from "./SEO";
import BackButton from "./BackButton";
import { Upload, Download, FileText, Loader2, CheckCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { createRoot } from "react-dom/client";

// --- Enhanced: OrbitalFlowProcessingOverlay Component ---
const OrbitalFlowProcessingOverlay = ({
  status,
  onCancel,
  currentStep,
  totalSteps,
  progress = 0,
}) => (
  <div className="fixed inset-0 bg-brand-rich-black/95 flex items-center justify-center z-50 animate-fade-in overflow-hidden">
    {/* Background Orbital/Particle Animation */}
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Central Glowing Orb */}
      <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-brand-caribbean-green to-brand-bangladesh-green animate-pulse-orb flex items-center justify-center shadow-lg transform scale-95">
        <Loader2 className="animate-spin-slow w-24 h-24 text-brand-rich-black opacity-80" />
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-full ring-4 ring-brand-caribbean-green/50 animate-ping-once"></div>
        <div className="absolute inset-0 rounded-full ring-2 ring-brand-mountain-meadow/50 animate-ping-once animation-delay-500"></div>
      </div>

      {/* Orbiting Particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-brand-pistachio opacity-60 animate-orbit"
          style={{
            animationDelay: `${i * 0.1}s`,
            transformOrigin: "50% 50%",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg) translateY(${60 + Math.random() * 80}px)`,
          }}
        ></div>
      ))}
    </div>

    {/* Content Overlay */}
    <div className="relative z-10 bg-brand-pine/90 rounded-3xl p-8 w-full max-w-lg mx-4 shadow-3xl border border-[var(--color-border)] overflow-hidden text-center animate-scale-in">
      <h3 className="text-3xl font-semibold text-[var(--color-text)] mb-6 animate-fade-in-down">
        Advanced PDF Processing
      </h3>

      {/* Dynamic Status Message */}
      <div className="text-xl font-medium text-[var(--color-text-muted)] mb-4 h-8 animate-fade-in-up">
        {status}
      </div>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="w-full bg-[var(--color-border)] rounded-full h-3 mb-6 overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      )}

      {/* Step Indicators (Enhanced) */}
      <div className="flex justify-center space-x-3 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                        ${
                          currentStep >= i + 1
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-lg animate-bounce-step"
                            : "border-[var(--color-border-strong)] text-[var(--color-text-light)] bg-[var(--color-bg-alt)]"
                        }`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {currentStep > i + 1 ? (
              <CheckCircle size={20} />
            ) : (
              <span className="font-semibold">{i + 1}</span>
            )}
          </div>
        ))}
      </div>

      {/* Performance Stats */}
      {currentStep > 1 && (
        <div className="text-sm text-[var(--color-text-light)] mb-6 space-y-1">
          <div>⚡ Optimized batch processing</div>
          <div>🔍 Advanced link detection</div>
          <div>💾 Memory efficient processing</div>
        </div>
      )}

      <button
        className="btn-secondary w-full text-[var(--color-error)]"
        onClick={onCancel}
      >
        Cancel Process
      </button>
    </div>
  </div>
);

// --- Main PDFLinkRemover Component ---
const PDFLinkRemover = () => {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [downloadBlob, setDownloadBlob] = useState(null);

  const processingOverlayRootRef = useRef(null);
  const processingOverlayCleanupRef = useRef(() => {});
  const abortControllerRef = useRef(null);
  const cancelledRef = useRef(false);

  const createAndShowProcessingOverlay = useCallback(() => {
    cancelledRef.current = false;
    const overlayDiv = document.createElement("div");
    document.body.appendChild(overlayDiv);
    const root = createRoot(overlayDiv);
    processingOverlayRootRef.current = root;
    processingOverlayCleanupRef.current = () => {
      processingOverlayCleanupRef.current = () => {}; // idempotent
      processingOverlayRootRef.current = null;
      // Defer unmount: React forbids unmounting a root while it is rendering.
      setTimeout(() => {
        root.unmount();
        if (overlayDiv && document.body.contains(overlayDiv)) {
          document.body.removeChild(overlayDiv);
        }
      }, 0);
    };
    return root;
  }, []);

  const updateProcessingOverlay = useCallback(
    (status, currentStep, totalSteps, progress = 0) => {
      if (cancelledRef.current) return;
      if (processingOverlayRootRef.current) {
        processingOverlayRootRef.current.render(
          <OrbitalFlowProcessingOverlay
            status={status}
            currentStep={currentStep}
            totalSteps={totalSteps}
            progress={progress}
            onCancel={() => {
              cancelledRef.current = true;
              if (abortControllerRef.current)
                abortControllerRef.current.abort();
              setMessage("Process cancelled.");
              setProcessing(false);
              processingOverlayCleanupRef.current();
            }}
          />,
        );
      }
    },
    [],
  );

  const onDrop = useCallback((acceptedFiles) => {
    setMessage("");
    setDownloadBlob(null);

    if (acceptedFiles.length === 0) {
      setMessage("Error: No file dropped or invalid file type.");
      setFile(null);
      return;
    }

    const droppedFile = acceptedFiles[0];
    if (droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      setMessage(
        "Error: Only PDF files are accepted. Please drag and drop a .pdf file.",
      );
      setFile(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    disabled: processing,
  });

  const triggerDownload = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleProcessPDF = async () => {
    if (!file) {
      setMessage("Error: Please upload a PDF file first.");
      return;
    }

    setProcessing(true);
    setMessage("");
    setDownloadBlob(null);

    // Use the new overlay component
    createAndShowProcessingOverlay();
    updateProcessingOverlay("Initializing advanced processing...", 1, 4); // Initial message

    const backendUrl =
      process.env.REACT_APP_BACKEND_URL ||
      "https://quicksidetoolbackend.onrender.com";

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // A fresh FormData per request - a request that failed may have consumed the body.
    const makeRequest = (endpoint) =>
      fetch(`${backendUrl}${endpoint}`, {
        method: "POST",
        body: (() => {
          const fd = new FormData();
          fd.append("file", file);
          return fd;
        })(),
        signal: controller.signal,
      });

    try {
      updateProcessingOverlay(
        "Analyzing PDF structure & scanning for links...",
        1,
        4,
        10,
      );

      // Try the advanced endpoint; fall back to the regular one whether it throws
      // (network error) OR returns a non-OK status (404/500/etc.).
      let response;
      try {
        response = await makeRequest("/remove-pdf-links-advanced");
      } catch (advancedError) {
        if (advancedError.name === "AbortError") throw advancedError;
        console.warn("Advanced endpoint threw, falling back:", advancedError);
        response = null;
      }
      if (!response || !response.ok) {
        if (response && response.status >= 500) {
          console.warn(
            "Advanced endpoint returned",
            response.status,
            "- falling back",
          );
        }
        if (!response || response.status === 404 || response.status >= 500) {
          updateProcessingOverlay(
            "Using standard processing method...",
            1,
            4,
            15,
          );
          response = await makeRequest("/remove-pdf-links");
        }
      }

      if (response.ok) {
        updateProcessingOverlay(
          "Processing pages in optimized batches...",
          2,
          4,
          30,
        ); // Step 2

        const reader = response.body.getReader();
        const chunks = [];
        let receivedLength = 0;
        const contentLength = +response.headers.get("Content-Length");

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          chunks.push(value);
          receivedLength += value.length;

          if (contentLength) {
            const progress =
              Math.round((receivedLength / contentLength) * 50) + 25; // 25-75% range
            updateProcessingOverlay(
              `Downloading processed PDF... ${progress}%`,
              3,
              4,
              progress,
            );
          } else {
            // Chunked/gzipped responses have no Content-Length - show activity, not a stuck bar.
            updateProcessingOverlay("Downloading processed PDF...", 3, 4, 60);
          }
        }

        // Combine chunks into blob
        const blob = new Blob(chunks, { type: "application/pdf" });

        const contentDisposition = response.headers.get("Content-Disposition");
        let filename = `links_removed_${file.name.replace(/\.pdf$/, "")}.pdf`;
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }

        setDownloadBlob({ blob, filename });
        updateProcessingOverlay(
          "Finalizing PDF optimization... Complete!",
          4,
          4,
          100,
        ); // Step 4
        setMessage(
          'Success: Links removed successfully! Click "Download" to save your optimized PDF.',
        );
      } else {
        const errorText = await response.text();
        let errorMessage = "Unknown error";

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorText;
        } catch {
          errorMessage = errorText;
        }

        updateProcessingOverlay("Processing failed.", 1, 4, 0);
        setMessage(`Error: Failed to remove links. ${errorMessage}`);
        setDownloadBlob(null);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        // User cancelled - message + cleanup already handled by onCancel.
        return;
      }
      console.error("Network or processing error:", error);

      // More specific error messages
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        setMessage(
          "Error: Network connection failed. Please check your internet connection and try again.",
        );
      } else if (error.name === "AbortError") {
        setMessage("Error: Request was cancelled. Please try again.");
      } else {
        setMessage(
          `Error: Failed to remove links. ${error.message || "Please try again."}`,
        );
      }
      setDownloadBlob(null);
    } finally {
      abortControllerRef.current = null;
      if (!cancelledRef.current) {
        setTimeout(() => {
          processingOverlayCleanupRef.current();
          setProcessing(false);
        }, 1200);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SEO
        title="Remove Hyperlinks from PDF – Clean PDF Links Online"
        description="Strip all links/hyperlinks from PDF in one click. Privacy‑friendly, free tool."
        url="https://quicksidetool.com/pdf-link-remove"
      />
      <div className="container py-8 md:py-12">
        <BackButton />

        <div className="mx-auto mt-6 max-w-xl">
          <h1 className="h2 text-center">Remove links from PDF</h1>
          <p className="mt-2 text-center text-[var(--color-text-muted)]">
            Strip every hyperlink out of a PDF. The text and layout stay the
            same.
          </p>

          <div className="card mt-8 p-6 md:p-8">
            {/* File Upload Section - Now using useDropzone props */}
            <div
              {...getRootProps()}
              className={`upload-zone cursor-pointer p-8 ${isDragActive ? "drag-active" : ""}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center py-4">
                {file ? (
                  <div className="text-center">
                    <p className="break-all text-lg font-medium text-[var(--color-text)]">
                      {file.name}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="mt-2 text-sm text-[var(--color-text-light)]">
                      Click or drag a new PDF to change file
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload
                      size={48}
                      className="mb-4 text-[var(--color-primary)]"
                    />
                    <p className="text-center text-lg font-semibold text-[var(--color-text)]">
                      {isDragActive
                        ? "Drop your PDF here!"
                        : "Drag & drop your PDF here, or click to upload"}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      (Only PDF files are supported)
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8">
              <button
                onClick={handleProcessPDF}
                disabled={!file || processing}
                className="btn-primary w-full"
              >
                {processing ? (
                  <>
                    {" "}
                    <Loader2 className="animate-spin mr-3 w-5 h-5" /> Advanced
                    Processing...{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <FileText className="mr-3 w-5 h-5" /> Remove Links
                    (Enhanced){" "}
                  </>
                )}
              </button>
            </div>

            {/* Performance Info */}
            <div className="mt-4 text-center">
              <div className="text-sm text-[var(--color-text-light)] space-y-1">
                <div>⚡ Up to 5x faster processing</div>
                <div>🔍 Advanced link detection algorithms</div>
                <div>💾 Optimized memory usage</div>
                <div>📊 Real-time progress tracking</div>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <p
                className={`mt-4 text-sm text-center ${message.includes("Error") ? "text-[var(--color-error)]" : "text-[var(--color-success)]"} animate-fade-in`}
              >
                {message}
              </p>
            )}

            {/* Download Button (now connected to downloadBlob state) */}
            {downloadBlob && (
              <div className="mt-6 text-center">
                <button
                  onClick={() =>
                    triggerDownload(downloadBlob.blob, downloadBlob.filename)
                  }
                  className="btn-primary mx-auto"
                >
                  <Download className="mr-2 w-4 h-4" /> Download Processed PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFLinkRemover;
