import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, Upload, Download, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import JSZip from 'jszip';

const ImageCompressor = () => {
  const [images, setImages] = useState([]);
  const [quality, setQuality] = useState(70);
  const [compressing, setCompressing] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map(file => ({
      original: file,
      compressed: null,
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': ['.png', '.jpg', '.jpeg']},
    multiple: true
  });

  const compressImage = async (imageFile) => {
    return new Promise((resolve) => {
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
          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], imageFile.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              }));
            },
            'image/jpeg',
            quality / 100
          );
        };
      };
    });
  };

  const compressImages = async () => {
    setCompressing(true);
    const compressedImages = await Promise.all(
      images.map(async (img) => ({
        ...img,
        compressed: await compressImage(img.original)
      }))
    );
    setImages(compressedImages);
    setCompressing(false);
  };

  const downloadCompressedImage = (compressedImage) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedImage);
    link.download = `compressed_${compressedImage.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllCompressedImages = async () => {
    const zip = new JSZip();
    images.forEach((img, index) => {
      if (img.compressed) {
        zip.file(`compressed_${img.compressed.name}`, img.compressed);
      }
    });
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = "compressed_images.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <h1 className="text-3xl font-bold text-white mb-6">Image Compressor</h1>
        
        <div {...getRootProps()} className="border-2 border-dashed border-white border-opacity-50 rounded-xl p-8 text-center cursor-pointer mb-6 transition-all duration-300 hover:border-opacity-100">
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-4 text-white" size={48} />
          <p className="text-white text-lg">
            {isDragActive ? "Drop the image(s) here" : "Drag 'n' drop image(s) here, or click to select"}
          </p>
        </div>

        {images.length > 0 && (
          <>
            <div className="flex items-center mb-6">
              <span className="text-white mr-4 text-lg">Quality:</span>
              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full"
              />
              <span className="text-white ml-4 text-lg">{quality}%</span>
            </div>
            <div className="flex flex-wrap gap-4 mb-6">
              <button 
                onClick={compressImages}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300"
                disabled={compressing}
              >
                {compressing ? 'Compressing...' : 'Compress Images'}
              </button>
              {images.filter(img => img.compressed).length > 1 && (
                <button 
                  onClick={downloadAllCompressedImages}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300"
                >
                  Download All Compressed
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {images.map((img, index) => (
                <div key={index} className="bg-white bg-opacity-20 rounded-xl p-4 shadow-lg">
                  <h3 className="text-white font-semibold mb-2">{img.original.name}</h3>
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
                    </div>
                    <div className="flex-1">
                      <p className="text-white mb-2">Compressed</p>
                      <div className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
                        {img.compressed ? (
                          <img 
                            src={URL.createObjectURL(img.compressed)} 
                            alt="Compressed" 
                            className="absolute w-full h-full object-contain"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon size={48} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      {img.compressed && (
                        <>
                          <p className="text-white mt-2">Size: {(img.compressed.size / 1024 / 1024).toFixed(2)} MB</p>
                          <p className="text-white">
                            Reduction: {((1 - img.compressed.size / img.original.size) * 100).toFixed(0)}%
                          </p>
                          <button 
                            onClick={() => downloadCompressedImage(img.compressed)}
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
    </div>
  );
};

export default ImageCompressor;