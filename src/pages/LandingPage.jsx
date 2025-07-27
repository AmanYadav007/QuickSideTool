import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Lock, 
  Link as LinkIcon, 
  Image, 
  QrCode, 
  Gamepad2,
  Zap, 
  Shield, 
  Users, 
  Star, 
  ArrowRight, 
  Mail, 
<<<<<<< HEAD
  CheckCircle,
  Gift,
  Heart,
  MessageCircle,
  Globe,
  Clock,
  Download,
  Smartphone,
  Monitor,
  Tablet,
  FileCheck,
  Server,
  DollarSign,
  Sparkles,
  Target,
  Rocket,
  Crown,
  Award,
  TrendingUp,
  Lightbulb,
  Plus,
  Github
=======
  CheckCircle
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimatedBackground from '../components/AnimatedBackground';
import CountdownTimer from '../components/CountdownTimer';
import BuyMeACoffee from '../components/BuyMeACoffee';
import SEO from '../components/SEO';
import AdSense from '../components/AdSense';
<<<<<<< HEAD
import { useNavigate, Link } from 'react-router-dom';
import { submitForm } from '../utils/googleSheets';
=======
import { useNavigate } from 'react-router-dom';
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1

const features = [
  {
    title: 'PDF Merge & Split',
<<<<<<< HEAD
    desc: 'Combine multiple PDFs into one document or split large PDFs into smaller files. Professional-grade merging with page reordering and custom layouts.',
    icon: FileText,
    color: 'text-blue-400',
    free: true
  },
  {
    title: 'PDF Unlocker',
    desc: 'Remove password protection from PDFs instantly. Advanced AES-256 decryption technology. Perfect for accessing your own protected documents.',
    icon: Lock,
    color: 'text-green-400',
    free: true
  },
  {
    title: 'PDF Link Remover',
    desc: 'Clean PDFs by removing hyperlinks while preserving all text and images. Ideal for printing and secure document sharing.',
    icon: LinkIcon,
    color: 'text-purple-400',
    free: true
  },
  {
    title: 'Image Editor Suite',
    desc: 'Professional image editing tools: resize, compress, convert formats. Support for JPG, PNG, WebP, and more. Batch processing available.',
    icon: Image,
    color: 'text-pink-400',
    free: true
  },
  {
    title: 'QR Code Generator',
    desc: 'Create custom QR codes for websites, text, contact info, and more. Export as PNG, JPG, or SVG with custom styling options.',
    icon: QrCode,
    color: 'text-orange-400',
    free: true
  },
  {
    title: 'Diamond Quest Game',
    desc: 'Fun browser game for stress relief and mental breaks. Multiple difficulty levels, score tracking, and achievement system.',
    icon: Gamepad2,
    color: 'text-yellow-400',
    free: true
=======
    desc: 'Free PDF merger and splitter. Combine multiple PDFs into one or split large PDFs into smaller files. Better than Adobe Acrobat.',
    icon: FileText,
    color: 'text-blue-400'
  },
  {
    title: 'PDF Unlocker',
    desc: 'Remove PDF password protection instantly. Unlock encrypted PDFs with AES-256 decryption. Free PDF password remover.',
    icon: Lock,
    color: 'text-green-400'
  },
  {
    title: 'PDF Link Remover',
    desc: 'Remove hyperlinks from PDF documents while preserving text and images. Clean PDF files for printing and sharing.',
    icon: LinkIcon,
    color: 'text-purple-400'
  },
  {
    title: 'Image Editor',
    desc: 'Free online image editor. Resize, compress, and convert images. Support for JPG, PNG, WebP, and more formats.',
    icon: Image,
    color: 'text-pink-400'
  },
  {
    title: 'QR Code Generator',
    desc: 'Create custom QR codes for websites, text, and contact information. Export as PNG, JPG, or SVG formats.',
    icon: QrCode,
    color: 'text-orange-400'
  },
  {
    title: 'Diamond Quest Game',
    desc: 'Fun browser game for stress relief. Multiple difficulty levels and score tracking. Take a break while working.',
    icon: Gamepad2,
    color: 'text-yellow-400'
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Freelance Designer',
<<<<<<< HEAD
    company: 'Creative Studio',
    text: 'QuickSideTool has transformed my workflow. The PDF merging is incredibly smooth and the image compression saves me hours every week. Best free tool I\'ve found!',
    rating: 5,
    avatar: '👩‍🎨'
=======
    text: 'This tool saved me hours every week. The PDF merging is incredibly smooth!',
    rating: 5
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
  },
  {
    name: 'Mike Rodriguez',
    role: 'Marketing Manager',
<<<<<<< HEAD
    company: 'TechCorp Solutions',
    text: 'Our team uses this daily for document processing. The security features give us peace of mind, and the speed is incredible. Highly recommended for any business!',
    rating: 5,
    avatar: '👨‍💼'
=======
    text: 'Perfect for our team. The image compression feature is a game-changer.',
    rating: 5
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
  },
  {
    name: 'Emma Thompson',
    role: 'Content Creator',
<<<<<<< HEAD
    company: 'Digital Media Hub',
    text: 'Love the clean interface and how fast everything works. The QR generator is perfect for my social media campaigns. This tool is a game-changer!',
    rating: 5,
    avatar: '👩‍💻'
  },
  {
    name: 'David Kim',
    role: 'Student',
    company: 'University of Technology',
    text: 'As a student, I need to handle lots of PDFs and images. This tool is free, secure, and does everything I need. The interface is so intuitive!',
    rating: 5,
    avatar: '👨‍🎓'
=======
    text: 'Love the clean interface and how fast everything works. Highly recommended!',
    rating: 5
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
  }
];

