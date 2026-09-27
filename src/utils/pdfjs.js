import * as pdfjsLib from "pdfjs-dist";

// Served from public/vendor (see scripts/copy-vendor.js) rather than a CDN.
// This setting is global, so every component that reads PDFs imports pdf.js
// from here.
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/vendor/pdfjs/pdf.worker.min.js`;

export default pdfjsLib;
