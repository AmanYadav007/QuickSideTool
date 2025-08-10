import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Image,
  QrCode,
  Github,
  Gamepad2,
  Unlock,
  Link as LinkIcon,
  FileType,
  Minus,
} from "lucide-react";
import { SpeedInsights } from "@vercel/speed-insights/react"
import AdSense from '../components/AdSense';

const Toolkit = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white font-sans antialiased">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-80 h-80 rounded-full bg-fuchsia-500 blur-3xl opacity-30 animate-float-slow top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-96 h-96 rounded-full bg-sky-500 blur-3xl opacity-30 animate-float-slow animation-delay-2000 bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute w-72 h-72 rounded-full bg-teal-500 blur-3xl opacity-30 animate-float-slow animation-delay-4000 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-60 h-60 rounded-full bg-indigo-500 blur-3xl opacity-30 animate-float-slow animation-delay-6000 top-1/3 right-1/3 transform translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="py-5 px-4 md:px-8 border-b border-white border-opacity-10 backdrop-blur-lg shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 hover:from-cyan-300 hover:to-fuchsia-300 transition-all duration-300 cursor-pointer">
              QUICK SIDE TOOL
            </Link>
            <div className="relative group">
              <a
                href="https://github.com/AmanYadav007/QuickSideTool"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-cyan-300 transition-colors duration-300 transform hover:scale-110"
              >
                <Github size={28} />
              </a>
              {/* Tooltip */}
              <div className="absolute right-0 top-full mt-3 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:-translate-y-1">
                <div className="bg-gray-800 text-white text-sm py-2 px-3 rounded-lg shadow-xl text-center border border-gray-700">
                  Contribute to Future Projects
                </div>
                <div className="absolute -top-1 right-5 w-3 h-3 bg-gray-800 transform rotate-45 border-t border-r border-gray-700"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 md:px-8 py-16 flex flex-col items-center justify-center text-center">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg animate-fade-in-up">
              Your Essential Digital Toolkit
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-500">
              Discover a suite of powerful, easy-to-use tools designed to boost
              your productivity and simplify daily tasks.
            </p>

            {/* Ad Section - Top of Tools */}
            <div className="mb-12 bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
              <AdSense 
                adSlot="3179433696" 
                position="horizontal"
                className="text-center"
                style={{ minHeight: '90px' }}
              />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <ToolCard
                to="/pdf-tool"
                icon={<FileText size={36} />}
                title="PDF Tools"
                description="Merge, split, and organize your PDF files with ease."
                gradientFrom="from-pink-500"
                gradientTo="to-purple-500"
              />
              <ToolCard
                to="/unlock-pdf"
                icon={<Unlock size={36} />}
                title="PDF Unlocker"
                description="Secure or remove password protection from your PDFs."
                gradientFrom="from-blue-500"
                gradientTo="to-cyan-500"
              />
              <ToolCard
                to="/image-tools"
                icon={<Image size={36} />}
                title="Image Tools"
                description="Resize, compress, and convert images for any purpose."
                gradientFrom="from-green-500"
                gradientTo="to-teal-500"
              />

              <ToolCard
                to="/file-converter"
                icon={<FileType size={36} />}
                title="File Converter"
                description="Convert PDFs to Word/Excel with Adobe quality."
                gradientFrom="from-orange-500"
                gradientTo="to-red-500"
              />
              <ToolCard
                to="/pdf-compressor"
                icon={<Minus size={36} />}
                title="PDF Compressor"
                description="Reduce PDF file size while maintaining quality."
                gradientFrom="from-blue-500"
                gradientTo="to-cyan-500"
              />
              <ToolCard
                to="/qr-tool"
                icon={<QrCode size={36} />}
                title="QR Code Generator"
                description="Generate custom QR codes for links, text, and more."
                gradientFrom="from-cyan-500"
                gradientTo="to-blue-500"
              />
            <ToolCard
                to="/pdf-link-remove"
                icon={<LinkIcon size={36} />}
                title="PDF Link Remover"
                description="Efficiently remove hyperlinks from PDF documents."
                gradientFrom="from-purple-500"
                gradientTo="to-pink-500"
              />
              <ToolCard
                to="/diamond-mines"
                icon={<Gamepad2 size={32} />}
                title="Diamond Quest"
                description="Fun mini-game for stress relief"
                gradientFrom="from-indigo-500"
                gradientTo="to-purple-500"
              />
            </div>
                      </div>

            {/* Ad Section - Bottom of Tools */}
            <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
              <AdSense 
                adSlot="1427545936" 
                position="horizontal"
                className="text-center"
                style={{ minHeight: '90px' }}
              />
          </div>
           <SpeedInsights />
        </main>

        {/* Footer */}
        <footer className="py-5 px-4 md:px-8 border-t border-white border-opacity-10 backdrop-blur-lg mt-12">
          <div className="container mx-auto text-center text-gray-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} All rights reserved&nbsp;
              <a
                href="https://aguider.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors font-semibold"
              >
                Aman Yadav
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

const ToolCard = ({
  to,
  icon,
  title,
  description,
  gradientFrom,
  gradientTo,
}) => (
  <Link
    to={to}
    className="group relative rounded-2xl p-7 flex flex-col items-center text-center
               bg-white bg-opacity-5 backdrop-filter backdrop-blur-md border border-white border-opacity-20
               transform transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl-custom
               hover:bg-opacity-10 overflow-hidden animate-fade-in-up"
  >
    {/* Animated Gradient Border on Hover */}
    <div
      className={`absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-500 ease-out group-hover:border-opacity-100 group-hover:border-gradient group-hover:${gradientFrom} group-hover:${gradientTo} pointer-events-none`}
    ></div>

    <div className="relative z-10 flex flex-col items-center">
      <div
        className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center text-white shadow-xl
                      bg-gradient-to-br ${gradientFrom} ${gradientTo}
                      transform transition-all duration-500 ease-out group-hover:scale-110 group-hover:shadow-2xl-active`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-fuchsia-300 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm text-gray-300 leading-relaxed opacity-90">
        {description}
      </p>
    </div>
  </Link>
);

export default Toolkit;