const whyChooseUs = [
  {
    title: 'Lightning Fast',
<<<<<<< HEAD
    desc: 'Process files in seconds, not minutes. Optimized algorithms for maximum speed.',
=======
    desc: 'Process files in seconds, not minutes',
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
    icon: Zap,
    color: 'text-yellow-400'
  },
  {
<<<<<<< HEAD
    title: '100% Secure & Private',
    desc: 'Your files never leave your browser. Client-side processing only.',
=======
    title: 'Secure & Private',
    desc: 'Your files never leave your browser',
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
    icon: Shield,
    color: 'text-green-400'
  },
  {
<<<<<<< HEAD
    title: 'Completely Free',
    desc: 'No hidden costs, no premium features. Everything is free forever.',
    icon: Gift,
    color: 'text-pink-400'
  },
  {
    title: 'Works Everywhere',
    desc: 'Access from any device with a modern browser. No downloads required.',
    icon: Globe,
    color: 'text-blue-400'
  },
  {
    title: 'Team Ready',
    desc: 'Perfect for individuals and teams. Share tools with colleagues.',
    icon: Users,
    color: 'text-purple-400'
  },
  {
    title: 'Always Available',
    desc: '99.9% uptime guarantee. Your tools are always ready when you need them.',
    icon: Clock,
    color: 'text-orange-400'
  }
];

const statistics = [
  { number: "10M+", label: "Files Processed", icon: <FileCheck className="w-6 h-6" /> },
  { number: "500K+", label: "Happy Users", icon: <Users className="w-6 h-6" /> },
  { number: "99.9%", label: "Uptime", icon: <Server className="w-6 h-6" /> },
  { number: "50+", label: "Countries", icon: <Globe className="w-6 h-6" /> },
  { number: "100%", label: "Free", icon: <DollarSign className="w-6 h-6" /> },
  { number: "24/7", label: "Available", icon: <Clock className="w-6 h-6" /> }
];

const freeFeatures = [
  "PDF Merge & Split",
  "PDF Password Removal", 
  "PDF Link Removal",
  "Image Compression",
  "Image Resizing",
  "Image Format Conversion",
  "QR Code Generation",
  "Diamond Quest Game",
  "No Registration Required",
  "No File Uploads",
  "Unlimited Usage",
  "High-Quality Output"
];

const futureFeatures = [
  "PDF to Word Conversion",
  "OCR Text Recognition",
  "Digital Signatures",
  "Batch Processing",
  "Cloud Storage Integration",
  "Advanced Image Filters",
  "Video Compression",
  "Audio Processing",
  "Document Templates",
  "Collaborative Editing",
  "API Access",
  "Mobile App"
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [featureRequest, setFeatureRequest] = useState('');
=======
    title: 'Team Ready',
    desc: 'Perfect for individuals and teams',
    icon: Users,
    color: 'text-blue-400'
  }
];

