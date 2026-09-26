import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Camera,
  Check,
  Copy,
  Crop,
  Download,
  Loader2,
  Plus,
  RotateCcw,
  RotateCw,
  ScanLine,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import SEO from "./SEO";
import BackButton from "./BackButton";
import CameraCapture from "./scan/CameraCapture";
import CropEditor from "./scan/CropEditor";
import pdfjsLib from "../utils/pdfjs";
import {
  MAX_SIDE,
  detectPage,
  fileToCanvas,
  renderScan,
  rotateCanvas,
  rotatePoint,
} from "../utils/scan";
import { OCR_LANGUAGES, recognize } from "../utils/ocr";
import { buildDocx, buildSearchablePdf, buildText } from "../utils/scanExport";
import { BACKEND_URL, downloadBlob, readBackendError } from "../constants/api";

const FILTERS = [
  { id: "scan", label: "Scan" },
  { id: "original", label: "Original" },
  { id: "bw", label: "B&W" },
];

const MAX_PDF_PAGES = 30;
const LOW_CONFIDENCE = 0.6;

const cameraSupported =
  typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;

let nextId = 1;

// Let React paint (spinners) before a burst of synchronous pixel work
const nextFrame = () =>
  new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));

const canvasUrl = (canvas) =>
  new Promise((resolve) =>
    canvas.toBlob(
      (blob) => resolve(URL.createObjectURL(blob)),
      "image/jpeg",
      0.8,
    ),
  );

const isPdf = (file) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

/** Render each PDF page to a canvas at roughly 2000px on the long side. */
const renderPdfPages = async (file, onPage) => {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() })
    .promise;
  const count = Math.min(pdf.numPages, MAX_PDF_PAGES);
  for (let n = 1; n <= count; n++) {
    const page = await pdf.getPage(n);
    const base = page.getViewport({ scale: 1 });
    const scale = Math.min(MAX_SIDE, 2000) / Math.max(base.width, base.height);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    onPage(canvas, n);
  }
  return pdf.numPages;
};

const OCRProcessor = () => {
  const [pages, setPages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [language, setLanguage] = useState("eng");
  const [cropping, setCropping] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [opening, setOpening] = useState(false);
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);

  const uploadRef = useRef(null);
  const cameraInputRef = useRef(null);
  // Latest values for async work started from older renders
  const pagesRef = useRef(pages);
  pagesRef.current = pages;
  const languageRef = useRef(language);
  languageRef.current = language;
  // Latest edit per page: results from an older crop/filter/language are dropped
  const versions = useRef({});
  // Preview image URL per page, so replaced ones can be freed
  const previews = useRef({});

  const selected = pages.find((p) => p.id === selectedId) || pages[0] || null;
  const busy = pages.some((p) => p.status !== "done" && p.status !== "error");

  const updatePage = useCallback((id, patch) => {
    setPages((all) =>
      all.map((p) =>
        p.id === id
          ? { ...p, ...(typeof patch === "function" ? patch(p) : patch) }
          : p,
      ),
    );
  }, []);

  const newVersion = useCallback((id) => {
    versions.current[id] = (versions.current[id] || 0) + 1;
    return versions.current[id];
  }, []);
  const isLatest = useCallback(
    (id, version) => versions.current[id] === version,
    [],
  );

  // Read the text of a rendered page
  const readText = useCallback(
    async (id, output, version) => {
      updatePage(id, { status: "reading", progress: 0, stage: "Reading text" });
      let last = 0;
      try {
        const result = await recognize(
          output,
          languageRef.current,
          (value, stage) => {
            if (
              !isLatest(id, version) ||
              (Math.abs(value - last) < 0.03 && value !== 0)
            )
              return;
            last = value;
            updatePage(id, { progress: value, stage });
          },
        );
        if (isLatest(id, version)) {
          updatePage(id, {
            ...result,
            localText: result.text,
            aiModel: null,
            status: "done",
          });
        }
      } catch {
        if (isLatest(id, version)) {
          updatePage(id, {
            status: "error",
            error:
              "Couldn't read this page. Check your connection (the reader downloads once) and try again.",
          });
        }
      }
    },
    [updatePage, isLatest],
  );

  // Re-render a page after its source, crop or filter changed, then read it
  const refresh = useCallback(
    async (page) => {
      const version = newVersion(page.id);
      updatePage(page.id, { ...page, status: "processing" });
      await nextFrame();
      if (!isLatest(page.id, version)) return;
      const output = renderScan(page.source, page.quad, page.filter);
      const previewUrl = await canvasUrl(output);
      if (!isLatest(page.id, version)) {
        URL.revokeObjectURL(previewUrl);
        return;
      }
      if (previews.current[page.id])
        URL.revokeObjectURL(previews.current[page.id]);
      previews.current[page.id] = previewUrl;
      updatePage(page.id, { output, previewUrl });
      readText(page.id, output, version);
    },
    [updatePage, readText, newVersion, isLatest],
  );

  const addCanvas = useCallback(
    (canvas, name, origin) => {
      // Photos get the page found and cleaned up; screenshots and PDF pages are already flat
      const quad = origin === "pdf" ? null : detectPage(canvas);
      const page = {
        id: nextId++,
        name,
        source: canvas,
        quad,
        filter: origin === "camera" || quad ? "scan" : "original",
        text: "",
        localText: "",
        status: "processing",
      };
      setPages((all) => [...all, page]);
      setSelectedId(page.id);
      refresh(page);
    },
    [refresh],
  );

  const addFiles = useCallback(
    async (files) => {
      setNotice("");
      setCropping(false);
      setOpening(true);
      for (const file of files) {
        try {
          if (isPdf(file)) {
            const total = await renderPdfPages(file, (canvas, n) =>
              addCanvas(canvas, `${file.name} p${n}`, "pdf"),
            );
            if (total > MAX_PDF_PAGES)
              setNotice(
                `Only the first ${MAX_PDF_PAGES} pages of ${file.name} were added.`,
              );
          } else if (file.type.startsWith("image/")) {
            addCanvas(await fileToCanvas(file), file.name, "image");
          } else {
            setNotice(`${file.name} isn't an image or PDF.`);
          }
        } catch (error) {
          setNotice(
            error?.name === "PasswordException"
              ? `${file.name} is password-protected. Unlock it first.`
              : `Couldn't open ${file.name}.`,
          );
        }
      }
      setOpening(false);
    },
    [addCanvas],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: addFiles,
    noClick: true,
    noKeyboard: true,
    multiple: true,
    accept: { "image/*": [], "application/pdf": [".pdf"] },
  });

  // Paste a screenshot straight from the clipboard
  useEffect(() => {
    const onPaste = (event) => {
      if (event.target.closest?.("textarea, input")) return;
      const files = [...(event.clipboardData?.files || [])].filter(
        (f) => f.type.startsWith("image/") || isPdf(f),
      );
      if (files.length) {
        event.preventDefault();
        addFiles(files);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [addFiles]);

  // The AI option only shows when the backend has an OpenRouter key configured
  useEffect(() => {
    fetch(`${BACKEND_URL}/ocr/ai/status`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setAiEnabled(!!data?.enabled))
      .catch(() => {});
  }, []);

  // Free preview images when leaving the page
  useEffect(() => {
    const urls = previews.current;
    return () => Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const changeLanguage = (code) => {
    setLanguage(code);
    languageRef.current = code;
    pagesRef.current.forEach((p) => {
      if (p.output) readText(p.id, p.output, newVersion(p.id));
    });
  };

  const rotate = (page) => {
    // Rotate the source (and the crop corners with it) a quarter turn clockwise
    const source = rotateCanvas(page.source);
    const quad =
      page.quad &&
      [page.quad[3], page.quad[0], page.quad[1], page.quad[2]].map((p) =>
        rotatePoint(p, page.source.height),
      );
    refresh({ ...page, source, quad });
  };

  const remove = (page) => {
    newVersion(page.id); // drop any work still running for it
    if (previews.current[page.id])
      URL.revokeObjectURL(previews.current[page.id]);
    delete previews.current[page.id];
    const index = pages.findIndex((p) => p.id === page.id);
    const rest = pages.filter((p) => p.id !== page.id);
    setPages(rest);
    setSelectedId(rest[Math.min(index, rest.length - 1)]?.id ?? null);
    setCropping(false);
  };

  const improveWithAi = async (page) => {
    setNotice("");
    updatePage(page.id, { status: "ai" });
    try {
      const blob = await new Promise((r) =>
        page.output.toBlob(r, "image/jpeg", 0.85),
      );
      const form = new FormData();
      form.append("file", blob, "page.jpg");
      form.append(
        "language",
        OCR_LANGUAGES.find((l) => l.code === language)?.name || "",
      );
      const response = await fetch(`${BACKEND_URL}/ocr/ai`, {
        method: "POST",
        body: form,
      });
      if (!response.ok)
        throw new Error(
          await readBackendError(response, "AI is unavailable right now."),
        );
      const { text, model } = await response.json();
      updatePage(page.id, { text, aiModel: model, status: "done" });
    } catch (error) {
      updatePage(page.id, { status: "done" });
      setNotice(`${error.message} Your original text is still here.`);
    }
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setNotice("Couldn't copy - select the text and copy it manually.");
    }
  };

  const download = async (kind) => {
    const base = (pages[0]?.name || "scan")
      .replace(/\.[^.]+$/, "")
      .replace(/ p\d+$/, "");
    if (kind === "txt") downloadBlob(buildText(pages), `${base}.txt`);
    if (kind === "docx") downloadBlob(await buildDocx(pages), `${base}.docx`);
    if (kind === "pdf")
      downloadBlob(await buildSearchablePdf(pages), `${base}_scan.pdf`);
  };

  const openFilePicker = () => uploadRef.current?.click();
  const openCamera = () =>
    cameraSupported ? setCameraOpen(true) : cameraInputRef.current?.click();

  const hiddenInputs = (
    <>
      <input {...getInputProps()} />
      <input
        ref={uploadRef}
        type="file"
        multiple
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          addFiles([...e.target.files]);
          e.target.value = "";
        }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          setCameraOpen(false);
          addFiles([...e.target.files]);
          e.target.value = "";
        }}
      />
    </>
  );

  const reading =
    selected &&
    (selected.status === "processing" || selected.status === "reading");

  return (
    <div className="min-h-screen bg-[var(--color-bg)]" {...getRootProps()}>
      <SEO
        title="Scan to Text - Extract Text from Photos, Screenshots and PDFs (OCR)"
        description="Snap a document, paste a screenshot or drop a PDF and copy the text. Pages are straightened and cleaned up automatically. Free, runs in your browser."
        url="/ocr-processor"
      />
      {hiddenInputs}

      {cameraOpen && (
        <CameraCapture
          onCapture={(canvas) =>
            addCanvas(canvas, `Photo ${pagesRef.current.length + 1}`, "camera")
          }
          onClose={() => setCameraOpen(false)}
          onFallback={() => cameraInputRef.current?.click()}
        />
      )}

      {isDragActive && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-brand-caribbean-green/20 backdrop-blur-sm">
          <p className="rounded-xl bg-[var(--color-bg)] px-6 py-4 text-lg font-semibold text-[var(--color-text)] shadow-lg">
            Drop to scan
          </p>
        </div>
      )}

      <div className="container py-8 md:py-12">
        <BackButton />

        <div className="mx-auto mt-6 max-w-2xl">
          <h1 className="h2 text-center">Scan to text</h1>
          <p className="mt-2 text-center text-[var(--color-text-muted)]">
            Snap a document, paste a screenshot or drop a PDF, then copy the
            text.
          </p>

          {pages.length === 0 ? (
            <div className="upload-zone mt-8 p-8 text-center">
              <ScanLine className="mx-auto h-12 w-12 text-[var(--color-primary)]" />
              <p className="mt-3 font-semibold text-[var(--color-text)]">
                Drop images or a PDF here
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                or paste a screenshot with{" "}
                {/Mac/i.test(navigator.platform) ? "⌘" : "Ctrl"}+V
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={openCamera}
                  className="btn-primary"
                >
                  <Camera className="h-4 w-4" /> Take photo
                </button>
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="btn-secondary"
                >
                  <Upload className="h-4 w-4" /> Upload
                </button>
              </div>
              {opening && (
                <p className="mt-4 flex items-center justify-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <Loader2 className="h-4 w-4 animate-spin" /> Opening...
                </p>
              )}
              <p className="mt-6 text-xs text-[var(--color-text-light)]">
                Photos are straightened and cleaned up automatically. Everything
                runs in your browser.
              </p>
            </div>
          ) : (
            <>
              {/* Page strip */}
              <div
                className="mt-6 flex gap-2 overflow-x-auto pb-2"
                aria-label="Scanned pages"
              >
                {pages.map((page, index) => (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(page.id);
                      setCropping(false);
                    }}
                    aria-label={`Page ${index + 1}`}
                    aria-current={page.id === selected?.id}
                    className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-[var(--color-bg-alt)] ${
                      page.id === selected?.id
                        ? "border-[var(--color-primary)]"
                        : "border-[var(--color-border)]"
                    }`}
                  >
                    {page.previewUrl && (
                      <img
                        src={page.previewUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                    <span className="absolute bottom-0 left-0 rounded-tr bg-black/60 px-1.5 text-xs text-white">
                      {index + 1}
                    </span>
                    {page.status !== "done" && page.status !== "error" && (
                      <Loader2 className="absolute right-1 top-1 h-3.5 w-3.5 animate-spin text-[var(--color-primary)]" />
                    )}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={openCamera}
                  aria-label="Scan another page with the camera"
                  className="flex h-20 w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)] hover:border-[var(--color-primary)]"
                >
                  <Camera className="h-5 w-5" /> Photo
                </button>
                <button
                  type="button"
                  onClick={openFilePicker}
                  aria-label="Add more files"
                  className="flex h-20 w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)] hover:border-[var(--color-primary)]"
                >
                  <Plus className="h-5 w-5" /> Add
                </button>
              </div>

              {/* Selected page */}
              {selected && (
                <div className="card mt-3 p-4">
                  {cropping ? (
                    <CropEditor
                      source={selected.source}
                      quad={selected.quad}
                      onCancel={() => setCropping(false)}
                      onApply={(quad) => {
                        setCropping(false);
                        refresh({ ...selected, quad, filter: selected.filter });
                      }}
                    />
                  ) : (
                    <>
                      <div className="relative flex min-h-[8rem] justify-center rounded-lg bg-[var(--color-bg-alt)]">
                        {selected.previewUrl && (
                          <img
                            src={selected.previewUrl}
                            alt={`Scanned page ${pages.indexOf(selected) + 1}`}
                            className="max-h-[45vh] max-w-full rounded object-contain"
                          />
                        )}
                        {selected.status === "processing" && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30">
                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setCropping(true)}
                            className="btn-secondary px-3 py-2"
                            aria-label="Crop"
                            title="Crop"
                          >
                            <Crop className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => rotate(selected)}
                            className="btn-secondary px-3 py-2"
                            aria-label="Rotate"
                            title="Rotate"
                          >
                            <RotateCw className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(selected)}
                            className="btn-secondary px-3 py-2 text-[var(--color-error)]"
                            aria-label="Remove page"
                            title="Remove page"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div
                          role="radiogroup"
                          aria-label="Look"
                          className="flex rounded-full border border-[var(--color-border)] p-0.5"
                        >
                          {FILTERS.map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              role="radio"
                              aria-checked={selected.filter === f.id}
                              onClick={() =>
                                selected.filter !== f.id &&
                                refresh({ ...selected, filter: f.id })
                              }
                              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                                selected.filter === f.id
                                  ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                              }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Text */}
              {selected && !cropping && (
                <div className="card mt-4 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--color-text)]">
                      Text
                      {selected.aiModel && (
                        <span className="rounded-full bg-[var(--color-primary-light)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                          AI
                        </span>
                      )}
                    </h2>
                    <label className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                      Language
                      <select
                        value={language}
                        onChange={(e) => changeLanguage(e.target.value)}
                        className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm text-[var(--color-text)]"
                      >
                        {OCR_LANGUAGES.map((l) => (
                          <option key={l.code} value={l.code}>
                            {l.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {reading || selected.status === "ai" ? (
                    <div className="py-6" aria-live="polite">
                      <p className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {selected.status === "ai"
                          ? "Asking AI to read the page..."
                          : selected.status === "processing"
                            ? "Cleaning up the page..."
                            : `${selected.stage || "Reading text"}...`}
                      </p>
                      {selected.status === "reading" && (
                        <div className="mt-3 h-1.5 w-full rounded-full bg-[var(--color-bg-alt)]">
                          <div
                            className="h-1.5 rounded-full bg-[var(--color-primary)] transition-all"
                            style={{
                              width: `${Math.round((selected.progress || 0) * 100)}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ) : selected.status === "error" ? (
                    <div className="py-4" role="alert">
                      <p className="text-sm text-[var(--color-error)]">{selected.error}</p>
                      <button
                        type="button"
                        onClick={() => refresh(selected)}
                        className="btn-secondary mt-3"
                      >
                        <RotateCcw className="h-4 w-4" /> Try again
                      </button>
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={selected.text}
                        onChange={(e) =>
                          updatePage(selected.id, { text: e.target.value })
                        }
                        rows={10}
                        placeholder="No text found on this page."
                        aria-label="Extracted text"
                        className="input font-mono text-sm leading-relaxed"
                      />
                      {selected.text &&
                        selected.confidence < LOW_CONFIDENCE &&
                        !selected.aiModel && (
                          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                            Some of this may be misread. Try cropping tighter,
                            another look (Scan / B&amp;W)
                            {aiEnabled ? ", or Improve with AI" : ""}.
                          </p>
                        )}
                    </>
                  )}

                  {notice && (
                    <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                      {notice}
                    </p>
                  )}

                  {aiEnabled &&
                    selected.output &&
                    !reading &&
                    selected.status !== "ai" && (
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {selected.aiModel ? (
                          <button
                            type="button"
                            onClick={() =>
                              updatePage(selected.id, {
                                text: selected.localText,
                                aiModel: null,
                              })
                            }
                            className="btn-secondary px-4 py-2"
                          >
                            <RotateCcw className="h-4 w-4" /> Use original text
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => improveWithAi(selected)}
                            className="btn-secondary px-4 py-2"
                          >
                            <Sparkles className="h-4 w-4" /> Improve with AI
                          </button>
                        )}
                        <span className="text-xs text-[var(--color-text-light)]">
                          Sends this page to an AI model via OpenRouter.
                        </span>
                      </div>
                    )}

                  <div className="mt-4 space-y-3 border-t border-[var(--color-border)] pt-4">
                    <button
                      type="button"
                      onClick={() => copyText(selected.text)}
                      disabled={!selected.text}
                      className="btn-primary w-full"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied ? "Copied" : "Copy text"}
                    </button>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <span className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                        <Download className="h-4 w-4" aria-hidden="true" />
                        {pages.length > 1
                          ? `Save all ${pages.length} pages as`
                          : "Save as"}
                      </span>
                      {[
                        ["txt", "TXT"],
                        ["docx", "Word"],
                        ["pdf", "PDF"],
                      ].map(([kind, label]) => (
                        <button
                          key={kind}
                          type="button"
                          onClick={() => download(kind)}
                          disabled={busy}
                          className="btn-secondary px-4 py-1.5"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OCRProcessor;
