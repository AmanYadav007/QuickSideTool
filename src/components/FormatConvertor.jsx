import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';

const FormatConvertor = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 to-purple-600 p-4">
      <Link to="/" className="text-white mb-4 flex items-center">
        <ArrowLeft className="mr-2" size={20} />
        Back to Home
      </Link>
      <div className="bg-white bg-opacity-10 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg p-6 flex-grow flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-white mb-6">Format Convertor</h1>
        <div className="flex flex-col items-center">
          <Clock className="text-white mb-4" size={64} />
          <p className="text-xl text-white text-center">
            Coming Soon...
          </p>
          <p className="text-md text-white text-center mt-2">
            We're working hard to bring you an amazing Format Convertor tool.
          </p>
          <p className="text-md text-white text-center mt-2">
            Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormatConvertor;