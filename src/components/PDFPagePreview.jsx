import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Document, Page } from 'react-pdf';
import { CheckCircle, XCircle } from 'lucide-react'; // Import icons for selection feedback

const PDFPagePreview = ({
  page,
  index,
  pdfFile, // This is the overall PDF file for the Document component
  isDeleteMode,
  isSelected,
  toggleSelection,
}) => {
  // Determine if it's a PDF page or an image based on the 'page' object's type
  const isPdfPage = page.type === 'pdf';

  return (
    <Draggable draggableId={`page-${index}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            relative group rounded-lg overflow-hidden bg-white/5 backdrop-blur-md shadow-lg border border-white/10
            transition-all duration-200 ease-in-out cursor-grab select-none
            ${isSelected ? 'border-teal-400 ring-2 ring-teal-400 scale-[1.02] shadow-xl' : 'hover:scale-[1.02] hover:shadow-xl hover:border-blue-400'}
            ${snapshot.isDragging ? 'scale-[1.05] shadow-2xl-custom-drag border-blue-400 z-50' : ''}
            ${isDeleteMode && isSelected ? 'opacity-80' : ''}
          `}
          style={{
            width: '150px',
            height: '212px', // Standard A4 aspect ratio (approx 1:1.414)
            ...provided.draggableProps.style, // Apply styles from react-beautiful-dnd
          }}
        >
          {/* Visual Container for the Page Content */}
          <div className="absolute inset-0 flex items-center justify-center p-1.5"> {/* Padding to create inner border effect */}
            {isPdfPage ? (
              // react-pdf Document and Page components
              <Document
                file={pdfFile} // Ensure this is the correct PDF file (File object or URL)
                loading={
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Loader2 size={24} className="animate-spin mb-2" />
                    <span className="text-xs">Loading PDF...</span>
                  </div>
                }
                error={
                  <div className="flex flex-col items-center justify-center h-full text-red-400 text-xs text-center p-2">
                    <XCircle size={24} className="mb-1" />
                    Failed to load PDF page.
                  </div>
                }
              >
                <Page
                  pageNumber={page.pageIndex + 1} // `page.pageIndex` is 0-based
                  width={140} // Fit within the 150px container with padding
                  height={200} // Calculated to maintain aspect ratio with width 140
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Loader2 size={20} className="animate-spin" />
                    </div>
                  }
                  error={
                    <div className="flex items-center justify-center h-full text-red-400">
                      <XCircle size={20} />
                    </div>
                  }
                />
              </Document>
            ) : (
              // Image preview
              <img
                src={URL.createObjectURL(page.file)} // `page.file` for images is the File object
                alt={`Page ${index + 1}`}
                className="max-w-full max-h-full object-contain"
                // Add a basic loading/error for image if needed
                onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5YmFiYWIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9ImZyb250IiBzdHJva2UtbGluZWpvaW49ImZyb250Ij48cGF0aCBkPSBNOC41IDcuNSwxMiA0LDE1LjUgNy41Ii8+PHBhdGggZD0iTTcuNSAxMi41LDQgMTYsNy41IDE5LjUiLz48cGF0aCBkPSJNMTUuNSAxMi41LDE5IDE2LDE1LjUgMTkuNSIvPjxwYXRoIGQ9Ik0xMiAzLjlWNi44MUE2IDYgMCAwIDAgMTggMTJhNi41IDYuNSAwIDAgMSAxLjU4IDQuMzZhOSA5IDAgMCAxLTIuNjIgMi42MmE2LjU2IDYuNTYgMCAwIDEtNC4zNiAxLjU4SDYuODJBNiA2IDAgMCAwIDQgMTJhNi41IDYuNSAwIDAgMS0xLjU4LTQuMzYgOSA5IDAgMCAxIDIuNjItMi42Mkw1LjQ0IDcuODQiLz48L3N2Zz4="; }} // Fallback on error
              />
            )}
          </div>

          {/* Page Number */}
          <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-md font-semibold">
            {index + 1}
          </div>

          {/* Delete Mode Checkbox & Icon */}
          {isDeleteMode && (
            <label 
              className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 z-10
                         ${isSelected ? 'bg-teal-500 text-white' : 'bg-white/20 text-gray-300 group-hover:bg-white/30'}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={toggleSelection}
                className="hidden" // Hide native checkbox
              />
              {isSelected ? <CheckCircle size={18} /> : <XCircle size={18} />} {/* Icon changes based on selection */}
            </label>
          )}

          {/* Drag Handle Icon (Visible on hover if not in delete mode) */}
          {!isDeleteMode && (
            <div className={`absolute top-2 left-2 p-1.5 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 
                             transition-opacity cursor-move z-10 ${snapshot.isDragging ? 'opacity-100' : ''}`}>
              <GripVertical className="w-4 h-4 text-white/90" />
            </div>
          )}

        </div>
      )}
    </Draggable>
  );
};

export default PDFPagePreview;