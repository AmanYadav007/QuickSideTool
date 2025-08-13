import React, { memo } from 'react';
import { Trash2, GripVertical, Plus } from 'lucide-react';

const PageCard = memo(({
  page,
  index,
  draggedItem,
  dragOverIndex, // New prop for visual feedback
  replaceLoading,
  contextMenu,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDragLeave, // New handler
  handleContextMenu,
  handleRemovePage,
  showInsertButtons = false,
  isFirst = false,
  onInsertBefore,
  onInsertAfter,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, index)}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => handleDragOver(e, index)}
      onDragLeave={handleDragLeave} // Attach new handler
      onContextMenu={(e) => handleContextMenu(e, page, index)}
      className={`
        relative group rounded-lg overflow-hidden bg-white/5 border border-white/10
        transition-all duration-200 ease-in-out transform
        hover:shadow-lg hover:scale-[1.02] hover:border-blue-400 cursor-grab
        ${draggedItem === index ? 'opacity-50 scale-[0.98] shadow-xl' : ''}
        ${replaceLoading && contextMenu?.pageIndex === index ? 'opacity-50 animate-pulse' : ''}
        ${dragOverIndex === index && draggedItem !== index ? 'border-4 border-blue-500 ring-4 ring-blue-500/50' : ''}
      `}
    >
      <div className="relative w-full aspect-[3/4]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/50 pointer-events-none z-10" />

        <div className="absolute top-2 left-2 p-1.5 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity cursor-move z-20">
          <GripVertical className="w-4 h-4 text-white/90" />
        </div>

        <img
          src={page.preview}
          alt={`Page ${index + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {showInsertButtons && isFirst && (
          <button
            type="button"
            className="absolute left-[-14px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center z-30"
            onClick={(e) => {
              e.stopPropagation();
              onInsertBefore && onInsertBefore(index);
            }}
            title="Insert before"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}

        {showInsertButtons && (
          <button
            type="button"
            className="absolute right-[-14px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center z-30"
            onClick={(e) => {
              e.stopPropagation();
              onInsertAfter && onInsertAfter(index);
            }}
            title="Insert after"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}

        <button
          className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center shadow-sm hover:bg-red-700 z-20"
          onClick={() => handleRemovePage(index)}
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-xs font-medium text-center z-10">
          Page {index + 1}
        </div>
      </div>
    </div>
  );
});

export default PageCard;