// Exports for the scanner: plain text, Word, and a searchable PDF.

const canvasToJpeg = (canvas, quality = 0.85) =>
  new Promise((resolve) =>
    canvas.toBlob(
      (blob) => blob.arrayBuffer().then((b) => resolve(new Uint8Array(b))),
      "image/jpeg",
      quality,
    ),
  );

const joinPages = (pages) =>
  pages
    .map((p) => p.text.trim())
    .filter(Boolean)
    .join("\n\n");

export const buildText = (pages) =>
  new Blob([joinPages(pages)], { type: "text/plain;charset=utf-8" });

export const buildDocx = async (pages) => {
  const { Document, Packer, Paragraph, TextRun, PageBreak } =
    await import("docx");
  const children = [];
  pages.forEach((page, index) => {
    if (index > 0)
      children.push(new Paragraph({ children: [new PageBreak()] }));
    page.text
      .split("\n")
      .forEach((line) =>
        children.push(new Paragraph({ children: [new TextRun(line)] })),
      );
  });
  return Packer.toBlob(new Document({ sections: [{ children }] }));
};

/**
 * One PDF page per scan: the cleaned-up image, with Tesseract's invisible
 * text layer laid over it so the PDF can be searched and its text selected.
 * Pages are A4 width with the scan's own proportions.
 */
export const buildSearchablePdf = async (pages) => {
  const { PDFDocument } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  const width = 595;
  for (const page of pages) {
    const image = await pdf.embedJpg(await canvasToJpeg(page.output));
    const height = (width * page.output.height) / page.output.width;
    const pdfPage = pdf.addPage([width, height]);
    pdfPage.drawImage(image, { x: 0, y: 0, width, height });
    if (page.textLayerPdf) {
      try {
        const [layer] = await pdf.embedPdf(page.textLayerPdf);
        pdfPage.drawPage(layer, { x: 0, y: 0, width, height });
      } catch {
        // A page without a usable text layer is still a valid image page
      }
    }
  }
  pdf.setTitle("Scanned document");
  pdf.setProducer("QuickSideTool");
  return new Blob([await pdf.save()], { type: "application/pdf" });
};