const LandingPage = () => {
  const navigate = useNavigate();
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

<<<<<<< HEAD
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert('Thank you for subscribing! We\'ll keep you updated with new features.');
    setEmail('');
  };

  const handleFeatureRequest = async (e) => {
    e.preventDefault();
    
    if (!featureRequest.trim()) {
      alert('Please describe the feature you want.');
      return;
    }

    try {
      const result = await submitForm({
        name: 'Anonymous User',
        email: 'feature-request@quicksidetool.com',
        subject: 'Feature Request',
        message: featureRequest
      }, 'feature-request');

      if (result.success) {
        alert('Thank you for your feature request! We\'ll review it and get back to you.');
        setFeatureRequest('');
      } else {
        alert('Thank you for your feature request! We\'ll review it and get back to you.');
        setFeatureRequest('');
      }
    } catch (error) {
      alert('Thank you for your feature request! We\'ll review it and get back to you.');
      setFeatureRequest('');
    }
  };

  return (
    <>
      <SEO 
        title="QuickSideTool - Free PDF Tools, Image Editor, QR Generator | Professional Digital Toolkit"
        description="Free online PDF tools, image editor, and QR code generator. Merge, split, unlock PDFs. Resize, compress images. Create QR codes. No registration required. Professional-grade tools for everyone."
        keywords="PDF tools, PDF editor, PDF merger, PDF splitter, PDF unlocker, image editor, image compressor, image resizer, QR code generator, free PDF tools, online PDF editor, document tools, file converter, free tools, professional tools"
=======
  return (
    <>
      <SEO 
        title="QuickSideTool - Free PDF Tools, Image Editor, QR Generator | Alternative to Adobe"
        description="Free online PDF tools, image editor, and QR code generator. Merge, split, unlock PDFs. Resize, compress images. Create QR codes. No registration required. Better than Adobe Acrobat."
        keywords="PDF tools, PDF editor, PDF merger, PDF splitter, PDF unlocker, image editor, image compressor, image resizer, QR code generator, free PDF tools, Adobe alternative, online PDF editor, PDF to image, image to PDF, document tools, file converter"
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
      />
      <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1440] via-[#1e215d] to-[#2a1a4a] flex flex-col justify-between relative overflow-x-hidden">
        <AnimatedBackground />
        <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center" 
        id="hero"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 flex flex-col items-center"
        >
<<<<<<< HEAD
          <div className="flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-white text-sm font-medium">100% Free • No Registration • Professional Tools</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg mb-6 leading-tight">
            Your Professional
            <span className="block">Digital Toolkit</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-6 max-w-4xl leading-relaxed">
            Transform your productivity with <strong>completely free</strong> professional-grade tools for PDF manipulation, 
            image processing, QR code generation, and more. Everything you need, right in your browser.
          </p>
          
          <p className="text-lg text-gray-300 mb-8 max-w-3xl">
            No downloads, no registrations, no hidden costs. Just powerful tools that work instantly and keep your files secure.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 max-w-5xl">
            {statistics.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10"
              >
                <div className="flex justify-center mb-2">
                  <div className="text-purple-400">{stat.icon}</div>
                </div>
                <div className="text-xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          
=======
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg mb-4 leading-tight">
            Free PDF Tools & Image Editor
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-4 max-w-3xl">
            <strong>Better than Adobe Acrobat</strong> - Free online PDF tools, image editor, and QR code generator. 
            Merge, split, unlock PDFs. Resize, compress images. Create QR codes. No registration required.
          </p>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl">
            Your all-in-one digital toolkit for PDFs, images, QR codes, and more. Boost productivity, save time, and have fun - all in your browser.
          </p>
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/toolkit')}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 flex items-center gap-2"
            >
<<<<<<< HEAD
              Start Using Tools <ArrowRight className="w-5 h-5" />
=======
              Enter Dashboard <ArrowRight className="w-5 h-5" />
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
<<<<<<< HEAD
              onClick={() => navigate('/home')}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400/50 flex items-center gap-2"
            >
              Learn More <ArrowRight className="w-5 h-5" />
=======
              onClick={() => navigate('/toolkit')}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400/50 flex items-center gap-2"
            >
              Try All Tools <ArrowRight className="w-5 h-5" />
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
            </motion.button>
          </div>
        </motion.div>
      </motion.section>

<<<<<<< HEAD
      {/* What We Offer Section */}
=======
      {/* Ad Section 1 - After Hero */}
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
<<<<<<< HEAD
        className="relative z-10 py-16 px-4 max-w-6xl mx-auto" 
        id="offerings"
      >
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-white mb-4 text-center"
        >
          Professional Tools Suite
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl text-gray-300 mb-12 text-center max-w-3xl mx-auto"
        >
          Our comprehensive collection of digital tools is designed to handle every aspect of file management and processing. 
          From basic operations to advanced features, we've got you covered with professional-grade functionality.
        </motion.p>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                {feature.free && (
                  <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                    FREE
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
=======
        className="relative z-10 py-8 px-4 max-w-4xl mx-auto"
      >
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
          <AdSense 
            adSlot="4643686467" 
            position="horizontal"
            className="text-center"
            style={{ minHeight: '90px' }}
          />
        </div>
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-16 px-4 max-w-6xl mx-auto" 
<<<<<<< HEAD
        id="why-choose-us"
=======
        id="why-us"
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
      >
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
<<<<<<< HEAD
          className="text-3xl md:text-4xl font-bold text-white mb-4 text-center"
        >
          Why Choose QuickSideTool?
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl text-gray-300 mb-12 text-center max-w-3xl mx-auto"
        >
          Built for speed, security, and simplicity. Our comprehensive toolkit provides everything you need to handle digital files professionally, 
          without the complexity or cost of traditional software solutions.
        </motion.p>
        
=======
          className="text-3xl md:text-4xl font-bold text-white mb-8 text-center"
        >
          Why Choose QuickSideTool?
        </motion.h2>
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
<<<<<<< HEAD
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {whyChooseUs.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-all duration-300"
            >
              <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center`}>
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
=======
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {whyChooseUs.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white/10 border border-white/10 rounded-2xl p-8 shadow-lg backdrop-blur-md text-center group hover:bg-white/15 transition-all duration-300"
            >
              <div className={`w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className={`w-8 h-8 ${item.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

<<<<<<< HEAD
      {/* What's Free Section */}
=======
      {/* Features Section */}
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-16 px-4 max-w-6xl mx-auto" 
<<<<<<< HEAD
        id="whats-free"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-2xl p-8 md:p-12 shadow-xl backdrop-blur-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything is Completely Free
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We believe powerful tools should be accessible to everyone. That's why we offer all our features completely free, 
              with no hidden costs, no premium tiers, and no limitations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                What's Included (Free Forever)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Coming Soon (Also Free)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {futureFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-300">
                    <Plus className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Feature Request Section */}
=======
        id="features"
      >
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-white mb-8 text-center"
        >
          Powerful Tools, Simple Interface
        </motion.h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white/10 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-md group hover:bg-white/15 transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Ad Section 2 - Before About */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-8 px-4 max-w-4xl mx-auto"
      >
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
          <AdSense 
            adSlot="2025261981" 
            position="horizontal"
            className="text-center"
            style={{ minHeight: '90px' }}
          />
        </div>
      </motion.section>

      {/* About Section */}
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-16 px-4 max-w-4xl mx-auto" 
<<<<<<< HEAD
        id="feature-request"
=======
        id="about"
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
<<<<<<< HEAD
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8 md:p-12 shadow-xl backdrop-blur-md text-center"
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Want Something New?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            We're constantly adding new features based on user requests. If there's a tool you need that we don't have yet, 
            let us know and we'll build it for you - completely free!
          </p>
          
          <form onSubmit={handleFeatureRequest} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={featureRequest}
                onChange={(e) => setFeatureRequest(e.target.value)}
                placeholder="Describe the feature you want..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                Request Feature
              </motion.button>
            </div>
          </form>
          
          <p className="text-sm text-gray-400 mt-4">
            We review every request and prioritize based on user demand. Your input shapes our roadmap!
          </p>
=======
          className="bg-white/10 border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl backdrop-blur-md"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
            About QuickSideTool
          </h2>
          <p className="text-gray-300 text-lg mb-6 leading-relaxed">
            QuickSideTool brings professional-grade tools right to your browser. Designed for productivity, it combines PDF manipulation, image processing, QR code generation, and even a fun mini-game - all in a beautiful, modern interface.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Client-side processing for privacy</li>
                <li>• No file uploads required</li>
                <li>• Secure, privacy-focused processing (client-side and server-side)</li>
                <li>• Cross-platform compatibility</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Perfect For</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Students and educators</li>
                <li>• Small businesses</li>
                <li>• Content creators</li>
                <li>• Anyone who works with files</li>
              </ul>
            </div>
          </div>
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
        </motion.div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-16 px-4 max-w-6xl mx-auto" 
        id="testimonials"
      >
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
<<<<<<< HEAD
          className="text-3xl md:text-4xl font-bold text-white mb-4 text-center"
        >
          What Our Users Say
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl text-gray-300 mb-12 text-center max-w-3xl mx-auto"
        >
          Join thousands of satisfied users who trust QuickSideTool for their daily file processing needs.
        </motion.p>
        
=======
          className="text-3xl md:text-4xl font-bold text-white mb-8 text-center"
        >
          What Our Users Say
        </motion.h2>
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
<<<<<<< HEAD
          className="grid md:grid-cols-2 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300"
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
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
=======
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white/10 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-md flex flex-col"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-200 text-sm mb-4 flex-grow">"{testimonial.text}"</p>
              <div>
                <p className="text-white font-semibold">{testimonial.name}</p>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

<<<<<<< HEAD
=======


>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
      {/* Newsletter Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-16 px-4 max-w-4xl mx-auto" 
        id="newsletter"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl backdrop-blur-md text-center"
        >
<<<<<<< HEAD
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get notified about new features, updates, and tips to boost your productivity. 
            We'll also let you know when your requested features are ready!
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
=======
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Get notified about new features, updates, and tips to boost your productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
<<<<<<< HEAD
              type="submit"
=======
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Subscribe
            </motion.button>
<<<<<<< HEAD
          </form>
          <p className="text-sm text-gray-400 mt-4">
            No spam, just useful updates. Unsubscribe anytime.
          </p>
=======
          </div>
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
        </motion.div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-16 px-4 max-w-4xl mx-auto" 
        id="contact"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl backdrop-blur-md"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
            Get in Touch
          </h2>
          <p className="text-gray-300 text-lg mb-8 text-center">
            Have questions, suggestions, or just want to say hello? We'd love to hear from you!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Contact Info</h3>
              <div className="space-y-3 text-gray-300">
<<<<<<< HEAD
                <p>📧 support@quicksidetool.com</p>
                <p>🌐 quicksidetool.com</p>
                <p>💬 <a href="https://discord.gg/5SufsJSj" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">Discord Community</a></p>
                <p>🐙 <a href="https://github.com/AmanYadav007/QuickSideTool" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">GitHub Repository</a></p>
=======
                                 <p>📧 support@quicksidetool.com</p>
                 <p>🌐 quicksidetool.com</p>
                 <p>💬 <a href="https://discord.gg/5SufsJSj" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">Discord Community</a></p>
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
<<<<<<< HEAD
                <a href="#offerings" className="block text-gray-300 hover:text-white transition-colors">Tools</a>
                <a href="#whats-free" className="block text-gray-300 hover:text-white transition-colors">What's Free</a>
                <a href="#feature-request" className="block text-gray-300 hover:text-white transition-colors">Request Features</a>
                <a href="#testimonials" className="block text-gray-300 hover:text-white transition-colors">Testimonials</a>
                <Link to="/about" className="block text-gray-300 hover:text-white transition-colors">About Us</Link>
                <Link to="/help" className="block text-gray-300 hover:text-white transition-colors">Help & Support</Link>
=======
                <a href="#features" className="block text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#about" className="block text-gray-300 hover:text-white transition-colors">About</a>
                <a href="#testimonials" className="block text-gray-300 hover:text-white transition-colors">Testimonials</a>
                <a href="https://github.com/AmanYadav007/QuickSideTool" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">GitHub</a>
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <Footer />
      <BuyMeACoffee />
      </div>
    </>
  );
};

export default LandingPage; 