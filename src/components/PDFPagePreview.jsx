import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Document, Page, pdfjs } from 'react-pdf';
import { CheckCircle, XCircle, Loader2, GripVertical, Trash2 } from 'lucide-react';

// Configure react-pdf worker, if not already done globally
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


const PDFPagePreview = ({
  page, // This 'page' object now has { file, type, pageIndex, previewBlob, previewUrl, dimensions }
  index,
  isDeleteMode,
  isSelected,
  toggleSelection,
  onContextMenu, // Added to props
  handleRemovePage, // Added to props
}) => {
  const isPdfPage = page.type === 'pdf';

  return (
    // Draggable expects a string draggableId that is unique within the Droppable
    <Draggable draggableId={page.previewUrl} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps} // Applies dnd's draggable props (style, transform, etc.)
          {...provided.dragHandleProps} // Applies dnd's drag handle props (event listeners)
          // The className and style attributes are applied directly to this div
          className={`
            relative group rounded-lg overflow-hidden bg-white/5 backdrop-blur-md shadow-lg border border-white/10
            transition-all duration-200 ease-in-out select-none
            ${isSelected ? 'border-teal-400 ring-2 ring-teal-400 scale-[1.02] shadow-xl' : 'hover:scale-[1.02] hover:shadow-xl hover:border-blue-400'}
            ${snapshot.isDragging ? 'scale-[1.05] shadow-2xl-custom-drag border-blue-400 z-50 cursor-grabbing' : 'cursor-grab'}
            ${isDeleteMode && isSelected ? 'opacity-80' : ''}
          `}
          style={{
            width: '150px',
            height: '212px',
            ...provided.draggableProps.style, // Apply dnd's inline styles for positioning
          }}
          onContextMenu={(e) => onContextMenu(e, page, index)} // Pass down context menu handler
        >
          {/* Visual Container for the Page Content */}
          <div className="absolute inset-0 flex items-center justify-center p-1.5">
            {isPdfPage ? (
              // react-pdf Document and Page components
              <Document
                file={page.file} // Use page.file (the original File object) for Document
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
                src={page.previewUrl} // Use the stable previewUrl here
                alt={`Page ${index + 1}`}
                className="max-w-full max-h-full object-contain"
                onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5YmFiYWIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9ImZyb250IiBzdHJva2UtbGluZWpvaW49ImZyb250Ij48cGF0aCBkPSBNOC41IDcuNSwxMiA0LDE1LjUgNy41Ii8+PHBhdGggZD0iTTcuNSAxMi41LDRIDE2LDcuNSAxOS41Ii8+PHBhdGggZD0JNTE1LjUgMTIuNSwxOSAxNiwxNS41IDE5LjUiLz48cGF0aCBkPSJNMTIgMy45VjYuODFBNiA2IDAgMCAwIDE4IDEyYTYuNS02LjUgMCAwIDEgMS41OCA0LjM2YTkgOSAwIDAgMS0yLjYyIDIuNjJhNi41NiA2LjU2IDAgMCAxLTQuMzYgMS41OEg2LjgyQTYgNiAwIDAgMCA0IDEyYTYuNS02LjUgMCAwIDEtMS41OC00LjM2IDkgOSAwIDAgMSAyLjYyLTIuNjJMMTUuNDQgNy44NCIvPjwvc3ZnPg=="; }}
              />
            )}
          </div>

          {/* Page Number */}
          <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-md font-semibold">
            {index + 1}
          </div>

          {/* Delete Button (visible on hover) */}
          <button
            className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center shadow-sm hover:bg-red-700 z-20"
            onClick={() => handleRemovePage(index)} // Calls handler passed from App.js
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Drag Handle Icon (visual, dnd's dragHandleProps applies behavior to outer div) */}
          <div className={`absolute top-2 left-2 p-1.5 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 
                           transition-opacity cursor-move z-10 ${snapshot.isDragging ? 'opacity-100' : ''}`}>
             <GripVertical className="w-4 h-4 text-white/90" />
           </div>

           {/* Delete Mode Checkbox & Icon (if you re-implement selection logic) */}
           {/*
           {isDeleteMode && (
             <label
               className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 z-10
                           ${isSelected ? 'bg-teal-500 text-white' : 'bg-white/20 text-gray-300 group-hover:bg-white/30'}`}
             >
               <input
                 type="checkbox"
                 checked={isSelected}
                 onChange={toggleSelection}
                 className="hidden"
               />
               {isSelected ? <CheckCircle size={18} /> : <XCircle size={18} />}
             </label>
           )}
           */}

        </div>
      )}
    </Draggable>
  );
};

export default PDFPagePreview;