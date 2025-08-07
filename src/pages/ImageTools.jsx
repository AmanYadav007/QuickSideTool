import React from "react";
import { Link } from "react-router-dom";
import { Image, Minimize2, ArrowLeft, FileText } from "lucide-react";

const ImageTools = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 text-white font-sans antialiased">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-blue-500/20 blur-3xl animate-blob-fade top-1/4 left-[15%] animation-delay-0"></div>
        <div className="absolute w-80 h-80 rounded-full bg-teal-500/20 blur-3xl animate-blob-fade top-[65%] left-[70%] animation-delay-2000"></div>
        <div className="absolute w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl animate-blob-fade top-[10%] left-[60%] animation-delay-4000"></div>
        <div className="absolute w-56 h-56 rounded-full bg-green-500/20 blur-3xl animate-blob-fade top-[80%] left-[20%] animation-delay-6000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center pt-8 pb-12">
        <div className="container mx-auto px-4 md:px-8 w-full max-w-6xl">
          {/* Back Button */}
          <Link
            to="/toolkit"
            className="inline-flex items-center px-5 py-2 mb-8 bg-white/10 text-white rounded-full 
                       hover:bg-white/20 transition-all duration-300 backdrop-blur-md border border-white/20 
                       hover:border-blue-400 transform hover:scale-105 shadow-md animate-fade-in-left"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back to Dashboard
          </Link>

          {/* Main Content Container */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 animate-fade-in-down">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 drop-shadow-md">
                Image Tools
              </h2>
              <p className="text-white text-opacity-90 text-lg">
                Professional tools to enhance and optimize your images with
                ease.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in-up animation-delay-500">
              <ToolCard
                to="/image-tools/resize"
                icon={<Image size={36} />}
                title="Image Resize"
                description="Resize single or multiple images while maintaining quality."
                gradientFrom="from-blue-500"
                gradientTo="to-cyan-500"
              />
              <ToolCard
                to="/image-tools/compress"
                icon={<Minimize2 size={36} />}
                title="Image Compressor"
                description="Reduce image file size without compromising quality."
                gradientFrom="from-teal-500"
                gradientTo="to-green-500"
              />
            </div>

            {/* Additional Info Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-xl animate-fade-in-up animation-delay-1000">
                <h3 className="text-xl font-bold text-white mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                  Features
                </h3>
                <ul className="space-y-2 text-white text-opacity-80 text-sm">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                    <span>
                      Batch Processing: Work on multiple images simultaneously,
                      saving you time and effort.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                    <span>
                      Quality Preservation: Advanced algorithms ensure minimal
                      quality loss during optimization.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                    <span>
                      Broad Compatibility: Supports a wide array of popular
                      image formats for flexible usage.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-xl animate-fade-in-up animation-delay-1200">
                <h3 className="text-xl font-bold text-white mb-3 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-green-300">
                  Supported Formats
                </h3>
                <ul className="space-y-2 text-white text-opacity-80 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mr-2"></div>
                    Raster Images: JPG, JPEG, PNG, BMP, GIF
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mr-2"></div>
                    Modern Formats: WebP
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mr-2"></div>
                    Vector Graphics: SVG
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
    className="group relative rounded-xl p-6 flex flex-col items-center text-center
               bg-white/5 backdrop-blur-md border border-white/15
               transform transition-all duration-300 ease-in-out
               hover:-translate-y-2 hover:shadow-xl hover:border-blue-400 overflow-hidden"
  >
    {/* Animated Gradient Border on Hover */}
    <div
      className={`absolute inset-0 rounded-xl border-2 border-transparent transition-all duration-300 ease-out 
                     group-hover:border-opacity-100 group-hover:border-gradient group-hover:${gradientFrom} group-hover:${gradientTo} pointer-events-none`}
    ></div>

    <div className="relative z-10 flex flex-col items-center">
      <div
        className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center text-white shadow-lg
                      bg-gradient-to-br ${gradientFrom} ${gradientTo}
                      transform transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-xl-active`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-teal-300 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm text-gray-300 leading-relaxed opacity-90">
        {description}
      </p>
    </div>
  </Link>
);

export default ImageTools;
