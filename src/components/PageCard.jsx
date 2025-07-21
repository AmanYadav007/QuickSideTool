import React, { memo } from 'react';
import { Trash2, GripVertical, Check, Plus } from 'lucide-react';

const PageCard = memo(({
  page,
  index,
  draggedItem,
  dragOverIndex,
  replaceLoading,
  contextMenu,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDragLeave,
  handleContextMenu,
  handleRemovePage,
  handleInsertPage,
  togglePageSelection,
  isSelected,
  isFirstPage,
  isLastPage,
  totalPages,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, index)}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => handleDragOver(e, index)}
      onDragLeave={handleDragLeave}
      onContextMenu={(e) => handleContextMenu(e, page, index)}
      className={`
        relative group rounded-lg overflow-hidden bg-white/5 border border-white/10
        transition-all duration-300 ease-in-out transform
        hover:shadow-lg hover:scale-[1.02] hover:border-blue-400 cursor-grab
        ${draggedItem === index ? 'opacity-50 scale-[0.98] shadow-xl' : ''}
        ${replaceLoading && contextMenu?.pageIndex === index ? 'opacity-50 animate-pulse' : ''}
        ${dragOverIndex === index && draggedItem !== index ? 'border-4 border-blue-500 ring-4 ring-blue-500/50' : ''}
        ${isSelected ? 'border-2 border-blue-400 ring-2 ring-blue-400/50 bg-blue-400/10' : ''}
        ${page.animateIn ? 'animate-fade-in-up scale-95' : ''}
        ${page.animateOut ? 'animate-fade-out scale-90 opacity-0' : ''}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/50 pointer-events-none z-10" />

      {/* Enhanced Selection checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          togglePageSelection(index);
        }}
        className={`
          absolute top-2 left-2 w-7 h-7 rounded-full border-3 transition-all duration-300 z-20
          flex items-center justify-center shadow-lg
          ${isSelected 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400 text-white scale-110 shadow-blue-500/50' 
            : 'bg-white/30 border-white/60 text-transparent hover:bg-white/40 hover:border-white/80 hover:scale-105 shadow-white/20'
          }
        `}
        title={isSelected ? "Deselect page" : "Select page"}
        aria-label={isSelected ? "Deselect page" : "Select page"}
        style={{
          boxShadow: isSelected ? '0 0 15px rgba(59, 130, 246, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}
      >
        {isSelected && <Check className="w-4 h-4 font-bold" strokeWidth={3} />}
      </button>

      <div className="absolute top-2 left-10 p-1.5 bg-black/40
        rounded-full opacity-0 group-hover:opacity-100 group-active:opacity-100
        transition-opacity cursor-move z-20"
      >
        <GripVertical className="w-4 h-4 text-white/90" />
      </div>

      <img
        src={page.preview}
        alt={`Page ${index + 1}`}
        className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
        style={{
          transform: page.rotation ? `rotate(${page.rotation}deg)` : 'none'
        }}
      />



      {/* Enhanced Insert button */}
      <button
        className="absolute top-2 right-10 w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center shadow-lg hover:scale-110 z-20"
        onClick={() => handleInsertPage(index)}
        title="Insert pages after this page"
        aria-label="Insert pages after this page"
        style={{
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}
      >
        <Plus className="w-4 h-4 font-bold" strokeWidth={2.5} />
      </button>

      {/* Enhanced Remove button */}
      <button
        className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center shadow-lg hover:scale-110 z-20"
        onClick={() => handleRemovePage(index)}
        title="Remove page"
        aria-label="Remove page"
        style={{
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}
      >
        <Trash2 className="w-4 h-4 font-bold" strokeWidth={2.5} />
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-xs font-medium text-center z-10">
        Page {index + 1}
      </div>
    </div>
  );
});

export default PageCard;