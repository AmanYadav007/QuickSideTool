import React from 'react';
import PDFManipulator from '../components/PDFManipulator';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Info, HelpCircle, CheckCircle, Users, Shield, Zap } from 'lucide-react';

const PDFTool = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white font-sans antialiased relative">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 rounded-full bg-sky-400/30 blur-3xl animate-blob top-1/4 left-[15%] mix-blend-lighten"></div>
        <div className="absolute w-80 h-80 rounded-full bg-purple-400/30 blur-3xl animate-blob animation-delay-2000 top-[65%] left-[70%] mix-blend-lighten"></div>
        <div className="absolute w-72 h-72 rounded-full bg-emerald-400/30 blur-3xl animate-blob animation-delay-4000 top-[10%] left-[60%] mix-blend-lighten"></div>
        <div className="absolute w-56 h-56 rounded-full bg-cyan-400/30 blur-3xl animate-blob animation-delay-6000 top-[80%] left-[20%] mix-blend-lighten"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Link 
          to="/toolkit" 
          className="inline-flex items-center mb-6 px-4 py-2 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-all duration-300 backdrop-filter backdrop-blur-sm"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Dashboard
        </Link>

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-md">
            PDF Manipulation Suite
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Professional PDF tools for merging, splitting, organizing, and managing your documents with ease.
          </p>
        </div>

        {/* Main Tool Component */}
        <PDFManipulator />

        {/* About PDF Tools Section */}
        <div className="mt-16 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-bold text-white text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
              About PDF Manipulation
            </h3>
          </div>
          <div className="space-y-4 text-white/80 leading-relaxed">
            <p>
              Our comprehensive PDF manipulation suite provides professional-grade tools for managing and organizing your PDF documents. Whether you're a business professional, student, or content creator, our tools help you efficiently handle PDF files without the need for expensive software.
            </p>
            <p>
              PDF manipulation is essential for modern document workflows. From combining multiple reports into a single document to extracting specific pages for presentations, our tools streamline your document management process. The drag-and-drop interface makes it easy to organize pages exactly as you need them.
            </p>
            <p>
              Our advanced algorithms ensure that your PDFs maintain their original quality and formatting throughout the manipulation process. All processing happens securely in your browser, ensuring your sensitive documents remain private and protected.
            </p>
          </div>
        </div>

        {/* How-To Guide Section */}
        <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-green-400" />
            <h3 className="text-2xl font-bold text-white text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-300">
              How to Use PDF Manipulation Tools
            </h3>
          </div>
          
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Merging PDFs</h4>
              <div className="space-y-3 text-white/80">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">1</div>
                  <div>
                    <p className="font-medium text-white">Upload Your PDFs</p>
                    <p className="text-sm">Drag and drop multiple PDF files into the upload area. You can also click to browse and select files from your computer. Our tool supports all standard PDF formats.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">2</div>
                  <div>
                    <p className="font-medium text-white">Arrange the Order</p>
                    <p className="text-sm">Use the drag-and-drop interface to arrange your PDFs in the desired order. You can also reorder individual pages within each document for precise control.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">3</div>
                  <div>
                    <p className="font-medium text-white">Preview and Adjust</p>
                    <p className="text-sm">Preview the merged document to ensure everything is in the correct order. You can make adjustments before finalizing the merge.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">4</div>
                  <div>
                    <p className="font-medium text-white">Download Result</p>
                    <p className="text-sm">Download your merged PDF with a single click. The file maintains all original formatting, images, and text quality.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Splitting PDFs</h4>
              <div className="space-y-3 text-white/80">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">1</div>
                  <div>
                    <p className="font-medium text-white">Upload Your PDF</p>
                    <p className="text-sm">Select the PDF file you want to split. Our tool will automatically detect the number of pages and display them for easy selection.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">2</div>
                  <div>
                    <p className="font-medium text-white">Select Pages</p>
                    <p className="text-sm">Choose which pages to include in your split. You can select individual pages, ranges, or use the "select all" option for complete documents.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">3</div>
                  <div>
                    <p className="font-medium text-white">Create Multiple Splits</p>
                    <p className="text-sm">Create multiple splits from the same document. Each split can contain different page combinations for various use cases.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">4</div>
                  <div>
                    <p className="font-medium text-white">Download All Splits</p>
                    <p className="text-sm">Download all your split PDFs individually or as a ZIP file containing all splits for easy organization.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Page Management</h4>
              <div className="space-y-3 text-white/80">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">1</div>
                  <div>
                    <p className="font-medium text-white">View All Pages</p>
                    <p className="text-sm">See thumbnails of all pages in your PDF for easy identification and selection. Each page is clearly numbered and visible.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">2</div>
                  <div>
                    <p className="font-medium text-white">Reorder Pages</p>
                    <p className="text-sm">Drag and drop pages to reorder them within your document. This is perfect for reorganizing reports or presentations.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">3</div>
                  <div>
                    <p className="font-medium text-white">Delete Unwanted Pages</p>
                    <p className="text-sm">Remove pages you don't need by selecting them and clicking delete. This helps clean up documents and reduce file size.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">4</div>
                  <div>
                    <p className="font-medium text-white">Save Changes</p>
                    <p className="text-sm">Apply all your changes and download the modified PDF. All changes are applied while maintaining document quality.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-purple-400" />
            <h3 className="text-2xl font-bold text-white text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              Frequently Asked Questions
            </h3>
          </div>
          
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h4 className="text-lg font-semibold text-white mb-2">What PDF formats are supported?</h4>
              <p className="text-white/80">Our tools support all standard PDF formats (PDF 1.4 and higher). We can handle PDFs with text, images, forms, and most embedded content. Password-protected PDFs will need to be unlocked first using our PDF unlocker tool.</p>
            </div>
            
            <div className="border-b border-white/10 pb-4">
              <h4 className="text-lg font-semibold text-white mb-2">How many PDFs can I merge at once?</h4>
              <p className="text-white/80">You can merge up to 20 PDF files simultaneously, with a total file size limit of 100MB. For larger projects, we recommend processing them in smaller batches to ensure optimal performance.</p>
            </div>
            
            <div className="border-b border-white/10 pb-4">
              <h4 className="text-lg font-semibold text-white mb-2">Will the quality of my PDF be affected?</h4>
              <p className="text-white/80">No, our tools preserve the original quality of your PDFs. All text, images, formatting, and embedded content remain exactly as they were in the original files. We use lossless processing to ensure your documents look perfect.</p>
            </div>
            
            <div className="border-b border-white/10 pb-4">
              <h4 className="text-lg font-semibold text-white mb-2">Can I work with password-protected PDFs?</h4>
              <p className="text-white/80">Password-protected PDFs need to be unlocked first. Use our dedicated PDF unlocker tool to remove passwords, then you can manipulate the unlocked PDF with these tools.</p>
            </div>
            
            <div className="border-b border-white/10 pb-4">
              <h4 className="text-lg font-semibold text-white mb-2">Are my files secure when uploaded?</h4>
              <p className="text-white/80">Absolutely. All processing happens securely in your browser. Your files are never uploaded to our servers, ensuring complete privacy and security. No data is stored or transmitted to external servers.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">What's the maximum file size I can process?</h4>
              <p className="text-white/80">Individual PDF files can be up to 50MB each, with a total limit of 100MB for batch operations. For larger files, we recommend splitting them first or using our compression tools to reduce file size.</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Batch Processing</h3>
            </div>
            <p className="text-white/80 text-sm">
              Handle multiple PDFs simultaneously with our efficient batch processing capabilities. Save time and maintain consistency across all your documents.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-green-400" />
              <h3 className="text-lg font-bold text-white">Secure Processing</h3>
            </div>
            <p className="text-white/80 text-sm">
              All processing happens locally in your browser. Your sensitive documents never leave your device, ensuring complete privacy and security.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Lightning Fast</h3>
            </div>
            <p className="text-white/80 text-sm">
              Advanced algorithms ensure quick processing even for large documents. Get your results in seconds, not minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFTool;