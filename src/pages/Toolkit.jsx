import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import {
  FileText,
  Image,
  QrCode,
  Link as LinkIcon,
  FileType,
  Minus,
} from "lucide-react";
import { SpeedInsights } from "@vercel/speed-insights/react"

const Toolkit = () => {
  return (
    <Layout>

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
                description="Convert PDFs to Word and Excel documents with advanced formatting."
                gradientFrom="from-orange-500"
                gradientTo="to-red-500"
              />
              <ToolCard
                to="/pdf-compressor"
                icon={<Minus size={36} />}
                title="PDF Compressor"
                description="Reduce PDF file size while maintaining quality and readability."
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

          <SpeedInsights />
        </main>

    </Layout>
  );
};

const ToolCard = ({
  to,
  icon,
  title,
  description,
  gradientFrom,
  gradientTo,
  disabled = false,
}) => {
  const inner = (
    <div
      className={`group relative rounded-2xl p-7 flex flex-col items-center text-center
                 bg-white bg-opacity-5 backdrop-filter backdrop-blur-md border border-white border-opacity-20
                 transform transition-all duration-500 ease-out overflow-hidden animate-fade-in-up
                 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-2 hover:shadow-2xl-custom hover:bg-opacity-10'}`}
    >
      <div
        className={`absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-500 ease-out ${disabled ? '' : `group-hover:border-opacity-100 group-hover:border-gradient group-hover:${gradientFrom} group-hover:${gradientTo}`} pointer-events-none`}
      ></div>

      {disabled && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-white/10 border border-white/20 rounded-md text-xs text-white">
          Coming soon
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center">
        <div
          className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center text-white shadow-xl
                        bg-gradient-to-br ${gradientFrom} ${gradientTo}
                        transform transition-all duration-500 ease-out ${disabled ? '' : 'group-hover:scale-110 group-hover:shadow-2xl-active'}`}
        >
          {icon}
        </div>
        <h3 className={`text-xl font-bold text-white mb-2 ${disabled ? '' : 'group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-fuchsia-300'} transition-colors duration-300`}>
          {title}
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed opacity-90">
          {description}
        </p>
      </div>
    </div>
  );

  return disabled ? inner : (
    <Link to={to}>
      {inner}
    </Link>
  );
};

export default Toolkit;
