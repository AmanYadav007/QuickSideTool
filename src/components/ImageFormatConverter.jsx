import React, { useCallback, useState } from "react";
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
    const converted = await Promise.all(
      images.map(async (image) => {
        try {
          const convertedFile = await convertImage(image.original, selectedFormat, quality);
          return { ...image, converted: convertedFile, error: "" };
        } catch (error) {
          return { ...image, converted: null, error: error.message };
        }
      })
    );
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
    convertedImages.forEach((image) => zip.file(image.converted.name, image.converted));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "converted_images.zip");
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08111f] via-[#0b1f2a] to-[#102f2e] text-white">
      <SEO
        title="Free Image Format Converter - JPG, PNG, WebP"
        description="Convert images between JPG, PNG, and WebP in your browser. Batch conversion supported."
        url="https://quicksidetool.com/image-tools/convert"
      />

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 md:px-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link
            to="/image-tools"
            className="inline-flex items-center rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm text-white transition hover:border-amber-200 hover:bg-white/15"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
          <h1 className="text-center text-2xl font-bold text-amber-100 md:text-3xl">
            Image Format Converter
          </h1>
          <button
            onClick={clearAll}
            disabled={images.length === 0 || isConverting}
            className="inline-flex items-center rounded-lg bg-red-600/80 px-3 py-2 text-sm text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </button>
        </header>

        <main className="flex-1">
          <section
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition ${
              isDragActive
                ? "border-amber-200 bg-amber-200/10"
                : "border-white/20 bg-white/[0.04] hover:border-amber-200 hover:bg-amber-200/10"
            } ${isConverting ? "pointer-events-none opacity-70" : ""}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-3 h-10 w-10 text-amber-100" />
            <p className="text-lg font-semibold text-white">
              {isDragActive ? "Drop images here" : "Drag images here, or click to select"}
            </p>
            <p className="mt-1 text-sm text-slate-400">Supports JPG, PNG, WebP, and BMP.</p>
          </section>

          <section className="mt-6 rounded-lg border border-white/10 bg-[#0b1f2a]/85 p-5">
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Convert to</span>
                <select
                  value={outputFormat}
                  onChange={(event) => setOutputFormat(event.target.value)}
                  disabled={isConverting}
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  {outputFormats.map((format) => (
                    <option key={format.value} value={format.value}>{format.label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Quality: {quality}%</span>
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
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-300 px-5 py-2 font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isConverting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Convert
              </button>

              <button
                onClick={downloadAll}
                disabled={images.length === 0 || !images.some((image) => image.converted)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 py-2 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </section>

          {images.length > 0 && (
            <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {images.map((image, index) => (
                <article key={`${image.original.name}-${index}`} className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold text-white" title={image.original.name}>{image.original.name}</h2>
                      <p className="mt-1 text-xs text-slate-400">{(image.original.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={() => removeImage(index)}
                      disabled={isConverting}
                      className="text-red-300 transition hover:text-red-200 disabled:opacity-50"
                      aria-label={`Remove ${image.original.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex h-44 items-center justify-center rounded-lg border border-white/10 bg-slate-950/60">
                    <img src={image.previewUrl} alt={image.original.name} className="max-h-full max-w-full object-contain" />
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    {image.converted ? (
                      <p className="inline-flex items-center gap-2 text-sm text-emerald-200">
                        <CheckCircle className="h-4 w-4" />
                        Converted to {selectedFormat.label}
                      </p>
                    ) : image.error ? (
                      <p className="text-sm text-red-200">{image.error}</p>
                    ) : (
                      <p className="inline-flex items-center gap-2 text-sm text-slate-400">
                        <ImageIcon className="h-4 w-4" />
                        Waiting
                      </p>
                    )}

                    <button
                      onClick={() => downloadOne(image.converted)}
                      disabled={!image.converted}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white transition hover:border-amber-200 hover:bg-amber-200/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </main>
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

const triggerDownload = (href, filename) => {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default ImageFormatConverter;
