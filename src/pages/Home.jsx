import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Image,
  QrCode,
  Github,
  Gamepad2,
  Unlock,
  Link as LinkIcon,
  Check,
  Star,
  Users,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Menu,
  X,
  FileCheck,
  Server,
  MessageCircle,
  DollarSign
} from "lucide-react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);
    
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => {
      clearInterval(featureInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast Processing",
      description: "Process files in seconds, not minutes. Our optimized algorithms ensure quick results without compromising quality.",
      details: [
        "Advanced compression algorithms",
        "Parallel processing capabilities",
        "Optimized for large files",
        "Real-time progress tracking"
      ]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "100% Secure & Private",
      description: "Your files never leave your device. All processing happens locally in your browser for maximum security.",
      details: [
        "Client-side processing only",
        "No file uploads to servers",
        "End-to-end encryption",
        "GDPR compliant"
      ]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Works Everywhere",
      description: "No downloads or installations required. Access all tools from any device with a modern web browser.",
      details: [
        "Cross-platform compatibility",
        "Mobile-responsive design",
        "Offline capability",
        "Instant access"
      ]
    }
  ];

  const tools = [
    {
      to: "/pdf-tool",
      icon: <FileText size={32} />,
      title: "PDF Tools Suite",
      description: "Complete PDF manipulation toolkit with merge, split, compress, and organize capabilities",
      features: ["Merge multiple PDFs", "Split large documents", "Compress file size", "Reorder pages", "Rotate pages", "Add watermarks"],
      gradientFrom: "from-pink-500",
      gradientTo: "to-purple-500",
      badge: "Most Popular"
    },
    {
      to: "/unlock-pdf",
      icon: <Unlock size={32} />,
      title: "PDF Security Tools",
      description: "Advanced security features for protecting and unlocking PDF documents",
      features: ["Remove passwords", "Add encryption", "Secure sharing", "Access control", "Digital signatures", "Audit trails"],
      gradientFrom: "from-blue-500",
      gradientTo: "to-cyan-500"
    },
    {
      to: "/image-tools",
      icon: <Image size={32} />,
      title: "Image Processing",
      description: "Professional image editing tools for compression, resizing, and format conversion",
      features: ["Smart compression", "Batch processing", "Format conversion", "Quality optimization", "Size reduction", "Metadata handling"],
      gradientFrom: "from-green-500",
      gradientTo: "to-teal-500"
    },
    {
      to: "/qr-tool",
      icon: <QrCode size={32} />,
      title: "QR Code Generator",
      description: "Create custom QR codes for URLs, text, contact information, and more",
      features: ["Custom styling", "Multiple formats", "Error correction", "Size options", "Color schemes", "Logo integration"],
      gradientFrom: "from-yellow-500",
      gradientTo: "to-orange-500"
    },
    {
      to: "/pdf-link-remove",
      icon: <LinkIcon size={32} />,
      title: "Link Removal Tool",
      description: "Clean PDFs by removing hyperlinks while preserving document integrity",
      features: ["Selective removal", "Batch processing", "Link detection", "Format preservation", "Quality maintenance", "Safe processing"],
      gradientFrom: "from-indigo-500",
      gradientTo: "to-purple-500"
    },
    {
      to: "/diamond-mines",
      icon: <Gamepad2 size={32} />,
      title: "Take a Break",
      description: "Fun mini-game to relax and take a mental break from work",
      features: ["Stress relief", "Multiple difficulty levels", "Score tracking", "Sound effects", "Visual feedback", "Achievement system"],
      gradientFrom: "from-red-500",
      gradientTo: "to-pink-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      company: "TechCorp Solutions",
      content: "QuickSideTool has revolutionized our document workflow. We process hundreds of PDFs daily, and the speed and reliability are incredible. The merge feature alone saves us hours every week.",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "Michael Chen",
      role: "Freelance Designer",
      company: "Creative Studio",
      content: "As a designer, I need to handle various image formats and sizes. The image compression tool is a lifesaver - it maintains quality while reducing file sizes dramatically. Highly recommended!",
      rating: 5,
      avatar: "👨‍🎨"
    },
    {
      name: "Emily Rodriguez",
      role: "Student",
      company: "University of Technology",
      content: "I use QuickSideTool for all my academic work. The PDF tools help me organize research papers, and the QR generator is perfect for sharing study materials. It's free and incredibly useful!",
      rating: 5,
      avatar: "👩‍🎓"
    },
    {
      name: "David Thompson",
      role: "Small Business Owner",
      company: "Thompson Consulting",
      content: "Running a small business means wearing many hats. QuickSideTool helps me handle all my document needs without expensive software subscriptions. The security features give me peace of mind.",
      rating: 5,
      avatar: "👨‍💼"
    }
  ];

  const useCases = [
    {
      category: "Business & Professional",
      cases: [
        "Merge multiple contracts into single documents",
        "Compress large presentation files for email",
        "Remove sensitive links from shared PDFs",
        "Generate QR codes for business cards",
        "Secure confidential documents with passwords",
        "Optimize images for website use"
      ]
    },
    {
      category: "Education & Research",
      cases: [
        "Combine research papers and articles",
        "Compress lecture materials for sharing",
        "Create QR codes for study resources",
        "Organize academic documents by topic",
        "Remove tracking links from research PDFs",
        "Optimize images for presentations"
      ]
    },
    {
      category: "Personal & Creative",
      cases: [
        "Merge family photos into albums",
        "Compress vacation photos for social media",
        "Create QR codes for personal projects",
        "Organize personal documents",
        "Remove unwanted links from saved articles",
        "Optimize images for printing"
      ]
    }
  ];

  const statistics = [
    { number: "10M+", label: "Files Processed", icon: <FileCheck className="w-6 h-6" /> },
    { number: "500K+", label: "Happy Users", icon: <Users className="w-6 h-6" /> },
    { number: "99.9%", label: "Uptime", icon: <Server className="w-6 h-6" /> },
    { number: "24/7", label: "Support", icon: <MessageCircle className="w-6 h-6" /> },
    { number: "50+", label: "Countries", icon: <Globe className="w-6 h-6" /> },
    { number: "100%", label: "Free", icon: <DollarSign className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-sans antialiased relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-96 h-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse top-1/4 left-1/4"></div>
        <div className="absolute w-80 h-80 rounded-full bg-blue-500/20 blur-3xl animate-pulse animation-delay-2000 bottom-1/4 right-1/4"></div>
        <div className="absolute w-72 h-72 rounded-full bg-pink-500/20 blur-3xl animate-pulse animation-delay-4000 top-1/2 left-1/2"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  QuickSideTool
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#tools" className="text-gray-300 hover:text-white transition-colors">Tools</a>
                <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
                <a href="#use-cases" className="text-gray-300 hover:text-white transition-colors">Use Cases</a>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t border-white/10">
                <div className="flex flex-col space-y-4 pt-4">
                  <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                  <a href="#tools" className="text-gray-300 hover:text-white transition-colors">Tools</a>
                  <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
                  <a href="#use-cases" className="text-gray-300 hover:text-white transition-colors">Use Cases</a>
                  <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
                  <Link 
                    to="/signup" 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-center"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto text-center max-w-6xl">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Your Essential
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Digital Toolkit
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                Transform your productivity with professional-grade tools for PDF manipulation, image processing, QR code generation, and more. 
                Everything you need to handle digital files efficiently, securely, and completely free.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link 
                  to="/pdf-tool"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Start Using Tools
                </Link>
                <button className="border border-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center space-x-2">
                  <span>Watch Demo</span>
                  <ArrowRight size={20} />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
                {statistics.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                    <div className="flex justify-center mb-2">
                      <div className="text-purple-400">{stat.icon}</div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-black/20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why Choose QuickSideTool?
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Built for speed, security, and simplicity. Our comprehensive toolkit provides everything you need to handle digital files professionally, 
                without the complexity or cost of traditional software solutions.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`text-center p-8 rounded-2xl transition-all duration-500 ${
                    activeFeature === index 
                      ? 'bg-white/10 border border-purple-500/50 shadow-2xl' 
                      : 'bg-white/5 border border-white/10 hover:border-purple-500/30'
                  }`}
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{feature.description}</p>
                  <ul className="text-left space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-400">
                        <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section id="tools" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Professional Tools Suite
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Our comprehensive collection of digital tools is designed to handle every aspect of file management and processing. 
                From basic operations to advanced features, we've got you covered with professional-grade functionality.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <Link
                  key={index}
                  to={tool.to}
                  className="group relative rounded-2xl p-6 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
                >
                  {tool.badge && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                      {tool.badge}
                    </div>
                  )}
                  <div className={`w-12 h-12 mb-4 bg-gradient-to-r ${tool.gradientFrom} ${tool.gradientTo} rounded-xl flex items-center justify-center text-white`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {tool.description}
                  </p>
                  <ul className="space-y-1">
                    {tool.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-xs text-gray-400">
                        <Check className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 px-4 bg-black/20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Join thousands of satisfied users who trust QuickSideTool for their daily file processing needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-2xl transition-all duration-500 ${
                    activeTestimonial === index 
                      ? 'bg-white/10 border border-purple-500/50' 
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">{testimonial.role} at {testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="use-cases" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Real-World Applications
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Discover how QuickSideTool is being used across different industries and scenarios to improve productivity and streamline workflows.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {useCases.map((category, index) => (
                <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold mb-4 text-purple-400">{category.category}</h3>
                  <ul className="space-y-3">
                    {category.cases.map((useCase, caseIndex) => (
                      <li key={caseIndex} className="flex items-start text-sm text-gray-300">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join millions of users who have already discovered the power of QuickSideTool. 
              Start processing your files faster, more securely, and more efficiently today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/pdf-tool"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Using Tools Now
              </Link>
              <Link 
                to="/about"
                className="border border-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/10">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">QuickSideTool</span>
                </div>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Your essential digital toolkit for professional file processing. Free, secure, and powerful tools for PDFs, images, and more.
                </p>
                <div className="flex space-x-4">
                  <a href="https://github.com/AmanYadav007/QuickSideTool" className="text-gray-400 hover:text-white transition-colors">
                    <Github size={20} />
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Tools</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/pdf-tool" className="hover:text-white transition-colors">PDF Tools</Link></li>
                  <li><Link to="/image-tools" className="hover:text-white transition-colors">Image Tools</Link></li>
                  <li><Link to="/qr-tool" className="hover:text-white transition-colors">QR Generator</Link></li>
                  <li><Link to="/unlock-pdf" className="hover:text-white transition-colors">PDF Security</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  <li><Link to="/help" className="hover:text-white transition-colors">Help & Support</Link></li>
                  <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link></li>
                  <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} QuickSideTool. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
      <SpeedInsights />
    </div>
  );
};

export default HomePage; 