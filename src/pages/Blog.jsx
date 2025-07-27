import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Image, 
  QrCode, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight,
  Search,
  Tag,
  BookOpen
} from 'lucide-react';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Articles', icon: BookOpen },
    { id: 'pdf', name: 'PDF Tips', icon: FileText },
    { id: 'image', name: 'Image Editing', icon: Image },
    { id: 'qr', name: 'QR Codes', icon: QrCode },
    { id: 'tutorial', name: 'Tutorials', icon: BookOpen }
  ];

  const articles = [
    {
      id: 1,
      title: "Complete Guide to PDF Merging: How to Combine Multiple PDFs",
      excerpt: "Learn the best practices for merging PDF files, including how to organize pages, maintain quality, and handle different file sizes. This comprehensive guide covers everything from basic merging to advanced techniques.",
      content: `
        <h2>Understanding PDF Merging</h2>
        <p>PDF merging is the process of combining multiple PDF documents into a single file. This is useful for creating reports, combining scanned documents, or organizing related materials into one cohesive document.</p>
        
        <h3>When to Merge PDFs</h3>
        <ul>
          <li>Creating comprehensive reports from multiple sources</li>
          <li>Combining scanned documents into a single file</li>
          <li>Organizing related materials for easier sharing</li>
          <li>Preparing documents for printing or archiving</li>
        </ul>
        
        <h3>Best Practices for PDF Merging</h3>
        <p>To ensure the best results when merging PDFs, follow these guidelines:</p>
        <ol>
          <li><strong>Check file sizes:</strong> Ensure your files aren't too large for processing</li>
          <li><strong>Organize files:</strong> Arrange them in the desired order before merging</li>
          <li><strong>Maintain quality:</strong> Use high-quality source files for better results</li>
          <li><strong>Test the result:</strong> Always review the merged document</li>
        </ol>
        
        <h3>Common Issues and Solutions</h3>
        <p>Sometimes you might encounter issues when merging PDFs. Here are some common problems and their solutions:</p>
        <ul>
          <li><strong>Large file sizes:</strong> Consider compressing images within the PDFs first</li>
          <li><strong>Password protection:</strong> Remove passwords before merging</li>
          <li><strong>Corrupted files:</strong> Try repairing the source files first</li>
        </ul>
      `,
      category: 'pdf',
      author: 'QuickSideTool Team',
      date: '2024-01-15',
      readTime: '8 min read',
      tags: ['PDF', 'Merging', 'Document Management', 'Tutorial']
    },
    {
      id: 2,
      title: "Image Compression: Balancing Quality and File Size",
      excerpt: "Discover the secrets of effective image compression. Learn how to reduce file sizes while maintaining visual quality, and understand when to use different compression techniques.",
      content: `
        <h2>The Art of Image Compression</h2>
        <p>Image compression is essential for web optimization, faster uploads, and efficient storage. Understanding how to compress images properly can save bandwidth and improve user experience.</p>
        
        <h3>Types of Image Compression</h3>
        <p>There are two main types of image compression:</p>
        <ul>
          <li><strong>Lossless compression:</strong> Reduces file size without losing quality</li>
          <li><strong>Lossy compression:</strong> Reduces file size by removing some data</li>
        </ul>
        
        <h3>Choosing the Right Compression Level</h3>
        <p>The optimal compression level depends on your use case:</p>
        <ul>
          <li><strong>Web use:</strong> Higher compression for faster loading</li>
          <li><strong>Print:</strong> Lower compression to maintain quality</li>
          <li><strong>Storage:</strong> Balance between size and quality</li>
        </ul>
        
        <h3>Tools and Techniques</h3>
        <p>Modern tools like QuickSideTool make image compression easy and effective. Our advanced algorithms ensure the best balance between file size and quality.</p>
      `,
      category: 'image',
      author: 'QuickSideTool Team',
      date: '2024-01-10',
      readTime: '6 min read',
      tags: ['Image Compression', 'Web Optimization', 'File Management']
    },
    {
      id: 3,
      title: "QR Code Best Practices: Creating Effective QR Codes",
      excerpt: "Learn how to create QR codes that work reliably and look professional. This guide covers design principles, testing methods, and common mistakes to avoid.",
      content: `
        <h2>Creating Effective QR Codes</h2>
        <p>QR codes are powerful tools for connecting physical and digital worlds. When designed properly, they can significantly improve user engagement and provide valuable information quickly.</p>
        
        <h3>Design Principles</h3>
        <ul>
          <li><strong>High contrast:</strong> Ensure the QR code stands out clearly</li>
          <li><strong>Appropriate size:</strong> Make it easy to scan from a reasonable distance</li>
          <li><strong>Error correction:</strong> Use higher error correction for better reliability</li>
          <li><strong>Clean background:</strong> Avoid busy backgrounds that interfere with scanning</li>
        </ul>
        
        <h3>Testing Your QR Codes</h3>
        <p>Always test your QR codes before deploying them:</p>
        <ol>
          <li>Test with multiple devices and apps</li>
          <li>Check scanning from different distances</li>
          <li>Verify the destination URL or content</li>
          <li>Test in different lighting conditions</li>
        </ol>
        
        <h3>Common Mistakes to Avoid</h3>
        <p>Some common mistakes can make QR codes ineffective:</p>
        <ul>
          <li>Making them too small to scan easily</li>
          <li>Using low contrast colors</li>
          <li>Placing them in hard-to-reach locations</li>
          <li>Not testing before deployment</li>
        </ul>
      `,
      category: 'qr',
      author: 'QuickSideTool Team',
      date: '2024-01-05',
      readTime: '7 min read',
      tags: ['QR Codes', 'Design', 'Marketing', 'Best Practices']
    },
    {
      id: 4,
      title: "PDF Security: Protecting Your Documents",
      excerpt: "Understand the different ways to secure your PDF documents, from password protection to encryption. Learn when and how to use various security measures.",
      content: `
        <h2>Securing Your PDF Documents</h2>
        <p>PDF security is crucial for protecting sensitive information. Understanding the different security options available can help you choose the right protection for your documents.</p>
        
        <h3>Types of PDF Security</h3>
        <ul>
          <li><strong>Password protection:</strong> Basic access control</li>
          <li><strong>Encryption:</strong> Advanced data protection</li>
          <li><strong>Digital signatures:</strong> Authentication and integrity</li>
          <li><strong>Watermarks:</strong> Visual protection and branding</li>
        </ul>
        
        <h3>When to Use Different Security Measures</h3>
        <p>Choose security measures based on your needs:</p>
        <ul>
          <li><strong>Internal documents:</strong> Basic password protection</li>
          <li><strong>Confidential information:</strong> Strong encryption</li>
          <li><strong>Legal documents:</strong> Digital signatures</li>
          <li><strong>Marketing materials:</strong> Watermarks for branding</li>
        </ul>
        
        <h3>Best Practices for PDF Security</h3>
        <p>Follow these guidelines to ensure effective security:</p>
        <ol>
          <li>Use strong, unique passwords</li>
          <li>Regularly update security measures</li>
          <li>Limit access to authorized users only</li>
          <li>Keep backup copies of important documents</li>
        </ol>
      `,
      category: 'pdf',
      author: 'QuickSideTool Team',
      date: '2023-12-28',
      readTime: '9 min read',
      tags: ['PDF Security', 'Encryption', 'Password Protection', 'Document Safety']
    },
    {
      id: 5,
      title: "Image Format Guide: Choosing the Right Format for Your Needs",
      excerpt: "Navigate the world of image formats with this comprehensive guide. Learn the differences between JPG, PNG, WebP, and other formats, and when to use each one.",
      content: `
        <h2>Understanding Image Formats</h2>
        <p>Choosing the right image format is crucial for optimal quality, file size, and compatibility. Each format has its strengths and ideal use cases.</p>
        
        <h3>Common Image Formats</h3>
        <ul>
          <li><strong>JPEG (JPG):</strong> Best for photographs and complex images</li>
          <li><strong>PNG:</strong> Ideal for graphics with transparency</li>
          <li><strong>WebP:</strong> Modern format with excellent compression</li>
          <li><strong>GIF:</strong> Perfect for simple animations</li>
          <li><strong>SVG:</strong> Vector format for scalable graphics</li>
        </ul>
        
        <h3>When to Use Each Format</h3>
        <p>Choose your format based on your specific needs:</p>
        <ul>
          <li><strong>Photographs:</strong> JPEG for best compression</li>
          <li><strong>Logos and graphics:</strong> PNG for transparency support</li>
          <li><strong>Web images:</strong> WebP for modern browsers</li>
          <li><strong>Animations:</strong> GIF for simple animations</li>
          <li><strong>Scalable graphics:</strong> SVG for vector images</li>
        </ul>
        
        <h3>Conversion Best Practices</h3>
        <p>When converting between formats, consider these factors:</p>
        <ol>
          <li>Maintain quality during conversion</li>
          <li>Choose appropriate compression settings</li>
          <li>Test the result in your intended use case</li>
          <li>Keep original files as backups</li>
        </ol>
      `,
      category: 'image',
      author: 'QuickSideTool Team',
      date: '2023-12-20',
      readTime: '10 min read',
      tags: ['Image Formats', 'File Types', 'Web Design', 'Digital Media']
    },
    {
      id: 6,
      title: "Step-by-Step Tutorial: Creating Professional PDF Reports",
      excerpt: "Follow this detailed tutorial to create professional PDF reports from scratch. Learn about layout, formatting, and best practices for document creation.",
      content: `
        <h2>Creating Professional PDF Reports</h2>
        <p>Professional PDF reports are essential for business communication, academic submissions, and formal documentation. This tutorial will guide you through the process of creating polished, professional documents.</p>
        
        <h3>Planning Your Report</h3>
        <p>Before you start creating your PDF, plan your document structure:</p>
        <ul>
          <li>Define your target audience</li>
          <li>Outline your content structure</li>
          <li>Choose appropriate formatting</li>
          <li>Plan for visual elements</li>
        </ul>
        
        <h3>Essential Elements</h3>
        <p>Every professional report should include:</p>
        <ol>
          <li><strong>Title page:</strong> Clear identification of the document</li>
          <li><strong>Table of contents:</strong> Easy navigation</li>
          <li><strong>Executive summary:</strong> Key points overview</li>
          <li><strong>Main content:</strong> Detailed information</li>
          <li><strong>Conclusions:</strong> Summary and recommendations</li>
          <li><strong>Appendices:</strong> Supporting materials</li>
        </ol>
        
        <h3>Formatting Best Practices</h3>
        <p>Use these formatting guidelines for professional appearance:</p>
        <ul>
          <li>Consistent font usage throughout</li>
          <li>Proper spacing and margins</li>
          <li>Clear headings and subheadings</li>
          <li>Professional color scheme</li>
          <li>High-quality images and graphics</li>
        </ul>
        
        <h3>Final Steps</h3>
        <p>Before finalizing your report:</p>
        <ol>
          <li>Proofread for errors</li>
          <li>Check formatting consistency</li>
          <li>Test the PDF on different devices</li>
          <li>Ensure all links work properly</li>
          <li>Verify file size is reasonable</li>
        </ol>
      `,
      category: 'tutorial',
      author: 'QuickSideTool Team',
      date: '2023-12-15',
      readTime: '12 min read',
      tags: ['PDF Creation', 'Report Writing', 'Professional Documents', 'Tutorial']
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <SEO 
        title="Blog - QuickSideTool Tips, Tutorials, and Guides"
        description="Learn about PDF tools, image editing, QR codes, and more with our comprehensive blog. Tips, tutorials, and best practices for digital file management."
        keywords="blog, tutorials, PDF tips, image editing guide, QR code best practices, digital tools, file management"
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
                QuickSideTool Blog
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Tips, tutorials, and insights to help you master digital file management and get the most out of our tools.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      <category.icon className="w-4 h-4" />
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Articles Grid */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="container mx-auto px-4 py-16"
          >
            <div className="max-w-6xl mx-auto">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No articles found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredArticles.map((article, index) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                            {categories.find(cat => cat.id === article.category)?.name}
                          </span>
                          <span className="text-gray-400 text-sm">{article.readTime}</span>
                        </div>
                        
                        <h2 className="text-xl font-bold mb-3 group-hover:text-blue-300 transition-colors">
                          {article.title}
                        </h2>
                        
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {article.author}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(article.date)}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {article.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2 py-1 bg-gray-800/50 text-gray-300 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
                          Read More <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </div>
          </motion.section>

          {/* Newsletter Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="container mx-auto px-4 py-16"
          >
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl p-8 border border-purple-500/30">
                <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                <p className="text-gray-300 mb-6 text-lg">
                  Get the latest tips, tutorials, and updates delivered to your inbox. Never miss a new article or feature.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                    Subscribe
                  </button>
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

export default Blog; 