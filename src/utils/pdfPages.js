// PDF page helpers shared by the scanner and the converter (pdf.js).
import pdfjsLib from "./pdfjs";
import { MAX_SIDE } from "./scan";

export const MAX_PDF_PAGES = 30;

const openPdf = async (file) => pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;

/**
 * Render each page (up to maxPages) to a canvas about 2000 px on the long
 * side, one at a time; `onPage(canvas, number)` may be async. Returns the
 * document's total page count.
 */
export const renderPdfPages = async (file, onPage, maxPages = MAX_PDF_PAGES) => {
  const pdf = await openPdf(file);
  try {
    const count = Math.min(pdf.numPages, maxPages);
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
      await onPage(canvas, n);
    }
    return pdf.numPages;
  } finally {
    pdf.destroy();
  }
};

/**
 * True when a PDF is a scan: its first pages (up to 3) have almost no
 * text layer, so a text-based converter would produce an empty document.
 */
export const isScannedPdf = async (file) => {
  const pdf = await openPdf(file);
  try {
    const pages = Math.min(pdf.numPages, 3);
    let characters = 0;
    for (let n = 1; n <= pages; n++) {
      const { items } = await (await pdf.getPage(n)).getTextContent();
      characters += items.reduce((sum, item) => sum + (item.str || "").trim().length, 0);
    }
    return characters < 20 * pages;
  } finally {
    pdf.destroy();
  }
};
