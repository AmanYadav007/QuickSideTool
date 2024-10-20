import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Image, QrCode, FileSymlink } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 animate-gradient-x">
      <div className="absolute inset-0 bg-snow"></div>
      <div className="relative z-10 flex-grow flex flex-col">
        <header className="bg-white bg-opacity-10 text-white p-4 shadow-md backdrop-blur-md">
          <h1 className="text-2xl font-bold">QUICK SIDE TOOL</h1>
        </header>
        <main className="flex-grow container mx-auto p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-2 text-center text-white text-shadow-frost">Your Digital Toolkit</h2>
            <p className="text-xl text-center text-white mb-12 text-shadow-frost"></p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ToolCard to="/pdf-tool" icon={<FileText size={32} />} title="PDF Tools" />
            <ToolCard to="/image-tools" icon={<Image size={32} />} title="Image Tools" />
              <ToolCard to="/qr-tool" icon={<QrCode size={32} />} title="QR Code Generator" />
              <ToolCard to="/convert-tool" icon={<FileSymlink size={32} />} title="Format Converter" />
            </div>
          </div>
        </main>
        <footer className="bg-white bg-opacity-10 text-center p-4 backdrop-blur-md">
          <p className="text-sm text-white">&copy; 2024 All rights reserved <a href='https://aguider.in/' target='_blank' rel="noopener noreferrer" className="underline">AGuider</a></p>
        </footer>
      </div>
    </div>
  );
};

const ToolCard = ({ to, icon, title }) => (
  <Link to={to} className="flex items-center p-6 bg-white bg-opacity-20 rounded-xl shadow-frost transition-all duration-300 backdrop-blur-lg hover:bg-opacity-30 hover:shadow-frost-hover">
    <div className="w-16 h-16 mr-4 bg-white bg-opacity-30 rounded-xl flex items-center justify-center text-white">
      {icon}
    </div>
    <span className="text-lg font-medium text-white text-shadow-frost">{title}</span>
  </Link>
);

export default Home;