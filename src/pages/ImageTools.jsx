import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Minimize2, ArrowLeft } from 'lucide-react';

const ImageTools = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600">
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center mb-6 px-4 py-2 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-all duration-300 backdrop-filter backdrop-blur-sm"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Home
        </Link>
        
        <div className="bg-white bg-opacity-10 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-6">Image Tools</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ToolCard to="/image-tools/resize" icon={<Image size={32} />} title="Image Resize" />
            <ToolCard to="/image-tools/compress" icon={<Minimize2 size={32} />} title="Image Compressor" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolCard = ({ to, icon, title }) => (
  <Link to={to} className="flex items-center p-6 bg-white bg-opacity-20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm hover:bg-opacity-30">
    <div className="w-16 h-16 mr-4 bg-white bg-opacity-30 rounded-xl flex items-center justify-center text-white">
      {icon}
    </div>
    <span className="text-lg font-medium text-white">{title}</span>
  </Link>
);

export default ImageTools;