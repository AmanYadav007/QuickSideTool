import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  CheckCircle,
  Download,
  Info,
  Loader2,
  UploadCloud,
  XCircle,
} from "lucide-react";
import SEO from "./SEO";
import BackButton from "./BackButton";
import { preloadPdfEngine, runPdfJob } from "../utils/pdfWorker";
import { BACKEND_URL, downloadBlob } from "../constants/api";

const outputName = (name) => `nolinks_${name.replace(/\.pdf$/i, "")}.pdf`;

const PDFLinkRemover = () => {
  const [file, setFile] = useState(null);
  // idle | working | done | nothing | error
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  // Ignore results from a file the user has since replaced
  const requestId = useRef(0);

  // The work runs on the device; fetch the engine while the user picks a file
  useEffect(preloadPdfEngine, []);

  // Same job on the server, for devices that can't run the engine
  const removeOnServer = async (pdf) => {
    const formData = new FormData();
    formData.append("file", pdf);
    const response = await fetch(`${BACKEND_URL}/remove-pdf-links`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw Object.assign(
        new Error(data.error || "Couldn't remove the links."),
        { code: data.code },
      );
    }
    return {
      blob: await response.blob(),
      removed: Number(response.headers.get("X-Links-Removed")) || null,
    };
  };

  const process = useCallback(async (pdf) => {
    const id = ++requestId.current;
    setStatus("working");
    setResult(null);
    setError("");
    try {
      let outcome;
      try {
        const { bytes, removed, pages } = await runPdfJob("removeLinks", pdf);
        outcome = {
          blob: new Blob([bytes], { type: "application/pdf" }),
          removed,
          pages,
        };
      } catch (jobError) {
        if (jobError.code === "no-links") {
          if (id === requestId.current) setStatus("nothing");
          return;
        }
        if (jobError.code !== "engine-unavailable") throw jobError;
        try {
          outcome = await removeOnServer(pdf);
        } catch (serverError) {
          if (serverError.code !== "no-links") throw serverError;
          if (id === requestId.current) setStatus("nothing");
          return;
        }
      }
      if (id !== requestId.current) return;
      setResult(outcome);
      setStatus("done");
    } catch (jobError) {
      if (id !== requestId.current) return;
      setError(
        jobError instanceof TypeError
          ? "Couldn't reach the server. Check your connection and try again."
          : jobError.message,
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
      process(dropped);
    },
    [process],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    noClick: status === "working",
    noKeyboard: status === "working",
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SEO
        title="Remove Hyperlinks from PDF – Clean PDF Links Online"
        description="Strip every link from a PDF in one step, right in your browser. The file never leaves your device. Free, no signup."
        url="/pdf-link-remove"
      />
      <div className="container py-8 md:py-12">
        <BackButton />

        <div className="mx-auto mt-6 max-w-2xl">
          <h1 className="h2 text-center">Remove links from PDF</h1>
          <p className="mt-2 text-center text-[var(--color-text-muted)]">
            Drop a PDF and every hyperlink is stripped out. Text, comments and
            form fields stay.
          </p>

          <div
            {...getRootProps()}
            className={`upload-zone mt-8 cursor-pointer p-8 text-center ${isDragActive ? "drag-active" : ""}`}
          >
            <input {...getInputProps()} />

            {status === "working" && (
              <div
                className="flex flex-col items-center gap-3"
                aria-live="polite"
              >
                <Loader2 className="h-10 w-10 animate-spin text-[var(--color-primary)]" />
                <p className="break-all font-semibold text-[var(--color-text)]">
                  Removing links from {file?.name}...
                </p>
              </div>
            )}

            {status === "done" && result && (
              <div
                className="flex flex-col items-center gap-3"
                aria-live="polite"
              >
                <CheckCircle className="h-10 w-10 text-[var(--color-success)]" />
                <p className="text-xl font-semibold text-[var(--color-text)]">
                  {result.removed != null
                    ? `Removed ${result.removed} link${result.removed === 1 ? "" : "s"}${
                        result.pages > 1 ? ` from ${result.pages} pages` : ""
                      }`
                    : "Links removed"}
                </p>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    downloadBlob(result.blob, outputName(file.name));
                  }}
                  className="btn-primary mt-2"
                >
                  <Download className="h-4 w-4" /> Download PDF
                </button>
              </div>
            )}

            {status === "nothing" && (
              <div
                className="flex flex-col items-center gap-3"
                aria-live="polite"
              >
                <Info className="h-10 w-10 text-[var(--color-primary)]" />
                <p className="font-semibold text-[var(--color-text)]">
                  This PDF has no links
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  There was nothing to remove.
                </p>
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
                    onClick={(event) => event.stopPropagation()}
                    className="link text-sm font-semibold"
                  >
                    Unlock the PDF first
                  </Link>
                )}
                <Link
                  to="/support?topic=bug&tool=pdf-link-remove"
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
                  or click to browse
                </p>
              </div>
            )}
          </div>

          {status !== "idle" && status !== "working" && (
            <div className="mt-4 flex justify-center">
              <button type="button" onClick={open} className="btn-secondary">
                <UploadCloud className="h-4 w-4" /> Clean another PDF
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-[var(--color-text-light)]">
            Runs on your device: the PDF never leaves it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFLinkRemover;
