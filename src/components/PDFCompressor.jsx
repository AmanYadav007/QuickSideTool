import React, { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  CheckCircle,
  Download,
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

// Maps to COMPRESSION_LEVELS in backend/app.py
const LEVELS = [
  { id: "low", label: "Best quality", hint: "For printing" },
  { id: "medium", label: "Balanced", hint: "For email and uploads" },
  { id: "high", label: "Smallest", hint: "Lower image quality" },
];

// Names for the levels the server reports in X-Compression-Level
const LEVEL_NAMES = {
  low: "Best quality",
  medium: "Balanced",
  high: "Smallest",
  tiny: "Extra small (lower image quality)",
  minimum: "Minimum (low image quality)",
  original: "Original (already small enough)",
};

// Below this, tell the user the PDF was already about as small as it gets
const MEANINGFUL_SAVING = 0.03;

const PDFCompressor = () => {
  const [file, setFile] = useState(null);
  const [level, setLevel] = useState("medium");
  // idle | compressing | done | error
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  // Optional size limit: typed text, and the limit in bytes once applied
  const [limitMb, setLimitMb] = useState("");
  const [appliedLimit, setAppliedLimit] = useState(null);
  // Ignore responses from a run the user has since replaced
  const requestId = useRef(0);

  const compress = useCallback(async (pdf, compressionLevel, limitBytes) => {
    const id = ++requestId.current;
    setStatus("compressing");
    setResult(null);
    setError("");

    const formData = new FormData();
    formData.append("file", pdf);
    // With a limit the server picks the best-quality level that fits
    if (limitBytes) formData.append("target_bytes", String(limitBytes));
    else formData.append("compression_level", compressionLevel);

    try {
      const response = await fetch(`${BACKEND_URL}/compress-pdf`, {
        method: "POST",
        body: formData,
      });
      if (id !== requestId.current) return;

      if (!response.ok) {
        setError(
          await readBackendError(
            response,
            "Compression failed. Please try again.",
          ),
        );
        setStatus("error");
        return;
      }

      const blob = await response.blob();
      if (id !== requestId.current) return;
      setResult({
        blob,
        filename: filenameFromResponse(response, `compressed_${pdf.name}`),
        limitBytes,
        targetMet: response.headers.get("X-Target-Met") !== "no",
        levelUsed: response.headers.get("X-Compression-Level"),
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
      const dropped = accepted[0];
      if (!dropped) {
        if (rejected.length) {
          setFile(null);
          setError("Please drop a PDF file.");
          setStatus("error");
        }
        return;
      }
      setFile(dropped);
      compress(dropped, level, appliedLimit);
    },
    [level, appliedLimit, compress],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    noClick: status === "compressing",
    noKeyboard: status === "compressing",
  });

  const chooseLevel = (id) => {
    const hadLimit = appliedLimit !== null;
    setLevel(id);
    // Picking a level switches back from "fit a size limit"
    setAppliedLimit(null);
    setLimitMb("");
    // Re-run on the same file so the user can compare levels without re-uploading
    if (file && (id !== level || hadLimit)) compress(file, id, null);
  };

  const applyLimit = () => {
    const mb = parseFloat(limitMb);
    const bytes = mb > 0 ? Math.round(mb * 1024 * 1024) : null;
    if (bytes === appliedLimit) return;
    setAppliedLimit(bytes);
    if (file && status !== "compressing") compress(file, level, bytes);
  };

  const saved = result && file ? 1 - result.blob.size / file.size : 0;
  // 99.7% would round to a misleading "100% smaller"
  const percentSaved = Math.min(99, Math.round(saved * 100));

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SEO
        title="Compress PDF Online - Reduce PDF Size Without Losing Quality"
        description="Shrink a PDF for email or upload in seconds. Text stays sharp; only oversized images are reduced. Free, no signup, no watermark."
        url="/pdf-compressor"
      />

      <div className="container py-8 md:py-12">
        <BackButton />

        <div className="mx-auto mt-6 max-w-2xl">
          <h1 className="h2 text-center">Compress PDF</h1>
          <p className="mt-2 text-center text-[var(--color-text-muted)]">
            Drop a PDF and it's compressed right away. Text stays sharp.
          </p>

          {/* Level picker */}
          <div
            role="radiogroup"
            aria-label="Compression level"
            className="mt-8 grid grid-cols-3 gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-1"
          >
            {LEVELS.map(({ id, label, hint }) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={!appliedLimit && level === id}
                disabled={status === "compressing"}
                onClick={() => chooseLevel(id)}
                className={`rounded-lg px-2 py-2 text-center transition-colors disabled:cursor-not-allowed ${
                  !appliedLimit && level === id
                    ? "bg-[var(--color-bg)] shadow-sm"
                    : "hover:bg-brand-rich-black/60"
                }`}
              >
                <span
                  className={`block text-sm font-semibold ${
                    !appliedLimit && level === id
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-text)]"
                  }`}
                >
                  {label}
                </span>
                <span className="block text-xs text-[var(--color-text-muted)]">
                  {hint}
                </span>
              </button>
            ))}
          </div>

          {/* Optional size limit, e.g. "PDF must be under 2 MB" on application forms */}
          <form
            noValidate
            className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm"
            onSubmit={(e) => {
              e.preventDefault();
              applyLimit();
            }}
          >
            <label
              htmlFor="limit-mb"
              className="text-[var(--color-text-muted)]"
            >
              Must be under
            </label>
            <input
              id="limit-mb"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              placeholder="e.g. 2"
              value={limitMb}
              onChange={(e) => setLimitMb(e.target.value)}
              onBlur={applyLimit}
              disabled={status === "compressing"}
              className="input !w-24 py-1.5"
            />
            <span className="text-[var(--color-text-muted)]">
              MB (optional)
            </span>
            {appliedLimit && (
              <span className="w-full text-center text-xs text-[var(--color-text-light)]">
                The best quality that fits is picked for you.
              </span>
            )}
          </form>

          {/* Drop zone / progress / result */}
          <div
            {...getRootProps()}
            className={`upload-zone mt-6 cursor-pointer p-8 text-center ${isDragActive ? "drag-active" : ""}`}
          >
            <input {...getInputProps()} />

            {status === "compressing" && (
              <div
                className="flex flex-col items-center gap-3"
                aria-live="polite"
              >
                <Loader2 className="h-10 w-10 animate-spin text-[var(--color-primary)]" />
                <p className="break-all font-semibold text-[var(--color-text)]">
                  Compressing {file?.name}...
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {formatFileSize(file?.size || 0)}
                </p>
              </div>
            )}

            {status === "done" && result && (
              <div
                className="flex flex-col items-center gap-3"
                aria-live="polite"
              >
                <CheckCircle
                  className={`h-10 w-10 ${result.targetMet ? "text-[var(--color-success)]" : "text-[var(--color-warning)]"}`}
                />
                {result.limitBytes ? (
                  <>
                    <p className="text-2xl font-semibold text-[var(--color-text)]">
                      {result.targetMet
                        ? `Fits under ${formatFileSize(result.limitBytes)}`
                        : `Couldn't get under ${formatFileSize(result.limitBytes)}`}
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {formatFileSize(file.size)} →{" "}
                      {formatFileSize(result.blob.size)}
                      {saved >= MEANINGFUL_SAVING &&
                        ` · ${percentSaved}% smaller`}
                    </p>
                    <p className="text-xs text-[var(--color-text-light)]">
                      {result.targetMet
                        ? `Level used: ${LEVEL_NAMES[result.levelUsed] || result.levelUsed}`
                        : "This is the smallest it can go. Removing pages or splitting the PDF would help."}
                    </p>
                  </>
                ) : saved >= MEANINGFUL_SAVING ? (
                  <>
                    <p className="text-2xl font-semibold text-[var(--color-text)]">
                      {percentSaved}% smaller
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {formatFileSize(file.size)} →{" "}
                      {formatFileSize(result.blob.size)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-[var(--color-text)]">
                      This PDF is already well optimized
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {formatFileSize(file.size)} - there was little left to
                      shrink.
                      {level !== "high" && ' Try "Smallest" for more.'}
                    </p>
                  </>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadBlob(result.blob, result.filename);
                  }}
                  className="btn-primary mt-2"
                >
                  <Download className="h-4 w-4" /> Download PDF
                </button>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center gap-3" role="alert">
                <XCircle className="h-10 w-10 text-[var(--color-error)]" />
                <p className="font-semibold text-[var(--color-error)]">
                  {error}
                </p>
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
                <Link
                  to="/support?topic=bug&tool=pdf-compressor"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-[var(--color-text-light)] underline hover:text-[var(--color-text-muted)]"
                >
                  Report this problem
                </Link>
              </div>
            )}

            {status === "idle" && (
              <div className="flex flex-col items-center gap-3">
                <UploadCloud className="h-10 w-10 text-[var(--color-primary)]" />
                <p className="font-semibold text-[var(--color-text)]">
                  {isDragActive ? "Drop it here" : "Drop a PDF"}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  or click to browse · up to 100 MB
                </p>
              </div>
            )}
          </div>

          {(status === "done" || status === "error") && (
            <div className="mt-4 flex justify-center gap-3">
              <button type="button" onClick={open} className="btn-secondary">
                <UploadCloud className="h-4 w-4" /> Compress another PDF
              </button>
              {file && status === "error" && (
                <button
                  type="button"
                  onClick={() => compress(file, level, appliedLimit)}
                  className="btn-secondary"
                >
                  <RotateCcw className="h-4 w-4" /> Retry
                </button>
              )}
            </div>
          )}

          <p className="mt-6 text-center text-xs text-[var(--color-text-light)]">
            Files are compressed on our server in memory and never stored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFCompressor;
