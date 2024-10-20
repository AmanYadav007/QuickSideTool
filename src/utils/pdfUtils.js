import { PDFDocument } from 'pdf-lib';

export const loadPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  return await PDFDocument.load(arrayBuffer);
};

export const mergePDFs = async (pdfs) => {
  const mergedPdf = await PDFDocument.create();
  for (const pdf of pdfs) {
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  return mergedPdf;
};