import React, { useState, useCallback } from 'react';
import SEO from './SEO';
import BackButton from './BackButton';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, Image as ImageIcon, Trash2, X, Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { compressImage as compressInWorker } from '../utils/imageWorker';
import { formatFileSize } from '../constants/api';

const EXTENSIONS = { 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/png': 'png' };

const mapWithConcurrency = async (items, limit, task) => {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await task(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
};

const ImageCompressor = () => {
  const [images, setImages] = useState([]);
  const [quality, setQuality] = useState(70);
  const [compressing, setCompressing] = useState(false);
  const [outputFormat, setOutputFormat] = useState('image/jpeg');
  // 'quality' (slider) or 'target' (keep each file under targetKb)
  const [mode, setMode] = useState('quality');
  // Kept as typed so the field can be cleared and retyped; parsed when compressing
  const [targetKb, setTargetKb] = useState('100');
  const targetKbValue = parseFloat(targetKb);
  const targetValid = targetKbValue >= 1;

  const onDrop = useCallback((acceptedFiles) => {
    const newImagesPromises = acceptedFiles.map(file => {
      return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
          resolve({
            original: file,
            originalUrl: objectUrl,
            compressed: null,
            compressedUrl: null,
            error: null,
            dimensions: { width: img.width, height: img.height }
          });
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          console.error("Failed to load image for preview:", file.name);
          resolve(null);
        };
        img.src = objectUrl;
      });
    });

    Promise.all(newImagesPromises).then(resolvedImages => {
      const validImages = resolvedImages.filter(img => img !== null);
      setImages(prev => [...prev, ...validImages]);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] }
  });

  // Fallback for browsers that can't run the worker (Safari < 16.4)
  const compressInPage = async (imageFile, compressionQuality, format) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          // JPEG has no transparency: without a background, clear pixels turn black
          if (format === 'image/jpeg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, img.width, img.height);
          }
          ctx.drawImage(img, 0, 0, img.width, img.height);

          let outputMimeType = format;
          let outputQuality = compressionQuality / 100;
          let fileExtension = outputMimeType.split('/')[1] || 'jpeg';

          if (outputMimeType === 'image/png') fileExtension = 'png';
          if (!['image/jpeg', 'image/png', 'image/webp'].includes(imageFile.type) && format === 'original') {
            outputMimeType = 'image/jpeg';
            fileExtension = 'jpeg';
          }
          if (imageFile.type === 'image/gif' && format === 'original') {
            outputMimeType = 'image/png';
            fileExtension = 'png';
          }

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const originalFileNameWithoutExt = imageFile.name.split('.').slice(0, -1).join('.');
                const payload =
                  blob.size >= imageFile.size && outputMimeType === imageFile.type
                    ? imageFile
                    : blob;
                resolve(new File([payload], `${originalFileNameWithoutExt}_compressed.${fileExtension}`, {
                  type: outputMimeType,
                  lastModified: Date.now()
                }));
              } else {
                reject(new Error("Failed to create blob from canvas."));
              }
            },
            outputMimeType,
            outputQuality
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const compressImages = async () => {
    if (images.length === 0) {
      alert('Please add images to compress.');
      return;
    }
    setCompressing(true);
    try {
      const compressedResults = await mapWithConcurrency(images, 4, async (img) => {
        try {
          const options = {
            type: outputFormat,
            quality: quality / 100,
            targetBytes: mode === 'target' && outputFormat !== 'image/png' ? targetKbValue * 1024 : undefined,
          };
          let result;
          try {
            result = await compressInWorker(img.original, options);
          } catch (error) {
            if (error.code !== 'engine-unavailable') throw error;
            if (options.targetBytes) {
              throw new Error('Max file size needs a newer browser. Use the quality slider instead.');
            }
            result = { blob: await compressInPage(img.original, quality, outputFormat), ...img.dimensions };
          }

          const base = img.original.name.replace(/\.[^.]+$/, '');
          const compressedFile = new File([result.blob], `${base}_compressed.${EXTENSIONS[result.blob.type] || 'jpg'}`, {
            type: result.blob.type,
            lastModified: Date.now(),
          });
          if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
          return {
            ...img,
            compressed: compressedFile,
            compressedUrl: URL.createObjectURL(compressedFile),
            info: { ...result, blob: undefined, targetKb: options.targetBytes ? targetKbValue : null },
            error: null,
          };
        } catch (error) {
          console.error(`Error compressing image ${img.original.name}:`, error);
          return { ...img, compressed: null, compressedUrl: null, info: null, error: error.message };
        }
      });
      setImages(compressedResults);
    } catch (error) {
      console.error('An unexpected error occurred during batch compression:', error);
      alert('An unexpected error occurred during batch compression. Check console for details.');
    } finally {
      setCompressing(false);
    }
  };

  const downloadCompressedImage = useCallback((compressedImage) => {
    if (!compressedImage) {
      alert('Image not compressed yet.');
      return;
    }
    const link = document.createElement('a');
    const href = URL.createObjectURL(compressedImage);
    link.href = href;
    link.download = compressedImage.name;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => URL.revokeObjectURL(href), 10000);
  }, []);

  const downloadAllCompressedImages = async () => {
    if (images.length === 0) {
      alert('No images to download.');
      return;
    }
    const compressedImagesReady = images.filter(img => img.compressed);
    if (compressedImagesReady.length === 0) {
      alert('No images have been compressed yet.');
      return;
    }

    if (compressedImagesReady.length === 1) {
      downloadCompressedImage(compressedImagesReady[0].compressed);
      return;
    }

    const zip = new JSZip();
    const usedNames = new Set();
    compressedImagesReady.forEach((img) => {
      let name = img.compressed.name;
      if (usedNames.has(name)) {
        const dot = name.lastIndexOf('.');
        const stem = dot === -1 ? name : name.slice(0, dot);
        const ext = dot === -1 ? '' : name.slice(dot);
        let n = 2;
        while (usedNames.has(`${stem} (${n})${ext}`)) n += 1;
        name = `${stem} (${n})${ext}`;
      }
      usedNames.add(name);
      zip.file(name, img.compressed);
    });

    try {
      // Images are already compressed; deflating them again costs time and saves ~0%
      const content = await zip.generateAsync({ type: "blob", compression: "STORE" });
      const link = document.createElement('a');
      const href = URL.createObjectURL(content);
      link.href = href;
      link.download = "compressed_images.zip";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => URL.revokeObjectURL(href), 10000);
    } catch (error) {
      console.error("Error generating zip:", error);
      alert("Failed to generate zip file. Please try again.");
    }
  };

  const removeImage = useCallback((indexToRemove) => {
    setImages(prevImages => {
      const target = prevImages[indexToRemove];
      if (target?.originalUrl) URL.revokeObjectURL(target.originalUrl);
      if (target?.compressedUrl) URL.revokeObjectURL(target.compressedUrl);
      return prevImages.filter((_, index) => index !== indexToRemove);
    });
  }, []);

  const clearAllImages = () => {
    images.forEach(img => {
      if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
      if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
    });
    setImages([]);
    setQuality(70);
    setOutputFormat('image/jpeg');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SEO
        title="Compress Image Online – JPG/PNG/WebP to Smaller Size"
        description="Reduce image size without big quality loss. Drag & drop. Free and fast."
        url="/image-tools/compress"
      />
      <div className="container section">
        <header className="mb-8 flex items-start justify-between gap-3">
          <BackButton />
          <h1 className="h2 text-center">Image Compressor</h1>
          <button
            onClick={clearAllImages}
            disabled={images.length === 0 || compressing}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-error)] hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear all loaded images"
          >
            <X className="h-4 w-4" /> Clear All
          </button>
        </header>

        <div className="max-w-4xl mx-auto">
          <div {...getRootProps()} className="upload-zone p-10 text-center mb-8 cursor-pointer transition-colors border-2 border-dashed rounded-3xl">
            <input {...getInputProps()} disabled={compressing} />
            <Upload className="mx-auto mb-4 w-12 h-12 text-[var(--color-primary)]" />
            <p className="text-lg font-semibold text-[var(--color-text)] mb-2">
              {isDragActive ? "Drop the image(s) here!" : "Drag & drop images here, or click to select"}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">(Supports PNG, JPG, JPEG, WebP, GIF formats)</p>
          </div>

          {images.length > 0 && (
            <div className="card p-6">
              <div className="mb-6 p-4 rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary-light)]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[var(--color-text)]">{images.length} image{images.length > 1 ? 's' : ''} ready to compress</p>
                    <p className="text-sm text-[var(--color-text-muted)]">Compression runs in your browser - files stay private.</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)]">
                <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Compression Settings</h2>
                
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div role="radiogroup" aria-label="Compress by" className="inline-flex rounded-full border border-[var(--color-border)] p-0.5">
                      {[['quality', 'Quality'], ['target', 'Max file size']].map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          role="radio"
                          aria-checked={mode === id}
                          onClick={() => setMode(id)}
                          disabled={compressing}
                          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                            mode === id
                              ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)]">
                      Format
                      <select
                        value={outputFormat}
                        onChange={(e) => setOutputFormat(e.target.value)}
                        className="input !w-auto py-2"
                        disabled={compressing}
                      >
                        <option value="image/jpeg">JPEG</option>
                        <option value="image/webp">WebP (smaller)</option>
                        <option value="image/png">PNG (lossless)</option>
                      </select>
                    </label>
                  </div>

                  {mode === 'quality' ? (
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-[var(--color-text-muted)] whitespace-nowrap">
                        Quality: {outputFormat === 'image/png' ? 'n/a (lossless)' : `${quality}%`}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full max-w-md h-2 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer"
                        disabled={compressing || outputFormat === 'image/png'}
                        title={outputFormat === 'image/png' ? 'PNG is lossless' : `Compression Quality: ${quality}%`}
                      />
                    </div>
                  ) : outputFormat === 'image/png' ? (
                    <p className="text-sm text-[var(--color-text-muted)]">
                      PNG is lossless, so its size can't be targeted. Choose JPEG or WebP for a size limit.
                    </p>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <label htmlFor="target-kb" className="text-sm font-medium text-[var(--color-text-muted)]">
                        Keep each image under
                      </label>
                      <input
                        id="target-kb"
                        type="number"
                        min="1"
                        step="any"
                        value={targetKb}
                        onChange={(e) => setTargetKb(e.target.value)}
                        aria-invalid={!targetValid}
                        className="input !w-24 py-2"
                        disabled={compressing}
                      />
                      <span className="text-sm text-[var(--color-text-muted)]">KB</span>
                      <span className="w-full text-xs text-[var(--color-text-light)]">
                        Picks the best quality that fits; shrinks the image only if it has to. Handy for forms that ask for "under 50 KB".
                      </span>
                    </div>
                  )}

                  {outputFormat === 'image/webp' && (
                    <p className="text-xs text-[var(--color-text-light)]">
                      WebP files are about 30% smaller than JPEG at the same quality. A few older upload forms only accept JPEG.
                    </p>
                  )}

                  <button
                    onClick={compressImages}
                    className="btn-primary w-full md:w-auto md:self-start"
                    disabled={compressing || images.length === 0 || (mode === 'target' && (outputFormat === 'image/png' || !targetValid))}
                  >
                    {compressing ? (
                      <> <Loader2 className="h-4 w-4 animate-spin mr-2" /> Compressing... </>
                    ) : (
                      'Compress Images'
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div key={index} className={`card p-4 ${img.error ? 'border-[var(--color-error)]' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-[var(--color-text)] truncate pr-8" title={img.original.name}>
                        {img.original.name}
                      </h3>
                      <button
                        onClick={() => removeImage(index)}
                        disabled={compressing}
                        className="p-1 text-[var(--color-text-light)] hover:text-[var(--color-error)] rounded-lg hover:bg-[var(--color-error-bg)] transition-colors disabled:opacity-50"
                        title="Remove image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-[var(--color-text-muted)] mb-1">Original ({img.dimensions.width}x{img.dimensions.height})</p>
                        <div className="relative aspect-square bg-[var(--color-bg-alt)] rounded-lg overflow-hidden flex items-center justify-center border border-[var(--color-border)]">
                          <img 
                            src={img.originalUrl}
                            alt="Original" 
                            className="object-contain max-w-full max-h-full h-32 w-full"
                          />
                          <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                            {formatFileSize(img.original.size)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--color-text-muted)] mb-1">Compressed</p>
                        <div className="relative aspect-square bg-[var(--color-bg-alt)] rounded-lg overflow-hidden flex items-center justify-center border border-[var(--color-border)]">
                          {img.compressed ? (
                            <img 
                              src={img.compressedUrl}
                              alt="Compressed" 
                              className="object-contain max-w-full max-h-full h-32 w-full"
                            />
                          ) : (
                            <div className="w-full h-32 flex items-center justify-center">
                              <ImageIcon className="w-12 h-12 text-[var(--color-text-light)]" />
                            </div>
                          )}
                          {img.compressed && (
                            <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                              {formatFileSize(img.compressed.size)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {img.compressed && (
                      <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                        <div>
                          <p className="text-sm text-[var(--color-text-muted)]">Reduction</p>
                          <p className="text-lg font-semibold text-[var(--color-success)]">
                            {((1 - img.compressed.size / img.original.size) * 100).toFixed(0)}%
                          </p>
                        </div>
                        <button 
                          onClick={() => downloadCompressedImage(img.compressed)}
                          className="btn-primary text-sm py-2 px-4"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </button>
                      </div>
                    )}
                    {img.info && (
                      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                        {img.info.unchanged
                          ? 'Already well compressed, so the original was kept.'
                          : [
                              img.info.targetKb && !img.info.fits && `Couldn't get under ${img.info.targetKb} KB; this is the smallest version.`,
                              img.info.targetKb && img.info.quality != null && `Quality ${Math.round(img.info.quality * 100)}%`,
                              img.info.scaled && `resized to ${img.info.width}×${img.info.height}`,
                            ]
                              .filter(Boolean)
                              .join(', ')}
                      </p>
                    )}
                    {img.error && (
                      <p className="mt-3 text-sm text-[var(--color-error)]">{img.error}</p>
                    )}
                  </div>
                ))}
              </div>

              {images.some(img => img.compressed) && (
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    onClick={downloadAllCompressedImages}
                    disabled={!images.some(img => img.compressed)}
                    className="btn-secondary"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download All as ZIP
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCompressor;