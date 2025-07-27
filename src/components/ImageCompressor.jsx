import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, Upload, Download, Image as ImageIcon, Trash2, X, Loader2 } from 'lucide-react'; // Added X and Loader2
import { Link } from 'react-router-dom';
import JSZip from 'jszip';

const ImageCompressor = () => {
  const [images, setImages] = useState([]);
  const [quality, setQuality] = useState(70);
  const [compressing, setCompressing] = useState(false);
  const [outputFormat, setOutputFormat] = useState('image/jpeg'); // Default to JPEG for compression
  
  // Ref to hold previous URLs for robust cleanup
  const prevUrlsRef = useRef(new Set());

  // Effect to revoke object URLs when images are removed or replaced
  useEffect(() => {
    const currentOriginalUrls = new Set();
    const currentCompressedUrls = new Set();

    images.forEach(img => {
      if (img.original) currentOriginalUrls.add(URL.createObjectURL(img.original));
      if (img.compressed) currentCompressedUrls.add(URL.createObjectURL(img.compressed));
    });

    prevUrlsRef.current.forEach(url => {
      if (!currentOriginalUrls.has(url) && !currentCompressedUrls.has(url)) {
        URL.revokeObjectURL(url);
      }
    });

    prevUrlsRef.current = new Set([...currentOriginalUrls, ...currentCompressedUrls]);

    return () => {
      prevUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  const onDrop = useCallback((acceptedFiles) => {
    const newImagesPromises = acceptedFiles.map(file => {
      return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file); // Create URL once
        img.onload = () => {
          URL.revokeObjectURL(objectUrl); // Revoke temporary URL after image is loaded
          resolve({
            original: file,
            compressed: null,
            error: null, // Add error state for individual image
            dimensions: { width: img.width, height: img.height } // Store original dimensions
          });
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl); // Revoke even if error
          console.error("Failed to load image for preview:", file.name);
          resolve(null); // Resolve with null to filter out bad files
        };
        img.src = objectUrl; // Use the created object URL
      });
    });

    Promise.all(newImagesPromises).then(resolvedImages => {
      const validImages = resolvedImages.filter(img => img !== null);
      setImages(prev => [...prev, ...validImages]);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] }, // Added WebP and GIF for broader support
    multiple: true
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
          
          // Draw image with anti-aliasing for better quality
          ctx.drawImage(img, 0, 0, img.width, img.height);

          let outputMimeType = format; // Use the selected format
          let outputQuality = compressionQuality / 100;
          let fileExtension = outputMimeType.split('/')[1] || 'jpeg'; // Default to jpeg if none
          if (outputMimeType === 'image/png') fileExtension = 'png'; // Ensure png extension if selected

          // Handle cases where original format might be problematic for canvas.toBlob
          // For example, GIF might require specific handling if animation is desired.
          // For static compression, converting to JPG/PNG/WebP is generally preferred.
          if (!['image/jpeg', 'image/png', 'image/webp'].includes(imageFile.type) && format === 'original') {
              outputMimeType = 'image/jpeg'; // Fallback to JPEG for non-standard original formats
              fileExtension = 'jpeg';
          }
          if (imageFile.type === 'image/gif' && format === 'original') {
              // For GIFs, we usually convert to static JPG/PNG as canvas doesn't handle animation well.
              // If 'original' format is selected for GIF, default to PNG for better quality on static.
              outputMimeType = 'image/png';
              fileExtension = 'png';
          }


          canvas.toBlob(
            (blob) => {
              if (blob) {
                const originalFileNameWithoutExt = imageFile.name.split('.').slice(0, -1).join('.');
                resolve(new File([blob], `${originalFileNameWithoutExt}_compressed.${fileExtension}`, {
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
        img.onerror = reject; // Reject promise on image load error
      };
      reader.onerror = reject; // Reject promise on file read error
    });
  };

  const compressImages = async () => {
    if (images.length === 0) {
      alert('Please add images to compress.');
      return;
    }
    setCompressing(true);
    try {
      const compressedImagesPromises = images.map(async (img) => {
        try {
          const compressedFile = await compressImage(img.original, quality, outputFormat);
          return { ...img, compressed: compressedFile, error: null };
        } catch (error) {
          console.error(`Error compressing image ${img.original.name}:`, error);
          return { ...img, compressed: null, error: `Failed: ${error.message}` };
        }
      });
      const compressedResults = await Promise.all(compressedImagesPromises);
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
    link.href = URL.createObjectURL(compressedImage);
    link.download = compressedImage.name; // Use the name from the File object
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href); // Clean up the URL
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
    compressedImagesReady.forEach((img) => {
      zip.file(img.compressed.name, img.compressed);
    });

    try {
      const content = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 } });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = "compressed_images.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Clean up the URL
    } catch (error) {
      console.error("Error generating zip:", error);
      alert("Failed to generate zip file. Please try again.");
    }
  };

  const removeImage = useCallback((indexToRemove) => {
    setImages(prevImages => {
      const newImages = prevImages.filter((_, index) => index !== indexToRemove);
      // The `useEffect` for `prevUrlsRef` will handle revoking the URLs.
      return newImages;
    });
  }, []);

  const clearAllImages = () => {
    setImages([]);
    setQuality(70);
    setCompressing(false);
    setOutputFormat('image/jpeg');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-950 text-white font-sans antialiased relative">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-blue-500/20 blur-3xl animate-blob-fade top-1/4 left-[15%] animation-delay-0"></div>
        <div className="absolute w-80 h-80 rounded-full bg-teal-500/20 blur-3xl animate-blob-fade top-[65%] left-[70%] animation-delay-2000"></div>
        <div className="absolute w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl animate-blob-fade top-[10%] left-[60%] animation-delay-4000"></div>
        <div className="absolute w-56 h-56 rounded-full bg-green-500/20 blur-3xl animate-blob-fade top-[80%] left-[20%] animation-delay-6000"></div>
      </div>

      <div className="container mx-auto p-4 md:p-8 relative z-10 flex flex-col min-h-screen">
        {/* Header/Back Button */}
        <div className="flex items-center justify-between mb-8">
            <Link 
              to="/image-tools" 
              className="inline-flex items-center px-4 py-1.5 bg-white/10 text-white rounded-full 
                         hover:bg-white/20 transition-all duration-300 backdrop-blur-md border border-white/20 
                         hover:border-blue-400 transform hover:scale-105 shadow-md animate-fade-in-left text-sm"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back To Image Tools
            </Link>
            <h1 className="text-2xl md:text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 drop-shadow-md animate-fade-in-down flex-grow px-4">
              Image Compressor
            </h1>
            <button
                onClick={clearAllImages}
                className="inline-flex items-center px-3 py-1.5 bg-red-600/80 text-white rounded-full 
                           hover:bg-red-700 transition-colors duration-300 transform hover:scale-105 shadow-md text-sm
                           disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={images.length === 0 || compressing}
                title="Clear all loaded images"
            >
                <X className="mr-2 w-4 h-4" /> Clear All
            </button>
        </div>
        
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`
            border-3 border-dashed rounded-2xl p-10 text-center my-6
            transition-all duration-300 ease-in-out cursor-pointer
            ${isDragActive
              ? 'border-teal-400 bg-teal-400/10 scale-[1.01] shadow-lg'
              : 'border-white/30 hover:border-blue-400 hover:bg-blue-400/10'
            }
            ${compressing ? 'opacity-70 cursor-not-allowed pointer-events-none' : 'shadow-md'}
            animate-fade-in
          `}
        >
          <input {...getInputProps()} disabled={compressing} />
          <Upload className="mx-auto mb-3 text-white w-10 h-10" />
          <p className="text-white text-opacity-90 text-base md:text-lg font-semibold">
            {isDragActive ? "Drop the image(s) here!" : "Drag & drop images here, or click to select"}
          </p>
          <p className="text-white text-opacity-70 text-xs mt-1">
            (Supports PNG, JPG, JPEG, WebP, GIF formats)
          </p>
        </div>

        {images.length > 0 && (
          <div className="flex flex-col flex-grow bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 p-6 animate-fade-in-up">
            {/* Common Controls */}
            <div className="bg-white/10 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-inner">
              <h2 className="text-white text-base font-semibold whitespace-nowrap">Compress Settings:</h2>
              
              {/* Quality Slider */}
              <div className="flex items-center gap-3 flex-grow">
                <span className="text-white text-sm whitespace-nowrap">Quality:</span>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer range-sm"
                  title={`Compression Quality: ${quality}%`}
                  disabled={compressing}
                />
                <span className="text-white text-sm w-8 text-right">{quality}%</span>
              </div>

              {/* Output Format */}
              <div className="flex items-center gap-2">
                <span className="text-white text-sm whitespace-nowrap">Format:</span>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="bg-gray-800 text-white rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={compressing}
                >
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                  {/* Option for original format only if image can be converted to JPEG/PNG/WebP */}
                </select>
              </div>

              <button 
                onClick={compressImages}
                className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white font-semibold py-2.5 px-6 rounded-full text-base transition-all duration-300 shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                disabled={compressing || images.length === 0}
              >
                {compressing ? (
                  <> <Loader2 className="inline-block mr-2 w-4 h-4 animate-spin" /> Compressing... </>
                ) : (
                  'Compress Images'
                )}
              </button>
              <button 
                onClick={downloadAllCompressedImages}
                className="bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white font-semibold py-2.5 px-6 rounded-full text-base transition-all duration-300 shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                disabled={compressing || images.length === 0 || !images.every(img => img.compressed)}
              >
                <Download className="inline-block mr-2 w-4 h-4" />
                Download All
              </button>
            </div>

            {/* Image Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((img, index) => (
                <div key={index} className={`bg-white/10 rounded-xl p-5 shadow-lg border border-white/15 relative group animate-fade-in-up ${img.error ? 'border-red-500 ring-2 ring-red-500' : ''}`}>
                  {img.error && (
                      <div className="absolute inset-x-0 top-0 bg-red-600 text-white text-xs text-center py-1.5 z-20 rounded-t-xl">
                          Error: {img.error}
                      </div>
                  )}
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-500 p-1 rounded-full bg-black/20 hover:bg-black/30 transition-colors z-10 opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove image"
                    disabled={compressing}
                  >
                    <Trash2 size={18} />
                  </button>

                  <h3 className="text-white font-semibold text-lg mb-3 truncate pr-10" title={img.original.name}>
                    {img.original.name}
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm mb-1">Original ({img.dimensions.width}x{img.dimensions.height})</p>
                      <div className="relative w-full h-36 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center border border-gray-700">
                        <img 
                          src={URL.createObjectURL(img.original)} 
                          alt="Original" 
                          className="object-contain max-w-full max-h-full"
                        />
                        <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                          {(img.original.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm mb-1">Compressed (Preview)</p>
                      <div className="relative w-full h-36 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center border border-gray-700">
                        {img.compressed ? (
                          <img 
                            src={URL.createObjectURL(img.compressed)} 
                            alt="Compressed" 
                            className="object-contain max-w-full max-h-full"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon size={36} className="text-gray-500/50" />
                          </div>
                        )}
                        {img.compressed && (
                          <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                            {(img.compressed.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {img.compressed && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-white/80 text-sm font-semibold">
                        Reduction: <span className="text-teal-400">
                        {((1 - img.compressed.size / img.original.size) * 100).toFixed(0)}%
                        </span>
                      </p>
                      <button 
                        onClick={() => downloadCompressedImage(img.compressed)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full text-sm transition-all duration-300 shadow-md hover:scale-105"
                      >
                        <Download className="inline-block mr-1 w-4 h-4" /> Download
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCompressor;