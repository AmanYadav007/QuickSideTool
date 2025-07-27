import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, Upload, Download, Image as ImageIcon, Trash2, X, Loader2, FileImage, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import JSZip from 'jszip';
import logger from '../utils/logger';

const ImageConverter = () => {
  const [images, setImages] = useState([]);
  const [outputFormat, setOutputFormat] = useState('image/jpeg');
  const [quality, setQuality] = useState(90);
  const [converting, setConverting] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  
  const prevUrlsRef = useRef(new Set());

  // Cleanup object URLs
  useEffect(() => {
    const currentUrls = new Set();
    images.forEach(img => {
      if (img.original) currentUrls.add(URL.createObjectURL(img.original));
      if (img.converted) currentUrls.add(URL.createObjectURL(img.converted));
    });

    prevUrlsRef.current.forEach(url => {
      if (!currentUrls.has(url)) {
        URL.revokeObjectURL(url);
      }
    });

    prevUrlsRef.current = currentUrls;

    return () => {
      prevUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  const onDrop = useCallback((acceptedFiles) => {
    const newImagesPromises = acceptedFiles.map(file => {
      return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          resolve({
            original: file,
            converted: null,
            error: null,
            dimensions: { width: img.width, height: img.height },
            originalFormat: file.type
          });
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          logger.error("Failed to load image for preview", file.name, 'ImageConverter');
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
    accept: { 
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff'] 
    },
    multiple: true
  });

  const convertImage = async (imageFile, targetFormat, quality) => {
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
          
          // Draw image with anti-aliasing
          ctx.drawImage(img, 0, 0, img.width, img.height);

          let outputMimeType = targetFormat;
          let outputQuality = quality / 100;
          let fileExtension = outputMimeType.split('/')[1] || 'jpeg';

          // Handle specific format requirements
          if (outputMimeType === 'image/png') {
            fileExtension = 'png';
            outputQuality = undefined; // PNG doesn't use quality
          } else if (outputMimeType === 'image/webp') {
            fileExtension = 'webp';
          } else if (outputMimeType === 'image/gif') {
            fileExtension = 'gif';
            // Note: GIF conversion to other formats loses animation
          }

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const originalFileNameWithoutExt = imageFile.name.split('.').slice(0, -1).join('.');
                resolve(new File([blob], `${originalFileNameWithoutExt}.${fileExtension}`, {
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

  const convertImages = async () => {
    if (images.length === 0) {
      alert('Please add images to convert.');
      return;
    }
    setConverting(true);
    try {
      const convertedImagesPromises = images.map(async (img) => {
        try {
          const convertedFile = await convertImage(img.original, outputFormat, quality);
          return { ...img, converted: convertedFile, error: null };
        } catch (error) {
          logger.error(`Error converting image ${img.original.name}`, error, 'ImageConverter');
          return { ...img, converted: null, error: `Failed: ${error.message}` };
        }
      });
      const convertedResults = await Promise.all(convertedImagesPromises);
      setImages(convertedResults);
    } catch (error) {
      logger.error('An unexpected error occurred during batch conversion', error, 'ImageConverter');
      alert('An unexpected error occurred during batch conversion. Check console for details.');
    } finally {
      setConverting(false);
    }
  };

  const downloadConvertedImage = useCallback((convertedImage) => {
    if (!convertedImage) {
      alert('Image not converted yet.');
      return;
    }
    const link = document.createElement('a');
    link.href = URL.createObjectURL(convertedImage);
    link.download = convertedImage.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, []);

  const downloadAllConvertedImages = async () => {
    if (images.length === 0) {
      alert('No images to download.');
      return;
    }
    const convertedImagesReady = images.filter(img => img.converted);
    if (convertedImagesReady.length === 0) {
      alert('No images have been converted yet.');
      return;
    }

    if (convertedImagesReady.length === 1) {
      downloadConvertedImage(convertedImagesReady[0].converted);
      return;
    }

    const zip = new JSZip();
    convertedImagesReady.forEach((img) => {
      zip.file(img.converted.name, img.converted);
    });

    try {
      const content = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 } });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = "converted_images.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      logger.error('Error creating zip file', error, 'ImageConverter');
      alert('Error creating zip file. Please try downloading files individually.');
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllImages = () => {
    setImages([]);
  };

  const formatOptions = [
    { value: 'image/jpeg', label: 'JPEG', description: 'Best for photos, smaller file size' },
    { value: 'image/png', label: 'PNG', description: 'Best for graphics, supports transparency' },
    { value: 'image/webp', label: 'WebP', description: 'Modern format, excellent compression' },
    { value: 'image/gif', label: 'GIF', description: 'Supports animation, limited colors' },
    { value: 'image/bmp', label: 'BMP', description: 'Uncompressed, large file size' }
  ];

  const getFormatInfo = () => {
    const format = formatOptions.find(f => f.value === outputFormat);
    return format || formatOptions[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-sans antialiased relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-96 h-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse top-1/4 left-1/4"></div>
        <div className="absolute w-80 h-80 rounded-full bg-blue-500/20 blur-3xl animate-pulse animation-delay-2000 bottom-1/4 right-1/4"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <Link 
          to="/image-tools" 
          className="inline-flex items-center mb-8 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all duration-300 backdrop-filter backdrop-blur-sm"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Image Tools
        </Link>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                <FileImage size={32} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">Image Format Converter</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Convert your images between different formats. Support for JPEG, PNG, WebP, GIF, and more.
            </p>
          </div>

          {/* Settings Panel */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Output Format
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {formatOptions.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label} - {format.description}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-gray-400">
                  {getFormatInfo().description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="mb-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/20 hover:border-purple-500/50 hover:bg-white/5'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg text-white mb-2">
                {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
              </p>
              <p className="text-gray-400">
                or click to select files (JPG, PNG, WebP, GIF, BMP, TIFF)
              </p>
            </div>
          </div>

          {/* Images List */}
          {images.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  Images ({images.length})
                </h3>
                <button
                  onClick={clearAllImages}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {image.original.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {image.dimensions.width} × {image.dimensions.height}
                        </p>
                      </div>
                      <button
                        onClick={() => removeImage(index)}
                        className="text-gray-400 hover:text-red-400 transition-colors ml-2"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="aspect-square bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                      <img
                        src={URL.createObjectURL(image.original)}
                        alt={image.original.name}
                        className="max-w-full max-h-full object-contain rounded"
                      />
                    </div>

                    {image.converted && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Original:</span>
                          <span className="text-white">{(image.original.size / 1024).toFixed(1)} KB</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Converted:</span>
                          <span className="text-white">{(image.converted.size / 1024).toFixed(1)} KB</span>
                        </div>
                        <button
                          onClick={() => downloadConvertedImage(image.converted)}
                          className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-teal-600 transition-all duration-300"
                        >
                          Download
                        </button>
                      </div>
                    )}

                    {image.error && (
                      <p className="text-red-400 text-xs">{image.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {images.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={convertImages}
                disabled={converting}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {converting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <FileImage className="w-5 h-5 mr-2" />
                    Convert Images
                  </>
                )}
              </button>

              {images.some(img => img.converted) && (
                <button
                  onClick={downloadAllConvertedImages}
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-full font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download All
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageConverter; 