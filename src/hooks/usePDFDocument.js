import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import logger from '../utils/logger';

const usePDFDocument = () => {
  const [pdfDocument, setPdfDocument] = useState(null);
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!file) return;

    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        setPdfDocument(pdf);
        setPageCount(pdf.numPages);
        
        // Load first page preview
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        setPreview(canvas.toDataURL());
      } catch (error) {
        logger.error('Error loading PDF', error, 'usePDFDocument');
        setError('Failed to load PDF file. Please check if the file is valid.');
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [file]);

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