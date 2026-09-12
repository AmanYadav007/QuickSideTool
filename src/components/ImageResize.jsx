import React, { useState, useCallback, useEffect, useRef } from 'react';
import SEO from './SEO';
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

    const [outputFormat, setOutputFormat] = useState('original');
    const [jpegQuality, setJpegQuality] = useState(90);
    const [webpQuality, setWebpQuality] = useState(90);

    const imagesRef = useRef(images);
    const resizePresets = [
        { label: 'Square', width: 1080, height: 1080 },
        { label: 'Story', width: 1080, height: 1920 },
        { label: 'Website', width: 1200, height: 800 },
        { label: 'Thumbnail', width: 600, height: 400 },
    ];

    useEffect(
        () => () => {
            imagesRef.current.forEach(img => {
                if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
                if (img.resizedUrl) URL.revokeObjectURL(img.resizedUrl);
            });
        },
        []
    );

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
                    resolve({
                        original: file,
                        originalUrl: objectUrl,
                        resized: null,
                        resizedUrl: null,
                        width: img.width,
                        height: img.height,
                        aspectRatio: img.width / img.height,
                        lockAspectRatio: true,
                        customWidth: img.width,
                        customHeight: img.height,
                        error: null,
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
                    let outputQuality = 1;
                    let fileExtension = outputMimeType.split('/')[1];

                    if (outputMimeType === 'image/jpeg') {
                        outputQuality = quality / 100;
                    } else if (outputMimeType === 'image/webp') {
                        outputQuality = quality / 100;
                    } else if (outputMimeType === 'image/png') {
                        fileExtension = 'png';
                    }

                    if (!['image/jpeg', 'image/png', 'image/webp'].includes(outputMimeType)) {
                        outputMimeType = 'image/png';
                        fileExtension = 'png';
                    }

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const originalFileName = imageFile.name.replace(/\.[^/.]+$/, '');
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
                    let w = targetWidth;
                    let h = targetHeight;
                    if (globalLockAspectRatio && img.aspectRatio) {
                        const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
                        w = Math.max(1, Math.round(img.width * scale));
                        h = Math.max(1, Math.round(img.height * scale));
                    }
                    const resizedFile = await resizeImage(img.original, w, h, outputFormat, qualityToUse);
                    if (img.resizedUrl) URL.revokeObjectURL(img.resizedUrl);
                    return {
                        ...img,
                        width: w,
                        height: h,
                        customWidth: w,
                        customHeight: h,
                        resized: resizedFile,
                        resizedUrl: URL.createObjectURL(resizedFile),
                        error: null,
                    };
                } catch (error) {
                    console.error(`Error resizing image ${img.original.name}:`, error);
                    return { ...img, resized: null, resizedUrl: null, error: `Failed to resize: ${error.message}` };
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

        setResizing(true);
        setImages(prev => prev.map((item, i) => i === index ? { ...item, error: null } : item));
        try {
            const resizedImageFile = await resizeImage(img.original, targetWidth, targetHeight, outputFormat, qualityToUse);
            setImages(prev => prev.map((item, i) => {
                if (i !== index) return item;
                if (item.resizedUrl) URL.revokeObjectURL(item.resizedUrl);
                return {
                    ...item,
                    width: targetWidth,
                    height: targetHeight,
                    customWidth: targetWidth,
                    customHeight: targetHeight,
                    resized: resizedImageFile,
                    resizedUrl: URL.createObjectURL(resizedImageFile),
                    error: null,
                };
            }));
        } catch (error) {
            console.error('Error resizing individual image:', error);
            setImages(prev => prev.map((item, i) => i === index ? { ...item, resized: null, error: `Failed: ${error.message}` } : item));
            alert('There was an error resizing the image. Check console for details.');
        } finally {
            setResizing(false);
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
            const href = URL.createObjectURL(images[0].resized);
            link.href = href;
            link.download = images[0].resized.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(href), 10000);
        } else {
            const zip = new JSZip();
            const usedNames = new Set();
            images.forEach(img => {
                if (!img.resized) return;
                let name = img.resized.name;
                if (usedNames.has(name)) {
                    const dot = name.lastIndexOf('.');
                    const stem = dot === -1 ? name : name.slice(0, dot);
                    const ext = dot === -1 ? '' : name.slice(dot);
                    let n = 2;
                    while (usedNames.has(`${stem} (${n})${ext}`)) n += 1;
                    name = `${stem} (${n})${ext}`;
                }
                usedNames.add(name);
                zip.file(name, img.resized);
            });

            zip.generateAsync({ type: 'blob', compression: "DEFLATE", compressionOptions: { level: 9 } }).then(content => {
                const link = document.createElement('a');
                const href = URL.createObjectURL(content);
                link.href = href;
                link.download = 'resized_images.zip';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => URL.revokeObjectURL(href), 10000);
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
            const target = prevImages[index];
            if (target?.originalUrl) URL.revokeObjectURL(target.originalUrl);
            if (target?.resizedUrl) URL.revokeObjectURL(target.resizedUrl);
            return prevImages.filter((_, i) => i !== index);
        });
    }, []);

    const clearAllImages = () => {
        images.forEach(img => {
            if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
            if (img.resizedUrl) URL.revokeObjectURL(img.resizedUrl);
        });
        setImages([]);
        setCommonWidth('');
        setCommonHeight('');
        setResizing(false);
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            <SEO
                title="Resize Image Online – Exact Width & Height in Pixels"
                description="Resize images to custom dimensions or presets. JPG/PNG/WebP supported. Batch resize supported."
                url="https://quicksidetool.com/image-tools/resize"
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
                    <h1 className="h1 text-center">Batch Image Resize</h1>
                    <button
                        onClick={clearAllImages}
                        className="inline-flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={images.length === 0 || resizing}
                        title="Clear all loaded images"
                    >
                        <X className="h-4 w-4" /> Clear All
                    </button>
                </header>

                <div className="max-w-6xl mx-auto">
                    <div {...getRootProps()} className="upload-zone p-10 text-center mb-8 cursor-pointer transition-colors border-2 border-dashed rounded-3xl">
                        <input {...getInputProps()} disabled={resizing} />
                        <Upload className="mx-auto mb-3 w-10 h-10 text-[var(--color-primary)]" />
                        <p className="text-lg font-semibold text-[var(--color-text)] mb-2">
                            {isDragActive ? "Drop the images here!" : "Drag & drop images here, or click to select"}
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)]">(Supports PNG, JPG, JPEG, WebP formats)</p>
                    </div>

                    {images.length > 0 && (
                        <div className="card p-6">
                            <div className="mb-6 p-4 rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary-light)]">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div>
                                        <p className="font-semibold text-[var(--color-text)]">{images.length} image{images.length > 1 ? 's' : ''} ready</p>
                                        <p className="text-sm text-[var(--color-text-muted)]">Choose a preset or enter your own size, then resize all.</p>
                                    </div>
                                    <p className="text-sm text-[var(--color-text-muted)]">Aspect ratio is locked by default.</p>
                                </div>
                            </div>

                            <div className="mb-6 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)]">
                                <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Common Settings</h2>

                                <div className="flex flex-wrap justify-center gap-2 mb-4">
                                    {resizePresets.map((preset) => (
                                        <button
                                            key={preset.label}
                                            type="button"
                                            onClick={() => {
                                                setGlobalLockAspectRatio(false);
                                                setCommonWidth(preset.width);
                                                setCommonHeight(preset.height);
                                            }}
                                            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-sm text-[var(--color-text)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-colors"
                                            disabled={resizing}
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={commonWidth}
                                            onChange={(e) => handleCommonWidthChange(e.target.value)}
                                            placeholder="Width"
                                            className="input w-24"
                                            min="1"
                                        />
                                        <span className="text-[var(--color-text-muted)]">x</span>
                                        <input
                                            type="number"
                                            value={commonHeight}
                                            onChange={(e) => handleCommonHeightChange(e.target.value)}
                                            placeholder="Height"
                                            className="input w-24"
                                            min="1"
                                        />
                                    </div>

                                    <button
                                        onClick={toggleGlobalLockAspectRatio}
                                        className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-alt)] transition-colors"
                                        title={globalLockAspectRatio ? "Unlock global aspect ratio" : "Lock global aspect ratio"}
                                    >
                                        {globalLockAspectRatio ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <select
                                            value={outputFormat}
                                            onChange={(e) => setOutputFormat(e.target.value)}
                                            className="input sm:w-36"
                                        >
                                            <option value="original">Original Format</option>
                                            <option value="image/jpeg">JPEG</option>
                                            <option value="image/png">PNG</option>
                                            <option value="image/webp">WebP</option>
                                        </select>

{(outputFormat === 'image/jpeg' || outputFormat === 'image/webp') ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-[var(--color-text-muted)]">Quality:</span>
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
                                                    className="w-24 h-2 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer"
                                                    title={`Quality: ${outputFormat === 'image/jpeg' ? jpegQuality : webpQuality}%`}
                                                />
                                                <span className="text-sm text-[var(--color-text-muted)] w-8 text-right">
                                                    {outputFormat === 'image/jpeg' ? jpegQuality : webpQuality}%
                                                </span>
                                            </div>
                                        ) : null}
                                    </div>

                                    <button
                                        onClick={resizeAll}
                                        className="btn-primary w-full md:w-auto"
                                        disabled={resizing || (!commonWidth || !commonHeight)}
                                    >
                                        {resizing ? (
                                            <> <Loader2 className="h-4 w-4 animate-spin mr-2" /> Resizing... </>
                                        ) : (
                                            'Resize All'
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {images.map((img, index) => (
                                    <div key={index} className={`card p-4 ${img.error ? 'border-red-500/50' : ''}`}>
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-semibold text-[var(--color-text)] truncate pr-8" title={img.original.name}>
                                                {img.original.name}
                                            </h3>
                                            <button
                                                onClick={() => removeImage(index)}
                                                disabled={resizing}
                                                className="p-1 text-[var(--color-text-light)] hover:text-red-500 rounded-lg hover:bg-[var(--color-error)]/10 transition-colors disabled:opacity-50"
                                                title="Remove image"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-[var(--color-text-muted)] mb-1">Original ({img.width}x{img.height})</p>
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
                                                <p className="text-sm text-[var(--color-text-muted)] mb-1">Resized (Preview)</p>
                                                <div className="relative aspect-square bg-[var(--color-bg-alt)] rounded-lg overflow-hidden flex items-center justify-center border border-[var(--color-border)]">
                                                    {img.resized ? (
                                                        <img
                                                            src={img.resizedUrl}
                                                            alt="Resized"
                                                            className="object-contain max-w-full max-h-full h-32 w-full"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-32 flex items-center justify-center">
                                                            <ImageIcon className="w-12 h-12 text-[var(--color-text-light)]" />
                                                        </div>
                                                    )}
                                                    {img.resized && (
                                                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                                                            {(img.resized.size / (1024 * 1024)).toFixed(2)} MB
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {img.resized && (
                                            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                                <p className="text-sm text-[var(--color-text-muted)]">Reduction</p>
                                                <p className="text-lg font-semibold text-green-500">
                                                    {((1 - img.resized.size / img.original.size) * 100).toFixed(0)}%
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap items-center justify-center gap-2">
                                            <input
                                                type="number"
                                                value={img.customWidth}
                                                onChange={(e) => handleIndividualWidthChange(index, e.target.value)}
                                                placeholder="Width"
                                                className="input w-20"
                                                min="1"
                                                disabled={resizing}
                                            />
                                            <span className="text-[var(--color-text-muted)]">x</span>
                                            <input
                                                type="number"
                                                value={img.customHeight}
                                                onChange={(e) => handleIndividualHeightChange(index, e.target.value)}
                                                placeholder="Height"
                                                className="input w-20"
                                                min="1"
                                                disabled={resizing}
                                            />

                                            <button
                                                onClick={() => toggleIndividualLockAspectRatio(index)}
                                                className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-alt)] transition-colors disabled:opacity-50"
                                                title={img.lockAspectRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}
                                                disabled={resizing}
                                            >
                                                {img.lockAspectRatio ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                                            </button>
                                            <button
                                                onClick={() => resizeIndividual(index)}
                                                className="btn-primary text-sm py-2 px-3"
                                                disabled={resizing || (!img.customWidth || !img.customHeight)}
                                            >
                                                Resize
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {images.every(img => img.resized) && (
                                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                                    <button
                                        onClick={downloadAllImages}
                                        className="btn-primary"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download All
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

export default ImageResize;