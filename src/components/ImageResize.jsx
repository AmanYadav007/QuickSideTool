import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, Upload, Download, Image as ImageIcon, Lock, Unlock, Trash2, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import JSZip from 'jszip';

const ImageResize = () => {
  const [images, setImages] = useState([]);
  const [resizing, setResizing] = useState(false);
  const [globalLockAspectRatio, setGlobalLockAspectRatio] = useState(true);
  const [commonWidth, setCommonWidth] = useState('');
  const [commonHeight, setCommonHeight] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map(file => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            original: file,
            resized: null,
            width: img.width,
            height: img.height,
            aspectRatio: img.width / img.height,
            lockAspectRatio: true,
            customWidth: img.width,
            customHeight: img.height
          });
        };
        img.src = URL.createObjectURL(file);
      });
    });

    Promise.all(newImages).then(resolvedImages => {
      setImages(prev => [...prev, ...resolvedImages]);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': ['.png', '.jpg', '.jpeg']},
    multiple: true
  });

  const resizeImage = async (imageFile, newWidth, newHeight) => {
    return new Promise((resolve) => {
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
          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], imageFile.name, {
                type: imageFile.type,
                lastModified: Date.now()
              }));
            },
            imageFile.type,
            1
          );
        };
      };
    });
  };

  const resizeImages = async () => {
    if (!commonWidth || !commonHeight) {
      alert('Please set both width and height');
      return;
    }
    setResizing(true);
    const resizedImages = await Promise.all(
      images.map(async (img) => ({
        ...img,
        width: parseInt(commonWidth),
        height: parseInt(commonHeight),
        resized: await resizeImage(img.original, parseInt(commonWidth), parseInt(commonHeight))
      }))
    );
    setImages(resizedImages);
    setResizing(false);
  };

  const resizeAll = async () => {
    if (!commonWidth || !commonHeight) {
      alert('Please set both width and height');
      return;
    }
    setResizing(true);
    try {
      const resizedImages = await Promise.all(
        images.map(async (img) => ({
          ...img,
          width: parseInt(commonWidth),
          height: parseInt(commonHeight),
          customWidth: parseInt(commonWidth),
          customHeight: parseInt(commonHeight),
          resized: await resizeImage(img.original, parseInt(commonWidth), parseInt(commonHeight))
        }))
      );
      setImages(resizedImages);
    } catch (error) {
      console.error('Error resizing images:', error);
      alert('There was an error resizing the images');
    } finally {
      setResizing(false);
    }
  };

  const resizeIndividual = async (index) => {
    const img = images[index];
    if (!img.customWidth || !img.customHeight) {
      alert('Please set both width and height');
      return;
    }

    setResizing(true);
    try {
      const resizedImage = await resizeImage(img.original, img.customWidth, img.customHeight);
      setImages(prev => prev.map((item, i) => 
        i === index ? {
          ...item,
          width: img.customWidth,
          height: img.customHeight,
          resized: resizedImage
        } : item
      ));
    } catch (error) {
      console.error('Error resizing image:', error);
      alert('There was an error resizing the image');
    } finally {
      setResizing(false);
    }
  };

  const handleIndividualWidthChange = (index, newWidth) => {
    setImages(prev => prev.map((img, i) => {
      if (i === index) {
        let updatedHeight = img.customHeight;
        if (img.lockAspectRatio) {
          updatedHeight = Math.round(newWidth / img.aspectRatio);
        }
        return {
          ...img,
          customWidth: parseInt(newWidth),
          customHeight: updatedHeight
        };
      }
      return img;
    }));
  };

  const handleIndividualHeightChange = (index, newHeight) => {
    setImages(prev => prev.map((img, i) => {
      if (i === index) {
        let updatedWidth = img.customWidth;
        if (img.lockAspectRatio) {
          updatedWidth = Math.round(newHeight * img.aspectRatio);
        }
        return {
          ...img,
          customHeight: parseInt(newHeight),
          customWidth: updatedWidth
        };
      }
      return img;
    }));
  };

  const toggleIndividualLockAspectRatio = (index) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, lockAspectRatio: !img.lockAspectRatio } : img
    ));
  };

  const applyCommonSizeToIndividual = (index) => {
    if (!commonWidth || !commonHeight) {
      alert('Please set common width and height first');
      return;
    }
    handleIndividualWidthChange(index, commonWidth);
    handleIndividualHeightChange(index, commonHeight);
  };

  const downloadAllImages = () => {
    if (!images.every(img => img.resized)) {
      alert('Please resize images first');
      return;
    }

    // Create a zip folder using JSZip
    const zip = new JSZip();
    images.forEach(img => {
      zip.file(`resized_${img.resized.name}`, img.resized);
    });

    // Generate and download zip file
    zip.generateAsync({ type: 'blob' }).then(content => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'resized_images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleCommonWidthChange = (newWidth) => {
    setCommonWidth(newWidth);
    if (globalLockAspectRatio && images.length > 0) {
      // Use the aspect ratio of the first image as reference
      const aspectRatio = images[0].aspectRatio;
      setCommonHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleCommonHeightChange = (newHeight) => {
    setCommonHeight(newHeight);
    if (globalLockAspectRatio && images.length > 0) {
      // Use the aspect ratio of the first image as reference
      const aspectRatio = images[0].aspectRatio;
      setCommonWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 to-purple-600 p-4">
        <div className="container mx-auto px-4 py-8">
      <Link 
            to="/image-tools" 
            className="inline-flex items-center px-6 py-2 mb-8 bg-white bg-opacity-10 text-white rounded-full hover:bg-opacity-20 transition-all duration-300 backdrop-blur-md border border-white border-opacity-20"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back To Image Tool
          </Link>
        
      <div className="bg-white bg-opacity-10 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg p-6 flex-grow overflow-y-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Batch Image Resize</h1>
        
        <div {...getRootProps()} className="border-2 border-dashed border-white border-opacity-50 rounded-xl p-8 text-center cursor-pointer mb-6 transition-all duration-300 hover:border-opacity-100">
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-4 text-white" size={48} />
          <p className="text-white text-lg">
            {isDragActive ? "Drop the images here" : "Drag 'n' drop images here, or click to select"}
          </p>
        </div>

        {images.length > 0 && (
        <>
          {/* Common Size Controls */}
          <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-6">
            <h2 className="text-white text-xl font-semibold mb-4">Common Size Settings</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={commonWidth}
                  onChange={(e) => handleCommonWidthChange(e.target.value)}
                  placeholder="Width"
                  className="bg-white bg-opacity-20 text-white placeholder-gray-300 rounded-lg px-2 py-1 w-24"
                />
                <span className="text-white">x</span>
                <input
                  type="number"
                  value={commonHeight}
                  onChange={(e) => handleCommonHeightChange(e.target.value)}
                  placeholder="Height"
                  className="bg-white bg-opacity-20 text-white placeholder-gray-300 rounded-lg px-2 py-1 w-24"
                />
                <button 
                  onClick={() => setGlobalLockAspectRatio(!globalLockAspectRatio)}
                  className="bg-white bg-opacity-20 text-white p-2 rounded-lg"
                  title={globalLockAspectRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}
                >
                  {globalLockAspectRatio ? <Lock size={16} /> : <Unlock size={16} />}
                </button>
              </div>
              <button 
                onClick={resizeAll}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full text-lg transition-all duration-300"
                disabled={resizing}
              >
                {resizing ? 'Resizing...' : 'Resize All'}
              </button>
              <button 
                onClick={downloadAllImages}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full text-lg transition-all duration-300"
                disabled={!images.every(img => img.resized)}
              >
                Download All
              </button>
            </div>
          </div>

          {/* Image Cards with Individual Controls */}
          <div className="space-y-6">
            {images.map((img, index) => (
              <div key={index} className="bg-white bg-opacity-20 rounded-xl p-4 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-semibold">{img.original.name}</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => applyCommonSizeToIndividual(index)}
                      className="text-white hover:text-blue-200"
                      title="Copy common size"
                    >
                      <Copy size={20} />
                    </button>
                    <button
                      onClick={() => removeImage(index)}
                      className="text-red-500 hover:text-red-600"
                      title="Remove image"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <p className="text-white mb-2">Original</p>
                    <div className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={URL.createObjectURL(img.original)} 
                        alt="Original" 
                        className="absolute w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-white mt-2">Size: {(img.original.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p className="text-white">Original Dimensions: {img.width} x {img.height}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-white mb-2">Resized</p>
                    <div className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
                      {img.resized ? (
                        <img 
                          src={URL.createObjectURL(img.resized)} 
                          alt="Resized" 
                          className="absolute w-full h-full object-contain"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon size={48} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center mt-2 space-x-2">
                      <input
                        type="number"
                        value={img.customWidth}
                        onChange={(e) => handleIndividualWidthChange(index, e.target.value)}
                        className="bg-white bg-opacity-20 text-white placeholder-gray-300 rounded-lg px-2 py-1 w-20"
                      />
                      <span className="text-white">x</span>
                      <input
                        type="number"
                        value={img.customHeight}
                        onChange={(e) => handleIndividualHeightChange(index, e.target.value)}
                        className="bg-white bg-opacity-20 text-white placeholder-gray-300 rounded-lg px-2 py-1 w-20"
                      />
                      <button 
                        onClick={() => toggleIndividualLockAspectRatio(index)}
                        className="bg-white bg-opacity-20 text-white p-1 rounded-lg"
                        title={img.lockAspectRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}
                      >
                        {img.lockAspectRatio ? <Lock size={16} /> : <Unlock size={16} />}
                      </button>
                      <button 
                        onClick={() => resizeIndividual(index)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg text-sm transition-all duration-300"
                        disabled={resizing}
                      >
                        Resize
                      </button>
                    </div>
                    {img.resized && (
                      <p className="text-white mt-2">Size: {(img.resized.size / 1024 / 1024).toFixed(2)} MB</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
    </div>
    </div>
  );
};

export default ImageResize;