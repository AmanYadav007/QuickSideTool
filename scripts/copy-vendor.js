// Copies the OCR and PDF engine files into public/vendor so the app serves
// them itself. The Chrome extension can't load scripts from a CDN (Manifest V3
// blocks remote code), so these must ship inside the build.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const files = [
  [
    "node_modules/tesseract.js/dist/worker.min.js",
    "public/vendor/tesseract/worker.min.js",
  ],
  // Tesseract picks the SIMD build when the browser supports it
  [
    "node_modules/tesseract.js-core/tesseract-core-simd-lstm.wasm.js",
    "public/vendor/tesseract/tesseract-core-simd-lstm.wasm.js",
  ],
  [
    "node_modules/tesseract.js-core/tesseract-core-lstm.wasm.js",
    "public/vendor/tesseract/tesseract-core-lstm.wasm.js",
  ],
  [
    "node_modules/pdfjs-dist/build/pdf.worker.min.js",
    "public/vendor/pdfjs/pdf.worker.min.js",
  ],
];

for (const [from, to] of files) {
  const target = path.join(root, to);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(root, from), target);
}
console.log(`copy-vendor: copied ${files.length} files to public/vendor`);
