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
        relative group rounded-xl overflow-hidden bg-[var(--color-bg-card)] border border-[var(--color-border)]
        transition-all duration-200 ease-in-out
        hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-hover)] cursor-grab active:cursor-grabbing
        ${draggedItem === index ? 'opacity-40' : ''}
        ${replaceLoading && contextMenu?.pageIndex === index ? 'opacity-50 animate-pulse' : ''}
        ${dragOverIndex === index && draggedItem !== index ? 'ring-2 ring-[var(--color-primary)]' : ''}
      `}
    >
      <div className="relative w-full aspect-[3/4] bg-[var(--color-bg)]">
        <div className="absolute top-2 left-2 p-1.5 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity cursor-move z-20">
          <GripVertical className="w-4 h-4 text-white/90" />
        </div>

        <img
          src={page.preview}
          alt={`Page ${index + 1}`}
          className="absolute inset-0 w-full h-full object-contain"
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
          className="absolute top-2 right-2 w-8 h-8 bg-[var(--color-error)] text-white rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 flex items-center justify-center shadow-md hover:brightness-110 z-20"
          onClick={() => handleRemovePage(index)}
          aria-label={`Remove page ${index + 1}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 py-1.5 bg-black/70 text-white text-xs font-semibold text-center z-10">
          {index + 1}
        </div>
      </div>
    </div>
  );
});

export default PageCard;