import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  BookOpen, 
  Video, 
  FileText, 
  Image, 
  QrCode, 
  Lock, 
  Link as LinkIcon,
  Search,
  ChevronDown,
  ChevronRight,
  Play,
  Download,
  Upload,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Help = () => {
  const [activeCategory, setActiveCategory] = useState('pdf');
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const categories = [
    { id: 'pdf', name: 'PDF Tools', icon: FileText, color: 'text-blue-400' },
    { id: 'image', name: 'Image Tools', icon: Image, color: 'text-green-400' },
    { id: 'qr', name: 'QR Generator', icon: QrCode, color: 'text-purple-400' },
    { id: 'general', name: 'General', icon: HelpCircle, color: 'text-yellow-400' }
  ];

  const helpContent = {
    pdf: [
      {
        id: 'pdf-merge',
        title: 'How to Merge PDF Files',
        content: `
          <h4>Step-by-Step Guide:</h4>
          <ol>
            <li>Navigate to the PDF Tools section</li>
            <li>Click on "Merge PDFs"</li>
            <li>Upload multiple PDF files by clicking "Choose Files" or dragging and dropping</li>
            <li>Arrange the files in the desired order using drag and drop</li>
            <li>Click "Merge PDFs" to combine the files</li>
            <li>Download your merged PDF file</li>
          </ol>
          <h4>Tips:</h4>
          <ul>
            <li>You can merge up to 20 PDF files at once</li>
            <li>Files are processed in the order they appear in the list</li>
            <li>All files remain on your device - nothing is uploaded to our servers</li>
          </ul>
        `
      },
      {
        id: 'pdf-split',
        title: 'How to Split PDF Files',
        content: `
          <h4>Step-by-Step Guide:</h4>
          <ol>
            <li>Go to the PDF Tools section</li>
            <li>Select "Split PDF"</li>
            <li>Upload your PDF file</li>
            <li>Choose your splitting method:
              <ul>
                <li><strong>Split by pages:</strong> Enter specific page numbers (e.g., 1,3,5-7)</li>
                <li><strong>Split by range:</strong> Enter page ranges (e.g., 1-5, 6-10)</li>
                <li><strong>Split all pages:</strong> Creates separate files for each page</li>
              </ul>
            </li>
            <li>Click "Split PDF"</li>
            <li>Download your split PDF files as a ZIP archive</li>
          </ol>
        `
      },
      {
        id: 'pdf-unlock',
        title: 'How to Remove PDF Password Protection',
        content: `
          <h4>Step-by-Step Guide:</h4>
          <ol>
            <li>Navigate to the PDF Security section</li>
            <li>Click on "Unlock PDF"</li>
            <li>Upload your password-protected PDF file</li>
            <li>Enter the password if prompted</li>
            <li>Click "Unlock PDF"</li>
            <li>Download your unlocked PDF file</li>
          </ol>
          <h4>Important Notes:</h4>
          <ul>
            <li>This tool only works with PDFs that have user passwords (not owner passwords)</li>
            <li>You must know the password to unlock the PDF</li>
            <li>This tool cannot crack or guess passwords</li>
            <li>All processing happens locally in your browser for security</li>
          </ul>
        `
      },
      {
        id: 'pdf-links',
        title: 'How to Remove Hyperlinks from PDFs',
        content: `
          <h4>Step-by-Step Guide:</h4>
          <ol>
            <li>Go to the PDF Link Remover section</li>
            <li>Upload your PDF file containing hyperlinks</li>
            <li>Choose your removal options:
              <ul>
                <li><strong>Remove all links:</strong> Removes every hyperlink in the document</li>
                <li><strong>Remove specific links:</strong> Allows you to select which links to remove</li>
              </ul>
            </li>
            <li>Click "Remove Links"</li>
            <li>Download your cleaned PDF file</li>
          </ol>
          <h4>Use Cases:</h4>
          <ul>
            <li>Preparing documents for printing</li>
            <li>Removing unwanted advertisements or tracking links</li>
            <li>Cleaning up documents for sharing</li>
            <li>Creating clean versions for archiving</li>
          </ul>
        `
      }
    ],
    image: [
      {
        id: 'image-resize',
        title: 'How to Resize Images',
        content: `
          <h4>Step-by-Step Guide:</h4>
          <ol>
            <li>Navigate to the Image Tools section</li>
            <li>Click on "Resize Image"</li>
            <li>Upload your image file</li>
            <li>Choose your resize method:
              <ul>
                <li><strong>Custom dimensions:</strong> Enter specific width and height in pixels</li>
                <li><strong>Percentage:</strong> Resize by a percentage of the original size</li>
                <li><strong>Preset sizes:</strong> Choose from common sizes (HD, 4K, etc.)</li>
              </ul>
            </li>
            <li>Select your preferred format (JPG, PNG, WebP)</li>
            <li>Click "Resize Image"</li>
            <li>Download your resized image</li>
          </ol>
          <h4>Supported Formats:</h4>
          <ul>
            <li>JPG/JPEG</li>
            <li>PNG</li>
            <li>WebP</li>
            <li>GIF</li>
            <li>BMP</li>
          </ul>
        `
      },
      {
        id: 'image-compress',
        title: 'How to Compress Images',
        content: `
          <h4>Step-by-Step Guide:</h4>
          <ol>
            <li>Go to the Image Tools section</li>
            <li>Select "Compress Image"</li>
            <li>Upload your image file</li>
            <li>Choose compression quality:
              <ul>
                <li><strong>High quality:</strong> Minimal compression, larger file size</li>
                <li><strong>Medium quality:</strong> Balanced compression and quality</li>
                <li><strong>High compression:</strong> Maximum file size reduction</li>
              </ul>
            </li>
            <li>Select output format</li>
            <li>Click "Compress Image"</li>
            <li>Download your compressed image</li>
          </ol>
          <h4>Benefits:</h4>
          <ul>
            <li>Reduce file size for faster uploads</li>
            <li>Save storage space</li>
            <li>Optimize images for web use</li>
            <li>Maintain good visual quality</li>
          </ul>
        `
      },
      {
        id: 'image-convert',
        title: 'How to Convert Image Formats',
        content: `
          <h4>Step-by-Step Guide:</h4>
          <ol>
            <li>Navigate to the Image Tools section</li>
            <li>Click on "Convert Image"</li>
            <li>Upload your image file</li>
            <li>Select the target format:
              <ul>
                <li><strong>JPG:</strong> Good for photographs, smaller file sizes</li>
                <li><strong>PNG:</strong> Good for graphics with transparency</li>
                <li><strong>WebP:</strong> Modern format with excellent compression</li>
                <li><strong>GIF:</strong> For animated images</li>
              </ul>
            </li>
            <li>Adjust quality settings if needed</li>
            <li>Click "Convert Image"</li>
            <li>Download your converted image</li>
          </ol>
        `
      }
    ],
    qr: [
      {
        id: 'qr-create',
        title: 'How to Create QR Codes',
        content: `
          <h4>Step-by-Step Guide:</h4>
          <ol>
            <li>Navigate to the QR Generator section</li>
            <li>Enter the content you want to encode:
              <ul>
                <li><strong>URL:</strong> Website addresses</li>
                <li><strong>Text:</strong> Plain text messages</li>
                <li><strong>Email:</strong> Email addresses with optional subject and body</li>
                <li><strong>Phone:</strong> Phone numbers</li>
                <li><strong>WiFi:</strong> Network credentials</li>
              </ul>
            </li>
            <li>Customize your QR code:
              <ul>
                <li>Choose colors for foreground and background</li>
                <li>Select size (small, medium, large)</li>
                <li>Add a logo in the center (optional)</li>
              </ul>
            </li>
            <li>Click "Generate QR Code"</li>
            <li>Download in your preferred format (PNG, JPG, SVG)</li>
          </ol>
        `
      },
      {
        id: 'qr-customize',
        title: 'How to Customize QR Codes',
        content: `
          <h4>Customization Options:</h4>
          <ul>
            <li><strong>Colors:</strong> Change foreground and background colors</li>
            <li><strong>Size:</strong> Choose from small (200px), medium (400px), or large (600px)</li>
            <li><strong>Logo:</strong> Add your company logo or image in the center</li>
            <li><strong>Format:</strong> Export as PNG, JPG, or SVG</li>
          </ul>
          <h4>Best Practices:</h4>
          <ul>
            <li>Use high contrast colors for better scanning</li>
            <li>Keep logos small to maintain readability</li>
            <li>Test your QR code before printing</li>
            <li>Use PNG format for best quality</li>
          </ul>
        `
      }
    ],
    general: [
      {
        id: 'privacy',
        title: 'Privacy and Security',
        content: `
          <h4>How We Protect Your Privacy:</h4>
          <ul>
            <li><strong>Local Processing:</strong> All files are processed in your browser</li>
            <li><strong>No Uploads:</strong> Your files never leave your device</li>
            <li><strong>No Storage:</strong> We don't store any of your files</li>
            <li><strong>No Tracking:</strong> We don't track your usage patterns</li>
            <li><strong>HTTPS:</strong> All connections are encrypted</li>
          </ul>
          <h4>Data Collection:</h4>
          <p>We collect minimal data to improve our service:</p>
          <ul>
            <li>Anonymous usage analytics (with consent)</li>
            <li>Error reports to fix bugs</li>
            <li>Contact form submissions (if you choose to contact us)</li>
          </ul>
        `
      },
      {
        id: 'browser-support',
        title: 'Browser Compatibility',
        content: `
          <h4>Supported Browsers:</h4>
          <ul>
            <li><strong>Chrome:</strong> Version 80+ (Recommended)</li>
            <li><strong>Firefox:</strong> Version 75+</li>
            <li><strong>Safari:</strong> Version 13+</li>
            <li><strong>Edge:</strong> Version 80+</li>
          </ul>
          <h4>Requirements:</h4>
          <ul>
            <li>JavaScript enabled</li>
            <li>Modern browser with ES6+ support</li>
            <li>Sufficient RAM for large file processing</li>
            <li>Stable internet connection for initial loading</li>
          </ul>
        `
      },
      {
        id: 'file-limits',
        title: 'File Size and Format Limits',
        content: `
          <h4>PDF Files:</h4>
          <ul>
            <li><strong>Size:</strong> Up to 100MB per file</li>
            <li><strong>Pages:</strong> No limit on number of pages</li>
            <li><strong>Formats:</strong> PDF only</li>
          </ul>
          <h4>Image Files:</h4>
          <ul>
            <li><strong>Size:</strong> Up to 50MB per file</li>
            <li><strong>Dimensions:</strong> Up to 8000x8000 pixels</li>
            <li><strong>Formats:</strong> JPG, PNG, WebP, GIF, BMP</li>
          </ul>
          <h4>QR Codes:</h4>
            <ul>
              <li><strong>Text Length:</strong> Up to 2,953 characters</li>
              <li><strong>URL Length:</strong> Up to 2,048 characters</li>
              <li><strong>Output Formats:</strong> PNG, JPG, SVG</li>
            </ul>
        `
      },
      {
        id: 'troubleshooting',
        title: 'Common Issues and Solutions',
        content: `
          <h4>File Won't Upload:</h4>
          <ul>
            <li>Check file size limits</li>
            <li>Ensure file format is supported</li>
            <li>Try refreshing the page</li>
            <li>Check your internet connection</li>
          </ul>
          <h4>Processing is Slow:</h4>
          <ul>
            <li>Large files take longer to process</li>
            <li>Close other browser tabs</li>
            <li>Try a different browser</li>
            <li>Check your device's available memory</li>
          </ul>
          <h4>Download Not Working:</h4>
          <ul>
            <li>Check your browser's download settings</li>
            <li>Disable ad blockers temporarily</li>
            <li>Try right-clicking and "Save As"</li>
            <li>Check your device's storage space</li>
          </ul>
        `
      }
    ]
  };

  return (
    <>
      <SEO 
        title="Help & Support - QuickSideTool User Guide"
        description="Get help with QuickSideTool's PDF and image tools. Comprehensive guides, tutorials, and troubleshooting for all our features."
        keywords="help, support, user guide, tutorial, how to use QuickSideTool, PDF tools help, image tools help, troubleshooting"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Navbar />
        
        <div className="relative z-10 pt-24">
          {/* Hero Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 py-16"
          >
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Help & Support
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Everything you need to know about using QuickSideTool effectively. From basic tutorials to advanced tips.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help topics..."
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.section>

          {/* Category Tabs */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="container mx-auto px-4 py-8"
          >
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  {category.name}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Help Content */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="container mx-auto px-4 py-16"
          >
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {helpContent[activeCategory].map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      {expandedItems[item.id] ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedItems[item.id] && (
                      <div className="px-6 pb-6">
                        <div 
                          className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Quick Tips Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="container mx-auto px-4 py-16"
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Quick Tips</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <h3 className="text-lg font-bold">Best Practices</h3>
                  </div>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Use supported file formats for best results</li>
                    <li>• Keep file sizes reasonable for faster processing</li>
                    <li>• Test your files before processing large batches</li>
                    <li>• Save your work regularly</li>
                  </ul>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-lg font-bold">Troubleshooting</h3>
                  </div>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Refresh the page if tools aren't loading</li>
                    <li>• Check your browser's JavaScript settings</li>
                    <li>• Try a different browser if issues persist</li>
                    <li>• Clear browser cache if needed</li>
                  </ul>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Info className="w-6 h-6 text-blue-400" />
                    <h3 className="text-lg font-bold">Need More Help?</h3>
                  </div>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Contact our support team</li>
                    <li>• Join our Discord community</li>
                    <li>• Check our FAQ section</li>
                    <li>• Report bugs or issues</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Contact CTA */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="container mx-auto px-4 py-16"
          >
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-blue-500/30">
                <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
                <p className="text-gray-300 mb-6 text-lg">
                  Can't find what you're looking for? Our support team is here to help you get the most out of QuickSideTool.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/contact"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                  >
                    Contact Support
                  </a>
                  <a 
                    href="https://discord.gg/5SufsJSj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-700 transition-all duration-300"
                  >
                    Join Discord
                  </a>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Help; 