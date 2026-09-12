import React, { useCallback, useEffect, useRef, useState } from "react";
import SEO from "./SEO";
import { Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import {
  ArrowLeft,
  CheckCircle,
  Download,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";

const outputFormats = [
  { label: "JPEG", value: "image/jpeg", extension: "jpg", supportsQuality: true },
  { label: "PNG", value: "image/png", extension: "png", supportsQuality: false },
  { label: "WebP", value: "image/webp", extension: "webp", supportsQuality: true },
];

const ImageFormatConverter = () => {
  const [images, setImages] = useState([]);
  const [outputFormat, setOutputFormat] = useState("image/webp");
  const [quality, setQuality] = useState(90);
  const [isConverting, setIsConverting] = useState(false);

  const selectedFormat = outputFormats.find((format) => format.value === outputFormat) || outputFormats[0];

  const imagesRef = useRef(images);
  imagesRef.current = images;
  useEffect(
    () => () => {
      imagesRef.current.forEach((image) => {
        if (image?.previewUrl) URL.revokeObjectURL(image.previewUrl);
      });
    },
    []
  );

  const onDrop = useCallback((acceptedFiles) => {
    const nextImages = acceptedFiles.map((file) => ({
      original: file,
      converted: null,
      error: "",
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((current) => [...current, ...nextImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".bmp"] },
    multiple: true,
    disabled: isConverting,
  });

  const convertAll = async () => {
    if (images.length === 0) {
      alert("Please add images to convert.");
      return;
    }

    setIsConverting(true);
    const label = selectedFormat.label;
    const converted = await mapWithConcurrency(images, 4, async (image) => {
      try {
        const convertedFile = await convertImage(image.original, selectedFormat, quality);
        return { ...image, converted: convertedFile, convertedLabel: label, error: "" };
      } catch (error) {
        return { ...image, converted: null, convertedLabel: "", error: error.message };
      }
    });
    setImages(converted);
    setIsConverting(false);
  };

  const clearAll = () => {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setImages([]);
  };

  const removeImage = (index) => {
    setImages((current) => {
      const image = current[index];
      if (image?.previewUrl) URL.revokeObjectURL(image.previewUrl);
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const downloadOne = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    triggerDownload(url, file.name);
    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    const convertedImages = images.filter((image) => image.converted);
    if (convertedImages.length === 0) {
      alert("Convert images first.");
      return;
    }

    if (convertedImages.length === 1) {
      downloadOne(convertedImages[0].converted);
      return;
    }

    const zip = new JSZip();
    const usedNames = new Set();
    convertedImages.forEach((image) => {
      let name = image.converted.name;
      if (usedNames.has(name)) {
        const dot = name.lastIndexOf(".");
        const stem = dot === -1 ? name : name.slice(0, dot);
        const ext = dot === -1 ? "" : name.slice(dot);
        let n = 2;
        while (usedNames.has(`${stem} (${n})${ext}`)) n += 1;
        name = `${stem} (${n})${ext}`;
      }
      usedNames.add(name);
      zip.file(name, image.converted);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "converted_images.zip");
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SEO
        title="Free Image Format Converter - JPG, PNG, WebP"
        description="Convert images between JPG, PNG, and WebP in your browser. Batch conversion supported."
        url="https://quicksidetool.com/image-tools/convert"
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
          <h1 className="h1 text-center">Image Format Converter</h1>
          <button
            onClick={clearAll}
            disabled={images.length === 0 || isConverting}
            className="inline-flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-4 w-4" />
            Clear All
          </button>
        </header>

        <div className="max-w-4xl mx-auto">
          <div {...getRootProps()} className="upload-zone p-10 text-center mb-8 cursor-pointer transition-colors border-2 border-dashed rounded-3xl">
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-3 h-10 w-10 text-[var(--color-primary)]" />
            <p className="text-lg font-semibold text-[var(--color-text)]">
              {isDragActive ? "Drop images here" : "Drag images here, or click to select"}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">Supports JPG, PNG, WebP, and BMP.</p>
          </div>

          <div className="card p-6 mb-8">
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]">Convert to</span>
                <select
                  value={outputFormat}
                  onChange={(event) => setOutputFormat(event.target.value)}
                  disabled={isConverting}
                  className="input"
                >
                  {outputFormats.map((format) => (
                    <option key={format.value} value={format.value}>{format.label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]">
                  Quality: {quality}% {selectedFormat.supportsQuality ? '' : '(PNG is lossless)'}
                </span>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(event) => setQuality(Number(event.target.value))}
                  disabled={isConverting || !selectedFormat.supportsQuality}
                  className="w-full"
                />
              </label>

              <button
                onClick={convertAll}
                disabled={images.length === 0 || isConverting}
                className="btn-primary w-full md:w-auto"
              >
                {isConverting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Convert
              </button>

              <button
                onClick={downloadAll}
                disabled={images.length === 0 || !images.some((image) => image.converted)}
                className="btn-primary w-full md:w-auto bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {images.map((image, index) => (
                <article key={`${image.original.name}-${index}`} className="card p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold text-[var(--color-text)]" title={image.original.name}>{image.original.name}</h2>
                      <p className="mt-1 text-xs text-[var(--color-text-muted)]">{(image.original.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={() => removeImage(index)}
                      disabled={isConverting}
                      className="text-[var(--color-text-light)] hover:text-red-500 transition-colors disabled:opacity-50"
                      aria-label={`Remove ${image.original.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="aspect-square flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-alt)] mb-4">
                    <img src={image.previewUrl} alt={image.original.name} className="max-h-full max-w-full object-contain p-2" />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    {image.converted ? (
                      <p className="inline-flex items-center gap-2 text-sm text-green-500">
                        <CheckCircle className="h-4 w-4" />
                        Converted to {image.convertedLabel || selectedFormat.label}
                      </p>
                    ) : image.error ? (
                      <p className="text-sm text-red-500">{image.error}</p>
                    ) : (
                      <p className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                        <ImageIcon className="h-4 w-4" />
                        Waiting
                      </p>
                    )}

                    <button
                      onClick={() => downloadOne(image.converted)}
                      disabled={!image.converted}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      Save
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const convertImage = (file, outputFormat, quality) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const sourceUrl = URL.createObjectURL(file);

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      if (outputFormat.value === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context.drawImage(image, 0, 0);
      URL.revokeObjectURL(sourceUrl);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not convert this image."));
            return;
          }
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          resolve(
            new File([blob], `${baseName}.${outputFormat.extension}`, {
              type: outputFormat.value,
              lastModified: Date.now(),
            })
          );
        },
        outputFormat.value,
        outputFormat.supportsQuality ? quality / 100 : undefined
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(sourceUrl);
      reject(new Error("Could not load this image."));
    };

    image.src = sourceUrl;
  });
};

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

const triggerDownload = (href, filename) => {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default ImageFormatConverter;