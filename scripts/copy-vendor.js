// Copies the OCR, PDF and image engine files into public/vendor so the app
// serves them itself. The Chrome extension can't load scripts from a CDN
// (Manifest V3 blocks remote code), so these must ship inside the build.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

// jSquash imports "wasm-feature-detect" by package name, which a browser
// can't resolve without a bundler; point it at the vendored copy instead.
const featureDetect = (relative) => (source) =>
  source.replace(/from\s+['"]wasm-feature-detect['"]/g, `from '${relative}'`);

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
  // MuPDF (WebAssembly) for the PDF jobs that run on the device, see
  // public/workers/pdf-worker.js
  ["node_modules/mupdf/dist/mupdf.js", "public/vendor/mupdf/mupdf.js"],
  ["node_modules/mupdf/dist/mupdf-wasm.js", "public/vendor/mupdf/mupdf-wasm.js"],
  [
    "node_modules/mupdf/dist/mupdf-wasm.wasm",
    "public/vendor/mupdf/mupdf-wasm.wasm",
  ],
  // Image encoders for public/workers/image-worker.js: OxiPNG (lossless PNG)
  // and a WebP encoder for browsers that can't encode WebP (Safari)
  [
    "node_modules/wasm-feature-detect/dist/esm/index.js",
    "public/vendor/jsquash/wasm-feature-detect.js",
  ],
  ...["optimise.js", "meta.js", "codec/pkg/squoosh_oxipng.js", "codec/pkg/squoosh_oxipng_bg.wasm"].map(
    (file) => [
      `node_modules/@jsquash/oxipng/${file}`,
      `public/vendor/jsquash/oxipng/${file}`,
      file === "optimise.js" ? featureDetect("../wasm-feature-detect.js") : null,
    ]
  ),
  ...[
    "encode.js",
    "meta.js",
    "utils.js",
    "codec/enc/webp_enc.js",
    "codec/enc/webp_enc.wasm",
    "codec/enc/webp_enc_simd.js",
    "codec/enc/webp_enc_simd.wasm",
  ].map((file) => [
    `node_modules/@jsquash/webp/${file}`,
    `public/vendor/jsquash/webp/${file}`,
    file === "encode.js" ? featureDetect("../wasm-feature-detect.js") : null,
  ]),
];

for (const [from, to, transform] of files) {
  const target = path.join(root, to);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (transform) {
    fs.writeFileSync(target, transform(fs.readFileSync(path.join(root, from), "utf8")));
  } else {
    fs.copyFileSync(path.join(root, from), target);
  }
}
console.log(`copy-vendor: copied ${files.length} files to public/vendor`);
