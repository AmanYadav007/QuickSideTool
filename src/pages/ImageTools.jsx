import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Minimize2, ArrowLeft, FileText } from 'lucide-react';

const ImageTools = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute w-96 h-96 -top-48 -right-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute w-96 h-96 -bottom-48 -left-48 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-2 mb-8 bg-white bg-opacity-10 text-white rounded-full hover:bg-opacity-20 transition-all duration-300 backdrop-blur-md border border-white border-opacity-20"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </Link>
          
          {/* Main Content Container */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-2">Image Tools</h2>
              <p className="text-white text-opacity-90">
                Professional tools to enhance and optimize your images
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ToolCard 
                to="/image-tools/resize" 
                icon={<Image size={32} />} 
                title="Image Resize"
                description="Resize single or multiple images while maintaining quality"
              />
              <ToolCard 
                to="/image-tools/compress" 
                icon={<Minimize2 size={32} />} 
                title="Image Compressor"
                description="Reduce image file size without compromising quality"
              />
            </div>

            {/* Additional Info Section */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
                <h3 className="text-xl font-semibold text-white mb-3">Features</h3>
                <ul className="space-y-2 text-white text-opacity-90">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mr-2"></div>
                    Batch processing support
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mr-2"></div>
                    Preserve image quality
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mr-2"></div>
                    Multiple format support
                  </li>
                </ul>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
                <h3 className="text-xl font-semibold text-white mb-3">Supported Formats</h3>
                <ul className="space-y-2 text-white text-opacity-90">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-300 rounded-full mr-2"></div>
                    JPG, JPEG, PNG
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-300 rounded-full mr-2"></div>
                    WebP, GIF
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-300 rounded-full mr-2"></div>
                    SVG, BMP
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolCard = ({ to, icon, title, description }) => (
  <Link 
    to={to} 
    className="group relative bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 hover:bg-opacity-20 hover:transform hover:-translate-y-1 hover:shadow-2xl border border-white border-opacity-20"
  >
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-white group-hover:bg-opacity-30 transition-all duration-300">
        {icon}
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-white text-opacity-80">{description}</p>
      </div>
    </div>
    
    {/* Hover indicator */}
    <div className="absolute bottom-4 right-4 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
      <div className="text-white">
        →
      </div>
    </div>
  </Link>
);

export default ImageTools;