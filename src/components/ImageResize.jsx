import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, Upload, Download, Image as ImageIcon, Lock, Unlock, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ImageResize = () => {
  const [images, setImages] = useState([]);
  const [resizing, setResizing] = useState(false);
  const [globalLockAspectRatio, setGlobalLockAspectRatio] = useState(true);

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
            lockAspectRatio: true
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
            1 // Preserve original quality
          );
        };
      };
    });
  };

  const resizeImages = async () => {
    setResizing(true);
    const resizedImages = await Promise.all(
      images.map(async (img) => ({
        ...img,
        resized: await resizeImage(img.original, img.width, img.height)
      }))
    );
    setImages(resizedImages);
    setResizing(false);
  };

  const downloadResizedImage = (resizedImage) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(resizedImage);
    link.download = `resized_${resizedImage.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWidthChange = (index, newWidth) => {
    setImages(prev => prev.map((img, i) => {
      if (i === index) {
        const updatedWidth = parseInt(newWidth);
        let updatedHeight = img.height;
        if (img.lockAspectRatio) {
          updatedHeight = Math.round(updatedWidth / img.aspectRatio);
        }
        return { ...img, width: updatedWidth, height: updatedHeight };
      }
      return img;
    }));
  };

  const handleHeightChange = (index, newHeight) => {
    setImages(prev => prev.map((img, i) => {
      if (i === index) {
        const updatedHeight = parseInt(newHeight);
        let updatedWidth = img.width;
        if (img.lockAspectRatio) {
          updatedWidth = Math.round(updatedHeight * img.aspectRatio);
        }
        return { ...img, height: updatedHeight, width: updatedWidth };
      }
      return img;
    }));
  };

  const toggleLockAspectRatio = (index) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, lockAspectRatio: !img.lockAspectRatio } : img
    ));
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleGlobalLockAspectRatio = () => {
    setGlobalLockAspectRatio(!globalLockAspectRatio);
    setImages(prev => prev.map(img => ({ ...img, lockAspectRatio: !globalLockAspectRatio })));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 to-purple-600 p-4">
      <Link to="/image-tools" className="text-white mb-4 flex items-center">
        <ArrowLeft className="mr-2" size={20} />
        Back to Image Tools
      </Link>
      <div className="bg-white bg-opacity-10 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg p-6 flex-grow overflow-y-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Image Resize</h1>
        
        <div {...getRootProps()} className="border-2 border-dashed border-white border-opacity-50 rounded-xl p-8 text-center cursor-pointer mb-6 transition-all duration-300 hover:border-opacity-100">
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-4 text-white" size={48} />
          <p className="text-white text-lg">
            {isDragActive ? "Drop the images here" : "Drag 'n' drop images here, or click to select"}
          </p>
        </div>

        {images.length > 0 && (
          <>
            <div className="flex flex-wrap items-center mb-6 gap-4">
              <button 
                onClick={toggleGlobalLockAspectRatio}
                className="bg-white bg-opacity-20 text-white p-2 rounded-lg flex items-center"
                title={globalLockAspectRatio ? "Unlock all aspect ratios" : "Lock all aspect ratios"}
              >
                {globalLockAspectRatio ? <Lock size={20} className="mr-2" /> : <Unlock size={20} className="mr-2" />}
                {globalLockAspectRatio ? "Unlock All" : "Lock All"}
              </button>
              <button 
                onClick={resizeImages}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full text-lg transition-all duration-300"
                disabled={resizing}
              >
                {resizing ? 'Resizing...' : 'Resize All Images'}
              </button>
            </div>
            <div className="space-y-6">
              {images.map((img, index) => (
                <div key={index} className="bg-white bg-opacity-20 rounded-xl p-4 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-semibold">{img.original.name}</h3>
                    <button
                      onClick={() => removeImage(index)}
                      className="text-red-500 hover:text-red-600"
                      title="Remove image"
                    >
                      <Trash2 size={20} />
                    </button>
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
                      <p className="text-white">Dimensions: {img.original.width} x {img.original.height}</p>
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
                          value={img.width}
                          onChange={(e) => handleWidthChange(index, e.target.value)}
                          className="bg-white bg-opacity-20 text-white placeholder-gray-300 rounded-lg px-2 py-1 w-20"
                        />
                        <span className="text-white">x</span>
                        <input
                          type="number"
                          value={img.height}
                          onChange={(e) => handleHeightChange(index, e.target.value)}
                          className="bg-white bg-opacity-20 text-white placeholder-gray-300 rounded-lg px-2 py-1 w-20"
                        />
                        <button 
                          onClick={() => toggleLockAspectRatio(index)}
                          className="bg-white bg-opacity-20 text-white p-1 rounded-lg"
                          title={img.lockAspectRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}
                        >
                          {img.lockAspectRatio ? <Lock size={16} /> : <Unlock size={16} />}
                        </button>
                      </div>
                      {img.resized && (
                        <>
                          <p className="text-white mt-2">Size: {(img.resized.size / 1024 / 1024).toFixed(2)} MB</p>
                          <button 
                            onClick={() => downloadResizedImage(img.resized)}
                            className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full text-sm transition-all duration-300"
                          >
                            Download
                          </button>
                        </>
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
  );
};

export default ImageResize;