import React from 'react';
import PDFManipulator from '../components/PDFManipulator';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PDFTool = () => {
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
        <PDFManipulator />
        
      </div>
    </div>

    
  );
};

export default PDFTool;