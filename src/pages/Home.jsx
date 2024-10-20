import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Image, QrCode, FileSymlink } from 'lucide-react';

const Home = () => {
  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 animate-gradient-x">
      <div className="absolute inset-0 bg-snow"></div>
      <div className="relative z-10 flex flex-col h-full">
        <header className="bg-white bg-opacity-10 text-white p-3 shadow-md backdrop-blur-md">
          <h1 className="text-xl font-bold">QUICK SIDE TOOL</h1>
        </header>
        <main className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-blue-300">
          <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-2 text-center text-white text-shadow-frost">Your Digital Toolkit</h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <ToolCard to="/pdf-tool" icon={<FileText size={32} />} title="PDF Tools" />
              <ToolCard to="/image-tools" icon={<Image size={32} />} title="Image Tools" />
              <ToolCard to="/qr-tool" icon={<QrCode size={32} />} title="QR Code Generator" />
              <ToolCard to="/convert-tool" icon={<FileSymlink size={32} />} title="Format Converter" />
            </div>
          </div>
        </main>
        <footer className="bg-white bg-opacity-10 text-center p-2 backdrop-blur-md">
          <p className="text-xs text-white">&copy; 2024 All rights reserved <a href='https://aguider.in/' target='_blank' rel="noopener noreferrer" className="underline">AGuider</a></p>
        </footer>
      </div>
    </div>
  );
};

const ToolCard = ({ to, icon, title }) => (
  <Link to={to} className="flex flex-col items-center p-4 bg-white bg-opacity-20 rounded-lg shadow-frost transition-all duration-300 backdrop-blur-sm hover:bg-opacity-30 hover:shadow-frost-hover">
    <div className="w-12 h-12 mb-2 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-white">
      {icon}
    </div>
    <span className="text-sm font-medium text-white text-shadow-frost text-center">{title}</span>
  </Link>
);

export default Home;