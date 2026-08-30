import React, { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, FileText, ImageIcon, X } from 'lucide-react';

const PDF_ACTIONS = [
  { title: 'Compress', to: '/pdf-compressor' },
  { title: 'Organise & merge', to: '/pdf-tool' },
  { title: 'Unlock', to: '/unlock-pdf' },
  { title: 'PDF → Word', to: '/pdf-to-word' },
];

const IMAGE_ACTIONS = [
  { title: 'Resize', to: '/image-tools/resize' },
  { title: 'Compress', to: '/image-tools/compress' },
  { title: 'Convert', to: '/image-tools/convert' },
];

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const UploadZone = () => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleFiles = useCallback((files) => {
    if (files && files[0]) setFile(files[0]);
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      setDragging(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles]
  );

  const isPdf = file?.type === 'application/pdf';
  const actions = isPdf ? PDF_ACTIONS : IMAGE_ACTIONS;

  return (
    <div className="mx-auto w-full max-w-2xl">
      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
          role="button"
          tabIndex={0}
          aria-label="Choose or drop a file"
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-7 text-center transition-all duration-200 md:py-9 ${
            dragging
              ? 'border-primaryHover bg-primary/10 shadow-glow'
              : 'border-border bg-card/70 hover:border-primary/60 hover:bg-card'
          }`}
        >
          <UploadCloud className="h-8 w-8 text-primaryHover" aria-hidden="true" />
          <p className="text-base font-semibold text-text md:text-lg">
            Drop your file here
          </p>
          <p className="text-sm text-secondary">or choose a tool below</p>
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept="application/pdf,image/*"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-4 text-left md:p-5">
          <div className="flex items-start gap-3">
            {isPdf ? (
              <FileText className="mt-0.5 h-6 w-6 shrink-0 text-primaryHover" aria-hidden="true" />
            ) : (
              <ImageIcon className="mt-0.5 h-6 w-6 shrink-0 text-primaryHover" aria-hidden="true" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text">{file.name}</p>
              <p className="mt-0.5 text-xs text-secondary">{formatSize(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              aria-label="Remove file"
              className="rounded-md p-1 text-secondary transition hover:bg-border hover:text-text"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-secondary">
            What do you want to do?
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {actions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-primaryHover hover:scale-[1.02]"
              >
                {action.title}
              </Link>
            ))}
          </div>
          <p className="mt-3 text-xs text-secondary">
            Your file stays on this device — re-select it on the tool page to start.
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
