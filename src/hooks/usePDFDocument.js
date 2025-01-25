import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { loadPDF, mergePDFs } from '../utils/pdfUtils';

const usePDFDocument = () => {
  const [pdfDocument, setPdfDocument] = useState(null);
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = useCallback(async (files) => {
    setIsLoading(true);
    try {
      const pdfDoc = await loadPDF(files[0]);
      setPdfDocument(pdfDoc);
      const pageCount = pdfDoc.getPageCount();
      setPages(Array.from({ length: pageCount }, (_, i) => ({ pageIndex: i, isSelected: false })));
    } catch (error) {
      console.error('Error loading PDF:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const combineFiles = useCallback(async () => {
    if (!pdfDocument) return null;
    // Implement PDF combining logic here
    return pdfDocument;
  }, [pdfDocument]);

  const deletePages = useCallback((pageIndexes) => {
    if (!pdfDocument) return;
    // Implement page deletion logic here
    setPages(prevPages => prevPages.filter(page => !pageIndexes.includes(page.pageIndex)));
  }, [pdfDocument]);

  const reorderPages = useCallback((newOrder) => {
    if (!pdfDocument) return;
    // Implement page reordering logic here
    setPages(newOrder.map(index => ({ pageIndex: index, isSelected: false })));
  }, [pdfDocument]);

  return {
    pdfDocument,
    pages,
    isLoading,
    handleFileChange,
    combineFiles,
    deletePages,
    reorderPages,
  };
};

export default usePDFDocument;