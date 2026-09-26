import { createWorker, OEM } from "tesseract.js";

// Worker and engine are served from public/vendor (see scripts/copy-vendor.js):
// the Chrome extension can't load them from a CDN. Language data is plain
// data, so Tesseract still downloads it on first use and caches it.
const VENDOR = `${window.location.origin}${process.env.PUBLIC_URL}/vendor/tesseract`;

export const OCR_LANGUAGES = [
  { code: "eng", name: "English" },
  { code: "hin", name: "Hindi" },
  { code: "spa", name: "Spanish" },
  { code: "fra", name: "French" },
  { code: "deu", name: "German" },
  { code: "por", name: "Portuguese" },
  { code: "ita", name: "Italian" },
  { code: "nld", name: "Dutch" },
  { code: "rus", name: "Russian" },
  { code: "ara", name: "Arabic" },
  { code: "ben", name: "Bengali" },
  { code: "tam", name: "Tamil" },
  { code: "tel", name: "Telugu" },
  { code: "mar", name: "Marathi" },
  { code: "urd", name: "Urdu" },
  { code: "chi_sim", name: "Chinese (Simplified)" },
  { code: "jpn", name: "Japanese" },
  { code: "kor", name: "Korean" },
];

let workerPromise = null;
let workerLanguage = null;
let onProgress = null;
// One job at a time: recognition and language switches share a single worker
let queue = Promise.resolve();

const getWorker = async (language) => {
  if (!workerPromise) {
    workerLanguage = language;
    workerPromise = createWorker(language, OEM.LSTM_ONLY, {
      workerPath: `${VENDOR}/worker.min.js`,
      corePath: VENDOR,
      workerBlobURL: false,
      logger: (message) => onProgress?.(message),
    }).catch((error) => {
      workerPromise = null;
      throw error;
    });
  }
  const worker = await workerPromise;
  if (language !== workerLanguage) {
    await worker.reinitialize(language, OEM.LSTM_ONLY);
    workerLanguage = language;
  }
  return worker;
};

/**
 * Read the text in a canvas. `progress` gets a 0-1 value and a stage label.
 * Resolves to { text, confidence (0-1), textLayerPdf } where textLayerPdf is
 * an invisible-text PDF page used to make exported scans searchable.
 */
export const recognize = (canvas, language, progress) => {
  const job = queue.then(async () => {
    onProgress = ({ status, progress: value }) => {
      if (status === "recognizing text") progress?.(value, "Reading text");
      else if (/load|initializ/i.test(status))
        progress?.(0, "Preparing the text reader (first time only)");
    };
    try {
      const worker = await getWorker(language);
      const { data } = await worker.recognize(
        canvas,
        { rotateAuto: true, pdfTextOnly: true },
        { text: true, pdf: true },
      );
      return {
        text: (data.text || "").trim(),
        confidence: (data.confidence || 0) / 100,
        textLayerPdf: data.pdf ? new Uint8Array(data.pdf) : null,
      };
    } finally {
      onProgress = null;
    }
  });
  // Keep the queue alive after a failed job
  queue = job.catch(() => {});
  return job;
};
