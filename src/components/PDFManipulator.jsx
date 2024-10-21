import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { PDFDocument } from 'pdf-lib';
import { FileText, Trash2, Download } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const App = () => {
  const [pages, setPages] = useState([]);
  const [numPages, setNumPages] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedPages, setSelectedPages] = useState([]);

  const sortPages = (pagesArray) => {
    return pagesArray.sort((a, b) => {
      const nameA = a.file.name.toLowerCase();
      const nameB = b.file.name.toLowerCase();
      
      // Extract number from file name (if exists)
      const numA = parseInt(nameA.match(/\d+/));
      const numB = parseInt(nameB.match(/\d+/));
      
      if (numA && numB) {
        return numA - numB;
      } else if (numA) {
        return -1;
      } else if (numB) {
        return 1;
      } else {
        return nameA.localeCompare(nameB);
      }
    });
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const newPages = [];
    for (const file of acceptedFiles) {
      if (file.type === 'application/pdf') {
        try {
          const pdf = await PDFDocument.load(await file.arrayBuffer());
          const pageCount = pdf.getPageCount();
          for (let i = 0; i < pageCount; i++) {
            newPages.push({ file, pageIndex: i, type: 'pdf' });
          }
        } catch (error) {
          console.error(`Error loading PDF file ${file.name}:`, error);
        }
      } else if (file.type.startsWith('image/')) {
        if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
          newPages.push({ file, type: 'image' });
        } else {
          console.warn(`Unsupported image type: ${file.type}`);
        }
      } else {
        console.warn(`Unsupported file type: ${file.type}`);
      }
    }
    const sortedPages = sortPages([...pages, ...newPages]);
    setPages(sortedPages);
  }, [pages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }
  });

  useEffect(() => {
    setNumPages(pages.length);
  }, [pages]);

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedPages([]);
  };

  const togglePageSelection = (index) => {
    setSelectedPages(prevSelected => 
      prevSelected.includes(index)
        ? prevSelected.filter(i => i !== index)
        : [...prevSelected, index]
    );
  };

  const deleteSelectedPages = () => {
    setPages(prevPages => prevPages.filter((_, index) => !selectedPages.includes(index)));
    setSelectedPages([]);
    setIsDeleteMode(false);
  };

  const onDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    const draggedOverItem = pages[index];

    if (draggedItem === null || draggedItem === index) {
      return;
    }

    const items = pages.filter((_, idx) => idx !== draggedItem);
    items.splice(index, 0, pages[draggedItem]);

    setPages(items);
    setDraggedItem(index);
  };

  const onDragEnd = () => {
    setDraggedItem(null);
  };

  const createFinalPDF = async () => {
    const pdfDoc = await PDFDocument.create();
    
    for (const page of pages) {
      try {
        if (page.type === 'pdf') {
          const srcDoc = await PDFDocument.load(await page.file.arrayBuffer());
          const [copiedPage] = await pdfDoc.copyPages(srcDoc, [page.pageIndex]);
          pdfDoc.addPage(copiedPage);
        } else if (page.type === 'image') {
          const imageBytes = await page.file.arrayBuffer();
          let image;
          if (page.file.type === 'image/jpeg' || page.file.type === 'image/jpg') {
            image = await pdfDoc.embedJpg(imageBytes);
          } else if (page.file.type === 'image/png') {
            image = await pdfDoc.embedPng(imageBytes);
          } else {
            console.warn(`Unsupported image type: ${page.file.type}`);
            continue;
          }
          
          const imgWidth = image.width;
          const imgHeight = image.height;
          
          // Create a new page with the exact dimensions of the image
          const imagePage = pdfDoc.addPage([imgWidth, imgHeight]);
          
          // Draw the image on the page at its original size
          imagePage.drawImage(image, {
            x: 0,
            y: 0,
            width: imgWidth,
            height: imgHeight,
          });
        }
      } catch (error) {
        console.error(`Error processing page ${pages.indexOf(page) + 1}:`, error);
      }
    }
  
    try {
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'combined.pdf';
      link.click();
    } catch (error) {
      console.error('Error saving PDF:', error);
      alert('An error occurred while creating the PDF. Please try again.');
    }
  };

  return (
    <div className="bg-white bg-opacity-10 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg p-8">
      <h2 className="text-3xl font-bold text-white mb-6">PDF ToolBox</h2>
      
      <div 
        {...getRootProps()} 
        className="border-2 border-dashed border-white border-opacity-50 rounded-xl p-8 text-center cursor-pointer mb-8 transition-all duration-300 hover:border-opacity-100"
      >
        <input {...getInputProps()} />
        <FileText className="mx-auto mb-4 text-white" size={48} />
        <p className="text-white text-lg">
          {isDragActive ? "Drop the files here ..." : "Drag 'n' drop PDF files or images here, or click to select files"}
        </p>
      </div>

      {pages.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Uploaded Files</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pages.map((page, index) => (
              <div 
                key={`page-${index}`}
                draggable={!isDeleteMode}
                onDragStart={(e) => onDragStart(e, index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragEnd={onDragEnd}
                className="relative bg-white bg-opacity-20 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg"
                style={{ aspectRatio: '3/4' }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {page.type === 'pdf' ? (
                    <Document file={page.file}>
                      <Page 
                        pageNumber={page.pageIndex + 1} 
                        width={150}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </Document>
                  ) : (
                    <img 
                      src={URL.createObjectURL(page.file)} 
                      alt={page.file.name} 
                      className="max-w-full max-h-full object-contain" 
                    />
                  )}
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}/{numPages}
                </div>
                {isDeleteMode && (
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(index)}
                    onChange={() => togglePageSelection(index)}
                    className="absolute top-2 right-2 w-5 h-5"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <button 
          onClick={toggleDeleteMode}
          className={`px-6 py-2 rounded-full text-white font-medium transition-all duration-300 ${isDeleteMode ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} flex items-center`}
        >
          <Trash2 className="mr-2" size={20} />
          {isDeleteMode ? 'Cancel Delete' : 'Delete Pages'}
        </button>
        {isDeleteMode && (
          <button 
            onClick={deleteSelectedPages}
            className="px-6 py-2 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-all duration-300 flex items-center"
          >
            <Trash2 className="mr-2" size={20} />
            Confirm Delete ({selectedPages.length})
          </button>
        )}
        {!isDeleteMode && pages.length > 0 && (
          <button 
            onClick={createFinalPDF}
            className="px-6 py-2 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 transition-all duration-300 flex items-center"
          >
            <Download className="mr-2" size={20} />
            Download Combined PDF
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
