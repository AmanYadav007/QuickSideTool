import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Image, QrCode, Github, Gamepad2, Unlock, Link as LinkIcon } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute w-96 h-96 -top-48 -right-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute w-96 h-96 -bottom-48 -left-48 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">QUICK SIDE TOOL</h1>
            <div className="relative group">
              <a 
                href="https://github.com/AmanYadav007/QuickSideTool" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-blue-200 transition-colors"
              >
                <Github size={24} />
              </a>
              {/* Tooltip */}
              <div className="absolute right-0 -bottom-12 w-36 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:-translate-y-1">
                <div className="bg-white bg-opacity-90 text-gray-800 text-sm py-1 px-2 rounded shadow-lg backdrop-blur-sm">
                  Contribute to Future
                </div>
                {/* Arrow */}
                <div className="absolute -top-1 right-3 w-2 h-2 bg-white bg-opacity-90 transform rotate-45"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-2">
            Your Digital ToolBox
          </h2>
          <p className="text-center text-white text-opacity-90 mb-12">
            Powerful tools to enhance your productivity
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Existing ToolCards */}
            <ToolCard 
              to="/pdf-tool" 
              icon={<FileText size={32} />} 
              title="PDF Tools"
              description="Merge, split, and organize your PDF files"
            />
            
             <ToolCard 
              to="/unlock-pdf" 
              icon={<Unlock size={32} />} 
              title="Unlock & Lock PDF"
              description="unlock and Lock password protection from PDFs"
            />
            <ToolCard 
              to="/image-tools" 
              icon={<Image size={32} />} 
              title="Image Tools"
              description="Resize, compress, and convert images"
            />
              <ToolCard 
              to="/pdf-link-remove" 
              icon={<LinkIcon size={32} />} 
              title="PDF Link Remove"
              description="Remove links from PDF documents"
            />
            <ToolCard 
              to="/qr-tool" 
              icon={<QrCode size={32} />} 
              title="QR Code Generator"
              description="Create custom QR codes instantly"
            />
            <ToolCard 
              to="/game" 
              icon={<Gamepad2 size={32} />} 
              title="Have Fun"
              description="Remove Your Stress"
              className="button"
            />
          </div>
        </div>
      </main>

        {/* Footer */}
        <footer className="bg-white bg-opacity-10 backdrop-blur-md border-t border-white border-opacity-20">
          <div className="container mx-auto px-4 py-4">
            <div className="text-center text-white text-sm">
              <p>&copy; 2025 All rights reserved&nbsp;
                <a 
                  href='https://aguider.in/' 
                  target='_blank' 
                  rel="noopener noreferrer" 
                  className="text-blue-200 hover:text-blue-100 transition-colors"
                >
                  Aman Yadav
                </a>
              </p>
            </div>
          </div>
        </footer>
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
      <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-white group-hover:bg-opacity-30 transition-all duration-300">
        {icon}
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-white text-opacity-80">{description}</p>
      </div>
    </div>
  </Link>
);
export default Home;