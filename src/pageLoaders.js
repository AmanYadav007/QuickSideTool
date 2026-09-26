import { lazy } from "react";

// Every page except the home page is its own bundle, so visitors download
// only the tool they open. Paths map to loaders so links can prefetch.

const RELOAD_KEY = "chunk-reload";

// After a deploy, a tab opened on the previous version asks for bundle files
// that no longer exist. Reload once to pick up the new version.
const withReload = (load) => () =>
  load().then(
    (module) => {
      try {
        sessionStorage.removeItem(RELOAD_KEY);
      } catch {}
      return module;
    },
    (error) => {
      let reloaded = false;
      try {
        reloaded = sessionStorage.getItem(RELOAD_KEY) === "1";
        if (!reloaded) sessionStorage.setItem(RELOAD_KEY, "1");
      } catch {
        reloaded = true; // no storage: don't risk a reload loop
      }
      if (!reloaded) {
        window.location.reload();
        return new Promise(() => {}); // keep showing the loader until it reloads
      }
      throw error;
    },
  );

const loaders = {
  pdfCompressor: () => import("./components/PDFCompressor"),
  fileConverter: () => import("./components/FileConverter"),
  pdfTool: () => import("./pages/PDFTool"),
  pdfUnlocker: () => import("./components/PDFUnlocker"),
  pdfLinkRemover: () => import("./components/PDFLinkRemover"),
  ocr: () => import("./components/OCRProcessor"),
  imageResize: () => import("./components/ImageResize"),
  imageCompressor: () => import("./components/ImageCompressor"),
  imageConverter: () => import("./components/ImageFormatConverter"),
  qr: () => import("./components/QrCodeGenerator"),
  toolkit: () => import("./pages/Toolkit"),
  about: () => import("./pages/About"),
  contact: () => import("./pages/Contact"),
  help: () => import("./pages/Help"),
  blog: () => import("./pages/Blog"),
  privacy: () => import("./pages/PrivacyPolicy"),
  terms: () => import("./pages/TermsOfService"),
  game: () => import("./components/DiamondQuestGame"),
};

export const pages = Object.fromEntries(
  Object.entries(loaders).map(([name, load]) => [name, lazy(withReload(load))]),
);

// Every path that renders a page, including keyword aliases
const PATHS = {
  "/pdf-compressor": "pdfCompressor",
  "/compress-pdf": "pdfCompressor",
  "/file-converter": "fileConverter",
  "/pdf-to-word": "fileConverter",
  "/pdf-to-docx": "fileConverter",
  "/word-to-pdf": "fileConverter",
  "/docx-to-pdf": "fileConverter",
  "/word-to-excel": "fileConverter",
  "/pdf-to-excel": "fileConverter",
  "/pdf-tool": "pdfTool",
  "/pdf-editor": "pdfTool",
  "/unlock-pdf": "pdfUnlocker",
  "/remove-pdf-password": "pdfUnlocker",
  "/pdf-link-remove": "pdfLinkRemover",
  "/remove-links-from-pdf": "pdfLinkRemover",
  "/ocr-processor": "ocr",
  "/ocr-pdf-to-word": "ocr",
  "/image-tools/resize": "imageResize",
  "/image-resizer": "imageResize",
  "/image-tools/compress": "imageCompressor",
  "/image-compressor": "imageCompressor",
  "/image-tools/convert": "imageConverter",
  "/image-converter": "imageConverter",
  "/qr-tool": "qr",
  "/qr-code-generator": "qr",
  "/toolkit": "toolkit",
  "/about": "about",
  "/contact": "contact",
  "/help": "help",
  "/blog": "blog",
  "/privacy-policy": "privacy",
  "/terms-of-service": "terms",
  "/diamond-mines": "game",
};

/** Start downloading a page's code, e.g. when a link to it is hovered. */
export const prefetchPath = (to) => {
  const name = PATHS[String(to).split(/[?#]/)[0]];
  // Plain import: a failed prefetch is harmless, the page retries on open
  if (name) loaders[name]().catch(() => {});
};

/**
 * Once the home page has fully loaded and gone idle, fetch the most-used
 * tools in the background so opening them is instant. Only on connections
 * that report as fast; never while the page itself is still loading.
 */
export const prefetchPopular = () => {
  const connection = navigator.connection;
  if (connection && (connection.saveData || connection.effectiveType !== "4g")) return;
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
  const start = () =>
    idle(() =>
      ["/pdf-compressor", "/file-converter", "/image-tools/compress"].forEach(prefetchPath)
    );
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
};
