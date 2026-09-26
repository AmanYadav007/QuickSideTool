import React, { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  ArrowRight,
  CheckCircle,
  Download,
  FileSpreadsheet,
  FileText,
  FileType,
  Loader2,
  RotateCcw,
  UploadCloud,
  XCircle,
} from "lucide-react";
import SEO from "./SEO";
import BackButton from "./BackButton";
import {
  BACKEND_URL,
  downloadBlob,
  filenameFromResponse,
  formatFileSize,
  readBackendError,
} from "../constants/api";

const PDF_MIME = "application/pdf";
const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const CONVERSIONS = [
  {
    id: "word-to-pdf",
    label: "Word to PDF",
    from: "docx",
    outputExt: ".pdf",
    endpoint: "/convert/word-to-pdf",
    icon: FileType,
    path: "/word-to-pdf",
    seoTitle: "Word to PDF Converter - Free, Keeps Formatting",
    seoDescription:
      "Convert .docx to PDF with headings, lists, tables and images intact. Free, no signup, no watermark.",
  },
  {
    id: "pdf-to-word",
    label: "PDF to Word",
    from: "pdf",
    outputExt: ".docx",
    endpoint: "/convert/pdf-to-word",
    icon: FileText,
    path: "/pdf-to-word",
    seoTitle: "PDF to Word Converter - Free, Editable DOCX",
    seoDescription:
      "Turn a PDF into an editable Word document with its layout, tables and images rebuilt. Free, no signup.",
  },
  {
    id: "word-to-excel",
    label: "Word to Excel",
    from: "docx",
    outputExt: ".xlsx",
    endpoint: "/convert/word-to-excel",
    icon: FileSpreadsheet,
    path: "/word-to-excel",
    seoTitle: "Word to Excel Converter - Tables to Spreadsheet",
    seoDescription:
      "Move the tables in a Word document into an Excel spreadsheet, one sheet per table, with numbers ready to sum.",
  },
  {
    id: "pdf-to-excel",
    label: "PDF to Excel",
    from: "pdf",
    outputExt: ".xlsx",
    endpoint: "/convert/pdf-to-excel",
    icon: FileSpreadsheet,
    path: "/pdf-to-excel",
    seoTitle: "PDF to Excel Converter - Extract Tables Free",
    seoDescription:
      "Pull the tables out of a PDF into an Excel spreadsheet, one sheet per table. Free, no signup.",
  },
];

const FORMAT_LABEL = { pdf: "PDF", docx: "Word (.docx)" };

const fileKind = (file) => {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf") || file.type === PDF_MIME) return "pdf";
  if (name.endsWith(".docx") || file.type === DOCX_MIME) return "docx";
  if (name.endsWith(".doc")) return "doc";
  return null;
};

