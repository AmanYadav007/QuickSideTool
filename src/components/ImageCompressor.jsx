import React, { useState, useCallback } from 'react';
import SEO from './SEO';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, Upload, Download, Image as ImageIcon, Trash2, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import JSZip from 'jszip';

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

  const compressImage = async (imageFile, compressionQuality, format) => {
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
          let compressedFile = await compressImage(img.original, quality, outputFormat);

          if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
          return {
            ...img,
            compressed: compressedFile,
            compressedUrl: URL.createObjectURL(compressedFile),
            error: null,
          };
        } catch (error) {
          console.error(`Error compressing image ${img.original.name}:`, error);
          return { ...img, compressed: null, compressedUrl: null, error: `Failed: ${error.message}` };
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
      const content = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 } });
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
        url="https://quicksidetool.com/image-tools/compress"
      />
      <div className="container section">
        <header className="mb-8 flex items-center justify-between">
          <Link
            to="/image-tools"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Image Tools
          </Link>
          <h1 className="h1 text-center">Image Compressor</h1>
          <button
            onClick={clearAllImages}
            disabled={images.length === 0 || compressing}
            className="inline-flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                
                <div className="flex flex-col md:flex-row gap-4 items-center md:items-center">
                  <div className="flex items-center gap-3 flex-1">
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

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-[var(--color-text-muted)] whitespace-nowrap">Format:</label>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      className="input sm:w-40"
                      disabled={compressing}
                    >
                      <option value="image/jpeg">JPEG</option>
                      <option value="image/png">PNG</option>
                      <option value="image/webp">WebP</option>
                    </select>
                  </div>

                  <button
                    onClick={compressImages}
                    className="btn-primary w-full md:w-auto"
                    disabled={compressing || images.length === 0}
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
                  <div key={index} className={`card p-4 ${img.error ? 'border-red-500/50' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-[var(--color-text)] truncate pr-8" title={img.original.name}>
                        {img.original.name}
                      </h3>
                      <button
                        onClick={() => removeImage(index)}
                        disabled={compressing}
                        className="p-1 text-[var(--color-text-light)] hover:text-red-500 rounded-lg hover:bg-[var(--color-error)]/10 transition-colors disabled:opacity-50"
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
                            {(img.original.size / (1024 * 1024)).toFixed(2)} MB
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
                              {(img.compressed.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {img.compressed && (
                      <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                        <div>
                          <p className="text-sm text-[var(--color-text-muted)]">Reduction</p>
                          <p className="text-lg font-semibold text-green-500">
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
                    {img.error && (
                      <p className="mt-3 text-sm text-red-500">Error: {img.error}</p>
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