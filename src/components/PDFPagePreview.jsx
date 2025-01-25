import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Document, Page } from 'react-pdf';

const PDFPagePreview = ({
  page,
  index,
  pdfFile,
  isDeleteMode,
  isSelected,
  toggleSelection,
}) => {
  return (
    <Draggable draggableId={`page-${index}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="relative m-2 border-2 border-gray-300 rounded-md overflow-hidden"
          style={{
            width: '150px',
            height: '212px', // Maintain 1.414 aspect ratio (A4)
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {page.type === 'pdf' ? (
              <Document file={pdfFile}>
                <Page
                  pageNumber={page.pageIndex + 1}
                  width={140} // Slightly smaller than container to show border
                  height={200}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            ) : (
              <img 
                src={URL.createObjectURL(page.file)} 
                alt={`Page ${index + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
          <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
            {index + 1}
          </div>
          {isDeleteMode && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={toggleSelection}
              className="absolute top-2 right-2 w-4 h-4"
            />
          )}
        </div>
      )}
    </Draggable>
  );
};

export default PDFPagePreview;