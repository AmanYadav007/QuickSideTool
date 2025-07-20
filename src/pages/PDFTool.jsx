import React from 'react';
import PDFManipulator from '../components/PDFManipulator';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PDFTool = () => {
  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white font-sans antialiased relative">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 rounded-full bg-sky-400/30 blur-3xl animate-blob top-1/4 left-[15%] mix-blend-lighten"></div>
        <div className="absolute w-80 h-80 rounded-full bg-purple-400/30 blur-3xl animate-blob animation-delay-2000 top-[65%] left-[70%] mix-blend-lighten"></div>
        <div className="absolute w-72 h-72 rounded-full bg-emerald-400/30 blur-3xl animate-blob animation-delay-4000 top-[10%] left-[60%] mix-blend-lighten"></div>
        <div className="absolute w-56 h-56 rounded-full bg-cyan-400/30 blur-3xl animate-blob animation-delay-6000 top-[80%] left-[20%] mix-blend-lighten"></div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/toolkit" 
          className="inline-flex items-center mb-6 px-4 py-2 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-all duration-300 backdrop-filter backdrop-blur-sm"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Dashboard
        </Link>
        <PDFManipulator />
         
      </div>
  
    </div>

    
  );
};

export default PDFTool;