const FileConverter = ({ initialMode = "pdf-to-word" }) => {
  const [modeId, setModeId] = useState(initialMode);
  const [file, setFile] = useState(null);
  // idle | converting | done | error
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  // Progress line while a scanned PDF is read page by page
  const [stage, setStage] = useState("");
  // Ignore responses from a conversion the user has since replaced
  const requestId = useRef(0);

  const mode = CONVERSIONS.find((c) => c.id === modeId) || CONVERSIONS[0];

  const convert = useCallback(async (inputFile, conversion) => {
    const id = ++requestId.current;
    setStatus("converting");
    setResult(null);
    setError("");
    setStage("");

    // A scanned PDF has no text for the server to convert: read it with OCR
    // on the device instead and build the Word file here (nothing uploaded)
    if (conversion.id === "pdf-to-word") {
      let scanned = false;
      try {
        const { isScannedPdf } = await import("../utils/pdfPages");
        scanned = await isScannedPdf(inputFile);
      } catch {
        // Can't read it here (e.g. password-protected): the server explains
      }
      if (id !== requestId.current) return;
      if (scanned) {
        try {
          const [
            { renderPdfPages, MAX_PDF_PAGES },
            { recognize },
            { buildDocx },
          ] = await Promise.all([
            import("../utils/pdfPages"),
            import("../utils/ocr"),
            import("../utils/scanExport"),
          ]);
          const pages = [];
          const total = await renderPdfPages(inputFile, async (canvas, n) => {
            if (id !== requestId.current) throw new Error("replaced");
            setStage(`Scanned PDF: reading page ${n} with OCR...`);
            pages.push({ text: (await recognize(canvas, "eng")).text });
          });
          const blob = await buildDocx(pages);
          if (id !== requestId.current) return;
          setResult({
            blob,
            filename: inputFile.name.replace(/\.[^.]+$/, "") + ".docx",
            ocr: true,
            pagesRead: Math.min(total, MAX_PDF_PAGES),
            totalPages: total,
          });
          setStatus("done");
        } catch {
          if (id !== requestId.current) return;
          setError(
            "Couldn't read this scanned PDF. Try the Scan to text tool.",
          );
          setStatus("error");
        }
        return;
      }
    }

    const formData = new FormData();
    formData.append("file", inputFile);

    try {
      const response = await fetch(`${BACKEND_URL}${conversion.endpoint}`, {
        method: "POST",
        body: formData,
      });
      if (id !== requestId.current) return;

      if (!response.ok) {
        setError(
          await readBackendError(
            response,
            "Conversion failed. Please try again.",
          ),
        );
        setStatus("error");
        return;
      }

      const blob = await response.blob();
      if (id !== requestId.current) return;
      const fallbackName =
        inputFile.name.replace(/\.[^.]+$/, "") + conversion.outputExt;
      setResult({
        blob,
        filename: filenameFromResponse(response, fallbackName),
      });
      setStatus("done");
    } catch {
      if (id !== requestId.current) return;
      setError(
        "Couldn't reach the server. Check your connection and try again.",
      );
      setStatus("error");
    }
  }, []);

  const onDrop = useCallback(
    (accepted, rejected) => {
      const dropped = accepted[0] || rejected[0]?.file;
      if (!dropped) return;

      const kind = fileKind(dropped);
      if (kind === "doc") {
        setFile(null);
        setError(
          "Old .doc files aren't supported. Open it in Word and save it as .docx first.",
        );
        setStatus("error");
        return;
      }
      if (!kind) {
        setFile(null);
        setError("Please drop a PDF or Word (.docx) file.");
        setStatus("error");
        return;
      }

      // Dropped a Word file while "PDF to ..." is selected (or vice versa)?
      // Switch to the matching conversion instead of making the user do it,
      // keeping Excel as the target if that's what they picked.
      let conversion = mode;
      if (mode.from !== kind) {
        conversion =
          (mode.outputExt === ".xlsx" &&
            CONVERSIONS.find(
              (c) => c.from === kind && c.outputExt === ".xlsx",
            )) ||
          CONVERSIONS.find((c) => c.from === kind);
        setModeId(conversion.id);
      }

      setFile(dropped);
      convert(dropped, conversion);
    },
    [mode, convert],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    noClick: status === "converting",
    noKeyboard: status === "converting",
    accept: {
      [PDF_MIME]: [".pdf"],
      [DOCX_MIME]: [".docx"],
    },
  });

  const chooseMode = (conversion) => {
    setModeId(conversion.id);
    if (file && fileKind(file) === conversion.from) {
      // Same file works for the new conversion - run it straight away
      convert(file, conversion);
    } else {
      requestId.current++;
      setFile(null);
      setResult(null);
      setError("");
      setStatus("idle");
    }
  };

  const reset = () => {
    requestId.current++;
    setFile(null);
    setResult(null);
    setError("");
    setStatus("idle");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SEO
        title={mode.seoTitle}
        description={mode.seoDescription}
        url={mode.path}
      />

      <div className="container py-8 md:py-12">
        <BackButton />

        <div className="mx-auto mt-6 max-w-2xl">
          <h1 className="h2 text-center">Convert files</h1>
          <p className="mt-2 text-center text-[var(--color-text-muted)]">
            Pick a conversion, drop your file, download the result.
          </p>

          {/* Conversion picker */}
          <div
            role="radiogroup"
            aria-label="Conversion"
            className="mt-8 grid grid-cols-2 gap-3"
          >
            {CONVERSIONS.map((conversion) => {
              const Icon = conversion.icon;
              const selected = conversion.id === mode.id;
              return (
                <button
                  key={conversion.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={status === "converting"}
                  onClick={() => chooseMode(conversion)}
                  className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 md:p-4 ${
                    selected
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
                  }`}
                >
                  <Icon
                    className="h-5 w-5 shrink-0 text-[var(--color-primary)]"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold text-[var(--color-text)] md:text-base">
                    {conversion.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Drop zone / progress / result */}
          <div
            {...getRootProps()}
            className={`upload-zone mt-6 cursor-pointer p-8 text-center ${isDragActive ? "drag-active" : ""}`}
          >
            <input {...getInputProps()} />

            {status === "converting" && (
              <div
                className="flex flex-col items-center gap-3"
                aria-live="polite"
              >
                <Loader2 className="h-10 w-10 animate-spin text-[var(--color-primary)]" />
                <p className="font-semibold text-[var(--color-text)]">
                  Converting {file?.name}...
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {stage || "Large files can take up to a minute."}
                </p>
              </div>
            )}

            {status === "done" && result && (
              <div
                className="flex flex-col items-center gap-3"
                aria-live="polite"
              >
                <CheckCircle className="h-10 w-10 text-[var(--color-success)]" />
                <p className="break-all font-semibold text-[var(--color-text)]">
                  {result.filename}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {formatFileSize(result.blob.size)}
                </p>
                {result.ocr && (
                  <p className="max-w-sm text-xs text-[var(--color-text-light)]">
                    This PDF is a scan, so its text was read on your device with
                    OCR (English). Check names and numbers.
                    {result.totalPages > result.pagesRead &&
                      ` Only the first ${result.pagesRead} of ${result.totalPages} pages were read.`}{" "}
                    <Link
                      to="/ocr-processor"
                      onClick={(e) => e.stopPropagation()}
                      className="link"
                    >
                      Other languages: Scan to text
                    </Link>
                  </p>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadBlob(result.blob, result.filename);
                  }}
                  className="btn-primary mt-2"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center gap-3" role="alert">
                <XCircle className="h-10 w-10 text-[var(--color-error)]" />
                <p className="font-semibold text-[var(--color-error)]">
                  {error}
                </p>
                {/scanned|OCR/i.test(error) && (
                  <Link
                    to="/ocr-processor"
                    onClick={(e) => e.stopPropagation()}
                    className="link text-sm font-semibold"
                  >
                    Open Scan to text
                  </Link>
                )}
                {/password/i.test(error) && (
                  <Link
                    to="/unlock-pdf"
                    onClick={(e) => e.stopPropagation()}
                    className="link text-sm font-semibold"
                  >
                    Unlock the PDF first
                  </Link>
                )}
                <p className="text-sm text-[var(--color-text-muted)]">
                  Drop another file to try again.
                </p>
              </div>
            )}

            {status === "idle" && (
              <div className="flex flex-col items-center gap-3">
                <UploadCloud className="h-10 w-10 text-[var(--color-primary)]" />
                <p className="font-semibold text-[var(--color-text)]">
                  {isDragActive
                    ? "Drop it here"
                    : `Drop a ${FORMAT_LABEL[mode.from]} file`}
                </p>
                <p className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  {FORMAT_LABEL[mode.from]}{" "}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />{" "}
                  {mode.outputExt.slice(1).toUpperCase()}
                  <span aria-hidden="true">·</span> or click to browse
                </p>
              </div>
            )}
          </div>

          {(status === "done" || status === "error") && (
            <div className="mt-4 flex justify-center gap-3">
              <button type="button" onClick={open} className="btn-secondary">
                <UploadCloud className="h-4 w-4" /> Convert another file
              </button>
              {file && status === "error" && (
                <button
                  type="button"
                  onClick={() => convert(file, mode)}
                  className="btn-secondary"
                >
                  <RotateCcw className="h-4 w-4" /> Retry
                </button>
              )}
              {status === "done" && (
                <button type="button" onClick={reset} className="btn-secondary">
                  Clear
                </button>
              )}
            </div>
          )}

          <p className="mt-6 text-center text-xs text-[var(--color-text-light)]">
            Files are converted on our server in memory and never stored. Up to
            100 MB.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileConverter;
