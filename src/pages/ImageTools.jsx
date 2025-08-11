import React from "react";
import SEO from "../components/SEO";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { Image, Minimize2, ArrowLeft, FileText, Info, HelpCircle, CheckCircle, AlertCircle } from "lucide-react";

const ImageTools = () => {
  return (
    <Layout>
      <SEO
        title="Free Image Tools – Compress, Resize, Convert"
        description="Quick image utilities for creators and students. Compress JPG/PNG/WebP, resize to exact pixels, convert formats. Free and private."
        url="https://quicksidetool.com/image-tools"
      />

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

            {/* About Image Tools Section */}
            <div className="mt-12 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl animate-fade-in-up animation-delay-1000">
              <div className="flex items-center gap-3 mb-6">
                <Info className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold text-white text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                  About Image Tools
                </h3>
              </div>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  Our comprehensive image processing suite provides professional-grade tools for optimizing and enhancing your digital images. Whether you're a web developer, content creator, or business professional, our tools help you achieve the perfect balance between image quality and file size.
                </p>
                <p>
                  Image optimization is crucial for modern web development and digital content creation. Large image files can slow down website loading times, consume excessive storage space, and create poor user experiences. Our advanced algorithms ensure that your images maintain their visual appeal while being optimized for their intended use.
                </p>
                <p>
                  From social media posts to professional presentations, our image tools support a wide range of use cases. The batch processing capabilities allow you to handle multiple images simultaneously, saving valuable time and ensuring consistency across your entire image library.
                </p>
              </div>
            </div>

            {/* How-To Guide Section */}
            <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl animate-fade-in-up animation-delay-1200">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-green-400" />
                <h3 className="text-2xl font-bold text-white text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-300">
                  How to Use Our Image Tools
                </h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Image Resizing Guide</h4>
                  <div className="space-y-3 text-white/80">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">1</div>
                      <div>
                        <p className="font-medium text-white">Upload Your Images</p>
                        <p className="text-sm">Drag and drop your images into the upload area or click to browse and select files. Our tool supports multiple image formats including JPG, PNG, WebP, and more.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">2</div>
                      <div>
                        <p className="font-medium text-white">Set Dimensions</p>
                        <p className="text-sm">Choose your desired width and height. You can maintain aspect ratio automatically, or specify custom dimensions for each image.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">3</div>
                      <div>
                        <p className="font-medium text-white">Choose Quality Settings</p>
                        <p className="text-sm">Select the quality level that best suits your needs. Higher quality preserves more detail but results in larger file sizes.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">4</div>
                      <div>
                        <p className="font-medium text-white">Download Results</p>
                        <p className="text-sm">Preview your resized images and download them individually or as a batch. All processed images maintain their original quality standards.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Image Compression Guide</h4>
                  <div className="space-y-3 text-white/80">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">1</div>
                      <div>
                        <p className="font-medium text-white">Select Images</p>
                        <p className="text-sm">Upload the images you want to compress. Our tool can handle multiple images simultaneously for batch processing.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">2</div>
                      <div>
                        <p className="font-medium text-white">Adjust Compression Level</p>
                        <p className="text-sm">Use the slider to set your desired compression level. See real-time previews of file size reduction and quality changes.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">3</div>
                      <div>
                        <p className="font-medium text-white">Compare Results</p>
                        <p className="text-sm">View side-by-side comparisons of original and compressed images to ensure quality meets your standards.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">4</div>
                      <div>
                        <p className="font-medium text-white">Download Optimized Images</p>
                        <p className="text-sm">Download your compressed images individually or as a ZIP file. All images are optimized for web use while maintaining visual quality.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl animate-fade-in-up animation-delay-1400">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold text-white text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                  Frequently Asked Questions
                </h3>
              </div>
              
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-2">What image formats are supported?</h4>
                  <p className="text-white/80">Our tools support all major image formats including JPG, JPEG, PNG, WebP, BMP, GIF, and SVG. We recommend using WebP for web applications as it provides excellent compression while maintaining quality.</p>
                </div>
                
                <div className="border-b border-white/10 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-2">How does the compression affect image quality?</h4>
                  <p className="text-white/80">Our compression algorithm uses advanced techniques to minimize quality loss. You can adjust the compression level to find the perfect balance between file size and visual quality. Most users find that 70-80% quality provides excellent results.</p>
                </div>
                
                <div className="border-b border-white/10 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Can I process multiple images at once?</h4>
                  <p className="text-white/80">Yes! Both our resize and compression tools support batch processing. You can upload multiple images and process them all simultaneously, saving significant time and ensuring consistent results across your entire image library.</p>
                </div>
                
                <div className="border-b border-white/10 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-2">What's the maximum file size I can upload?</h4>
                  <p className="text-white/80">You can upload images up to 50MB each. For larger files, we recommend compressing them first or splitting them into smaller batches. This limit ensures fast processing and optimal performance for all users.</p>
                </div>
                
                <div className="border-b border-white/10 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Are my images secure when uploaded?</h4>
                  <p className="text-white/80">Absolutely. We take security seriously. All uploaded images are processed securely and automatically deleted from our servers after 10 minutes. We never store or share your images, and all processing happens in a secure environment.</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Which tool should I use for web optimization?</h4>
                  <p className="text-white/80">For web optimization, we recommend using both tools in sequence: first resize your images to the appropriate dimensions for your website, then compress them to reduce file size. This approach ensures fast loading times while maintaining visual quality.</p>
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-xl animate-fade-in-up animation-delay-1600">
                <h3 className="text-xl font-bold text-white mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                  Features
                </h3>
                <ul className="space-y-2 text-white text-opacity-80 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Batch Processing: Work on multiple images simultaneously,
                      saving you time and effort.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Quality Preservation: Advanced algorithms ensure minimal
                      quality loss during optimization.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Broad Compatibility: Supports a wide array of popular
                      image formats for flexible usage.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Real-time Preview: See changes instantly as you adjust settings.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Secure Processing: All files are processed securely and deleted automatically.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-xl animate-fade-in-up animation-delay-1800">
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
                    Modern Formats: WebP, AVIF
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mr-2"></div>
                    Vector Graphics: SVG
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mr-2"></div>
                    Professional Formats: TIFF, RAW
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
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
