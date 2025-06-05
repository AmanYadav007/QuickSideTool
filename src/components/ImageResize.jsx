import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, Upload, Download, Image as ImageIcon, Lock, Unlock, Trash2, Copy, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import JSZip from 'jszip';

const ImageResize = () => {
    const [images, setImages] = useState([]);
    const [resizing, setResizing] = useState(false);
    const [globalLockAspectRatio, setGlobalLockAspectRatio] = useState(true);
    const [commonWidth, setCommonWidth] = useState('');
    const [commonHeight, setCommonHeight] = useState('');
    // resizeMode and commonScale states are removed as per request.

    const [outputFormat, setOutputFormat] = useState('original'); // 'original', 'image/jpeg', 'image/png', 'image/webp'
    const [jpegQuality, setJpegQuality] = useState(90); // 0-100
    const [webpQuality, setWebpQuality] = useState(90); // 0-100

    const prevUrlsRef = useRef(new Set());

    useEffect(() => {
        const currentOriginalUrls = new Set();
        const currentResizedUrls = new Set();

        images.forEach(img => {
            if (img.original) currentOriginalUrls.add(URL.createObjectURL(img.original));
            if (img.resized) currentResizedUrls.add(URL.createObjectURL(img.resized));
        });

        prevUrlsRef.current.forEach(url => {
            if (!currentOriginalUrls.has(url) && !currentResizedUrls.has(url)) {
                URL.revokeObjectURL(url);
            }
        });

        prevUrlsRef.current = new Set([...currentOriginalUrls, ...currentResizedUrls]);

        return () => {
            prevUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
        };
    }, [images]);

    // Set initial common dimensions if first image is added and no common dimensions set
    useEffect(() => {
        if (images.length > 0 && commonWidth === '' && commonHeight === '') {
            setCommonWidth(images[0].width);
            setCommonHeight(images[0].height);
        }
    }, [images, commonWidth, commonHeight]);


    const onDrop = useCallback((acceptedFiles) => {
        const newImagesPromises = acceptedFiles.map(file => {
            return new Promise((resolve) => {
                const img = new Image();
                const objectUrl = URL.createObjectURL(file);
                img.onload = () => {
                    URL.revokeObjectURL(objectUrl);
                    resolve({
                        original: file,
                        resized: null,
                        width: img.width,
                        height: img.height,
                        aspectRatio: img.width / img.height,
                        lockAspectRatio: true,
                        customWidth: img.width,
                        customHeight: img.height,
                        // scale property is removed as percentage mode is no longer used
                        error: null, // Error state for individual image
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
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
        multiple: true
    });

    const resizeImage = async (imageFile, newWidth, newHeight, format, quality) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    const ctx = canvas.getContext('2d');

                    ctx.drawImage(img, 0, 0, newWidth, newHeight);

                    let outputMimeType = format === 'original' ? imageFile.type : format;
                    let outputQuality = 1; // Default for PNG
                    let fileExtension = outputMimeType.split('/')[1];

                    if (outputMimeType === 'image/jpeg') {
                        outputQuality = quality / 100;
                    } else if (outputMimeType === 'image/webp') {
                        outputQuality = quality / 100;
                    } else if (outputMimeType === 'image/png') {
                        fileExtension = 'png';
                    }

                    // Fallback for unsupported original formats (like SVG, GIF to JPG/PNG/WebP)
                    if (!['image/jpeg', 'image/png', 'image/webp'].includes(outputMimeType)) {
                        outputMimeType = 'image/png';
                        fileExtension = 'png';
                    }

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const originalFileName = imageFile.name.split('.')[0];
                                resolve(new File([blob], `${originalFileName}_${newWidth}x${newHeight}.${fileExtension}`, {
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

    const resizeAll = async () => {
        let qualityToUse = outputFormat === 'image/jpeg' ? jpegQuality : webpQuality;

        if (!commonWidth || !commonHeight) {
            alert('Please set both common width and height.');
            return;
        }
        const targetWidth = parseInt(commonWidth);
        const targetHeight = parseInt(commonHeight);


        if (isNaN(targetWidth) || isNaN(targetHeight) || targetWidth <= 0 || targetHeight <= 0) {
            alert('Please enter valid positive numbers for common width and height.');
            return;
        }

        setResizing(true);
        try {
            const resizedImagesPromises = images.map(async (img) => {
                try {
                    const resizedFile = await resizeImage(img.original, targetWidth, targetHeight, outputFormat, qualityToUse);
                    return {
                        ...img,
                        width: targetWidth, // Update the displayed dimensions to new dimensions
                        height: targetHeight,
                        customWidth: targetWidth, // Also update individual controls to reflect new size
                        customHeight: targetHeight,
                        resized: resizedFile,
                        error: null,
                    };
                } catch (error) {
                    console.error(`Error resizing image ${img.original.name}:`, error);
                    return { ...img, resized: null, error: `Failed to resize: ${error.message}` };
                }
            });
            const resizedImages = await Promise.all(resizedImagesPromises);
            setImages(resizedImages);
        } catch (error) {
            console.error('An unexpected error occurred during batch resizing:', error);
            alert('An unexpected error occurred during batch resizing. Check console for details.');
        } finally {
            setResizing(false);
        }
    };

    const resizeIndividual = async (index) => {
        const img = images[index];
        let qualityToUse = outputFormat === 'image/jpeg' ? jpegQuality : webpQuality;

        if (!img.customWidth || !img.customHeight) {
            alert('Please set both width and height for this image.');
            return;
        }
        const targetWidth = parseInt(img.customWidth);
        const targetHeight = parseInt(img.customHeight);

        if (isNaN(targetWidth) || isNaN(targetHeight) || targetWidth <= 0 || targetHeight <= 0) {
            alert('Please enter valid positive numbers for width and height for this image.');
            return;
        }

        setResizing(true); // Indicate busy state
        setImages(prev => prev.map((item, i) => i === index ? { ...item, error: null } : item)); // Clear previous error
        try {
            const resizedImageFile = await resizeImage(img.original, targetWidth, targetHeight, outputFormat, qualityToUse);
            setImages(prev => prev.map((item, i) =>
                i === index ? {
                    ...item,
                    width: targetWidth,
                    height: targetHeight,
                    customWidth: targetWidth, // Update individual controls to reflect new size
                    customHeight: targetHeight,
                    resized: resizedImageFile,
                    error: null,
                } : item
            ));
        } catch (error) {
            console.error('Error resizing individual image:', error);
            setImages(prev => prev.map((item, i) => i === index ? { ...item, resized: null, error: `Failed: ${error.message}` } : item));
            alert('There was an error resizing the image. Check console for details.');
        } finally {
            setResizing(false); // Clear busy state
        }
    };

    const handleIndividualWidthChange = (index, newWidthStr) => {
        const newWidth = parseFloat(newWidthStr);
        setImages(prev => prev.map((img, i) => {
            if (i === index) {
                let updatedHeight = img.customHeight;
                if (img.lockAspectRatio && !isNaN(newWidth) && newWidth > 0 && typeof img.aspectRatio === 'number' && !isNaN(img.aspectRatio) && img.aspectRatio !== 0) {
                    updatedHeight = Math.round(newWidth / img.aspectRatio);
                }
                return {
                    ...img,
                    customWidth: newWidthStr === '' ? '' : (isNaN(newWidth) ? '' : newWidth),
                    customHeight: isNaN(updatedHeight) ? '' : updatedHeight,
                };
            }
            return img;
        }));
    };

    const handleIndividualHeightChange = (index, newHeightStr) => {
        const newHeight = parseFloat(newHeightStr);
        setImages(prev => prev.map((img, i) => {
            if (i === index) {
                let updatedWidth = img.customWidth;
                if (img.lockAspectRatio && !isNaN(newHeight) && newHeight > 0 && typeof img.aspectRatio === 'number' && !isNaN(img.aspectRatio) && img.aspectRatio !== 0) {
                    updatedWidth = Math.round(newHeight * img.aspectRatio);
                }
                return {
                    ...img,
                    customHeight: newHeightStr === '' ? '' : (isNaN(newHeight) ? '' : newHeight),
                    customWidth: isNaN(updatedWidth) ? '' : updatedWidth,
                };
            }
            return img;
        }));
    };

    // handleIndividualScaleChange is removed as percentage mode is no longer used

    const toggleIndividualLockAspectRatio = (index) => {
        setImages(prev => prev.map((img, i) => {
            if (i === index) {
                const newLockState = !img.lockAspectRatio;
                let updatedWidth = img.customWidth;
                let updatedHeight = img.customHeight;

                if (newLockState) {
                    if (img.customWidth && img.customWidth > 0 && img.aspectRatio) {
                        updatedHeight = Math.round(img.customWidth / img.aspectRatio);
                    } else if (img.customHeight && img.customHeight > 0 && img.aspectRatio) {
                        updatedWidth = Math.round(img.customHeight * img.aspectRatio);
                    }
                }
                return { ...img, lockAspectRatio: newLockState, customWidth: updatedWidth, customHeight: updatedHeight };
            }
            return img;
        }));
    };

    const applyCommonSizeToIndividual = (index) => {
        if (!commonWidth || !commonHeight) {
            alert('Please set common width and height first.');
            return;
        }
        const parsedCommonWidth = parseInt(commonWidth);
        const parsedCommonHeight = parseInt(commonHeight);
        if (isNaN(parsedCommonWidth) || isNaN(parsedCommonHeight) || parsedCommonWidth <= 0 || parsedCommonHeight <= 0) {
            alert('Common width and height must be valid positive numbers.');
            return;
        }

        setImages(prev => prev.map((img, i) =>
            i === index ? {
                ...img,
                customWidth: parsedCommonWidth,
                customHeight: parsedCommonHeight,
                lockAspectRatio: globalLockAspectRatio
            } : img
        ));
    };

    const downloadAllImages = () => {
        if (images.length === 0) {
            alert('No images to download.');
            return;
        }
        if (!images.every(img => img.resized)) {
            alert('Please resize all images before attempting to download.');
            return;
        }

        if (images.length === 1) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(images[0].resized);
            link.download = images[0].resized.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } else {
            const zip = new JSZip();
            images.forEach(img => {
                if (img.resized) {
                    zip.file(img.resized.name, img.resized);
                }
            });

            zip.generateAsync({ type: 'blob', compression: "DEFLATE", compressionOptions: { level: 9 } }).then(content => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = 'resized_images.zip';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            }).catch(error => {
                console.error("Error generating zip:", error);
                alert("Failed to generate zip file. Please try again.");
            });
        }
    };

    const handleCommonWidthChange = (newWidthStr) => {
        const newWidth = parseFloat(newWidthStr);
        setCommonWidth(newWidthStr === '' ? '' : (isNaN(newWidth) ? '' : newWidth));
        if (globalLockAspectRatio && !isNaN(newWidth) && newWidth > 0 && images.length > 0 && images[0].aspectRatio) {
            const aspectRatio = images[0].aspectRatio;
            setCommonHeight(Math.round(newWidth / aspectRatio));
        } else if (isNaN(newWidth)) {
            setCommonHeight('');
        }
    };

    const handleCommonHeightChange = (newHeightStr) => {
        const newHeight = parseFloat(newHeightStr);
        setCommonHeight(newHeightStr === '' ? '' : (isNaN(newHeight) ? '' : newHeight));
        if (globalLockAspectRatio && !isNaN(newHeight) && newHeight > 0 && images.length > 0 && images[0].aspectRatio) {
            const aspectRatio = images[0].aspectRatio;
            setCommonWidth(Math.round(newHeight * aspectRatio));
        } else if (isNaN(newHeight)) {
            setCommonWidth('');
        }
    };

    // handleCommonScaleChange is removed as percentage mode is no longer used

    const toggleGlobalLockAspectRatio = () => {
        const newLockState = !globalLockAspectRatio;
        setGlobalLockAspectRatio(newLockState);

        if (newLockState && images.length > 0 && images[0].aspectRatio) {
            const aspectRatio = images[0].aspectRatio;
            if (commonWidth && parseInt(commonWidth) > 0) {
                setCommonHeight(Math.round(parseInt(commonWidth) / aspectRatio));
            } else if (commonHeight && parseInt(commonHeight) > 0) {
                setCommonWidth(Math.round(parseInt(commonHeight) * aspectRatio));
            }
        }
    };

    const removeImage = useCallback((index) => {
        setImages(prevImages => {
            return prevImages.filter((_, i) => i !== index);
        });
    }, []);

    const clearAllImages = () => {
        setImages([]);
        setCommonWidth('');
        setCommonHeight('');
        // commonScale reset is removed
        setResizing(false);
    };

    // applyPreset function is removed as presets are no longer used

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-950 text-white font-sans antialiased relative">
            {/* Background Animated Blobs */}
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
                        Batch Image Resize
                    </h1>
                    <button
                        onClick={clearAllImages}
                        className="inline-flex items-center px-3 py-1.5 bg-red-600/80 text-white rounded-full
                                  hover:bg-red-700 transition-colors duration-300 transform hover:scale-105 shadow-md text-sm
                                  disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={images.length === 0 || resizing}
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
                        ${resizing ? 'opacity-70 cursor-not-allowed pointer-events-none' : 'shadow-md'}
                        animate-fade-in
                    `}
                >
                    <input {...getInputProps()} disabled={resizing} />
                    <Upload className="mx-auto mb-3 text-white w-10 h-10" />
                    <p className="text-white text-opacity-90 text-base md:text-lg font-semibold">
                        {isDragActive ? "Drop the images here!" : "Drag & drop images here, or click to select"}
                    </p>
                    <p className="text-white text-opacity-70 text-xs mt-1">
                        (Supports PNG, JPG, JPEG, WebP formats)
                    </p>
                </div>

                {images.length > 0 && (
                    <div className="flex flex-col flex-grow bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 p-6 animate-fade-in-up">
                        {/* Common Size Controls & Output Settings - Simplified */}
                        <div className="bg-white/10 rounded-xl p-4 mb-6 flex flex-col md:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 shadow-inner"> {/* Adjusted for tablet responsiveness */}
                            {/* Removed: <h2 className="text-white text-base font-semibold whitespace-nowrap mb-2 md:mb-0">Common Settings:</h2> */}

                            {/* Removed: Presets */}
                            {/* Removed: Resize Mode Toggle */}

                            {/* Dimensions Input (Always pixels) */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={commonWidth}
                                    onChange={(e) => handleCommonWidthChange(e.target.value)}
                                    placeholder="Width"
                                    className="bg-white/20 text-white placeholder-gray-300 rounded-lg px-2 py-1.5 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    min="1"
                                />
                                <span className="text-white text-base">x</span>
                                <input
                                    type="number"
                                    value={commonHeight}
                                    onChange={(e) => handleCommonHeightChange(e.target.value)}
                                    placeholder="Height"
                                    className="bg-white/20 text-white placeholder-gray-300 rounded-lg px-2 py-1.5 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    min="1"
                                />
                            </div>

                            <button
                                onClick={toggleGlobalLockAspectRatio}
                                className="bg-white/20 text-white p-1.5 rounded-lg hover:bg-white/30 transition-colors shadow-sm"
                                title={globalLockAspectRatio ? "Unlock global aspect ratio" : "Lock global aspect ratio"}
                            >
                                {globalLockAspectRatio ? <Lock size={18} /> : <Unlock size={18} />}
                            </button>

                            {/* Output Format and Quality */}
                            <div className="flex items-center gap-3">
                                <select
                                    value={outputFormat}
                                    onChange={(e) => setOutputFormat(e.target.value)}
                                    className="bg-gray-800 text-white rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="original">Original Format</option>
                                    <option value="image/jpeg">JPEG</option>
                                    <option value="image/png">PNG</option>
                                    <option value="image/webp">WebP</option>
                                </select>

                                {(outputFormat === 'image/jpeg' || outputFormat === 'image/webp') && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-white text-sm">Quality:</span>
                                        <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            value={outputFormat === 'image/jpeg' ? jpegQuality : webpQuality}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (outputFormat === 'image/jpeg') setJpegQuality(val);
                                                else setWebpQuality(val);
                                            }}
                                            className="w-24 h-2 bg-white/30 rounded-lg appearance-none cursor-pointer range-sm"
                                            title={`Quality: ${outputFormat === 'image/jpeg' ? jpegQuality : webpQuality}%`}
                                        />
                                        <span className="text-white text-sm w-8 text-right">
                                            {outputFormat === 'image/jpeg' ? jpegQuality : webpQuality}%
                                        </span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={resizeAll}
                                className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white font-semibold py-2.5 px-6 rounded-full text-base transition-all duration-300 shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                                disabled={resizing || (!commonWidth || !commonHeight)}
                            >
                                {resizing ? (
                                    <> <Loader2 className="inline-block mr-2 w-4 h-4 animate-spin" /> Resizing... </>
                                ) : (
                                    'Resize All'
                                )}
                            </button>
                            <button
                                onClick={downloadAllImages}
                                className="bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white font-semibold py-2.5 px-6 rounded-full text-base transition-all duration-300 shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                                disabled={resizing || images.length === 0 || !images.every(img => img.resized)}
                            >
                                <Download className="inline-block mr-2 w-4 h-4" />
                                Download All
                            </button>
                        </div>

                        {/* Image Cards with Individual Controls */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {images.map((img, index) => (
                                <div key={index} className={`bg-white/10 rounded-xl p-5 shadow-lg border border-white/15 relative group animate-fade-in-up ${img.error ? 'border-red-500 ring-2 ring-red-500' : ''}`}>

                                    {img.error && (
                                        <div className="absolute inset-x-0 top-0 bg-red-600 text-white text-xs text-center py-1.5 z-20 rounded-t-xl">
                                            Error: {img.error}
                                        </div>
                                    )}

                                    <div className="absolute top-3 right-3 flex items-center space-x-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={() => applyCommonSizeToIndividual(index)}
                                            className="text-white/80 hover:text-blue-300 p-1 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
                                            title="Apply common size to this image"
                                            disabled={resizing || (!commonWidth || !commonHeight)}
                                        >
                                            <Copy size={18} />
                                        </button>
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="text-red-400 hover:text-red-500 p-1 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
                                            title="Remove image"
                                            disabled={resizing}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Removed the Reset button */}
                                    {/* <button
                                        onClick={() => setImages(prev => prev.map((item, i) => i === index ? { ...item, customWidth: img.width, customHeight: img.height, scale: 100, lockAspectRatio: true } : item))}
                                        className="absolute bottom-3 left-3 px-2 py-1 bg-white/20 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/30"
                                        title="Reset to original dimensions"
                                        disabled={resizing}
                                    >
                                        Reset
                                    </button> */}


                                    <h3 className="text-white font-semibold text-lg mb-3 truncate pr-16" title={img.original.name}>
                                        {img.original.name}
                                    </h3>

                                    {/* Enhanced Preview Part: Added gap-4 and adjusted height for more prominent images */}
                                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white/80 text-sm mb-1">Original ({img.width}x{img.height})</p>
                                            <div className="relative w-full h-48 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center border border-gray-700"> {/* Increased height to h-48 */}
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
                                            <p className="text-white/80 text-sm mb-1">Resized (Preview)</p>
                                            <div className="relative w-full h-48 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center border border-gray-700"> {/* Increased height to h-48 */}
                                                {img.resized ? (
                                                    <img
                                                        src={URL.createObjectURL(img.resized)}
                                                        alt="Resized"
                                                        className="object-contain max-w-full max-h-full"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <ImageIcon size={48} className="text-gray-500/50" /> {/* Larger icon for empty preview */}
                                                    </div>
                                                )}
                                                {img.resized && (
                                                    <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                                                        {(img.resized.size / (1024 * 1024)).toFixed(2)} MB
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Individual Control Inputs (only pixels) */}
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                                        <>
                                            <input
                                                type="number"
                                                value={img.customWidth}
                                                onChange={(e) => handleIndividualWidthChange(index, e.target.value)}
                                                placeholder="Width"
                                                className="bg-white/20 text-white placeholder-gray-300 rounded-lg px-2 py-1 w-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                min="1"
                                                disabled={resizing}
                                            />
                                            <span className="text-white text-sm">x</span>
                                            <input
                                                type="number"
                                                value={img.customHeight}
                                                onChange={(e) => handleIndividualHeightChange(index, e.target.value)}
                                                placeholder="Height"
                                                className="bg-white/20 text-white placeholder-gray-300 rounded-lg px-2 py-1 w-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                min="1"
                                                disabled={resizing}
                                            />
                                        </>

                                        <button
                                            onClick={() => toggleIndividualLockAspectRatio(index)}
                                            className="bg-white/20 text-white p-1.5 rounded-lg hover:bg-white/30 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={img.lockAspectRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}
                                            disabled={resizing}
                                        >
                                            {img.lockAspectRatio ? <Lock size={16} /> : <Unlock size={16} />}
                                        </button>
                                        <button
                                            onClick={() => resizeIndividual(index)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-3 rounded-lg text-sm transition-all duration-300 shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={resizing || (!img.customWidth || !img.customHeight)}
                                        >
                                            Resize
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageResize;