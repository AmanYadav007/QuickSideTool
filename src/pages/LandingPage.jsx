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
  CheckCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimatedBackground from '../components/AnimatedBackground';
import CountdownTimer from '../components/CountdownTimer';
import BuyMeACoffee from '../components/BuyMeACoffee';
import SEO from '../components/SEO';
import AdSense from '../components/AdSense';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    title: 'PDF Merge & Split',
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
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Freelance Designer',
    text: 'This tool saved me hours every week. The PDF merging is incredibly smooth!',
    rating: 5
  },
  {
    name: 'Mike Rodriguez',
    role: 'Marketing Manager',
    text: 'Perfect for our team. The image compression feature is a game-changer.',
    rating: 5
  },
  {
    name: 'Emma Thompson',
    role: 'Content Creator',
    text: 'Love the clean interface and how fast everything works. Highly recommended!',
    rating: 5
  }
];

const whyChooseUs = [
  {
    title: 'Lightning Fast',
    desc: 'Process files in seconds, not minutes',
    icon: Zap,
    color: 'text-yellow-400'
  },
  {
    title: 'Secure & Private',
    desc: 'Your files never leave your browser',
    icon: Shield,
    color: 'text-green-400'
  },
  {
    title: 'Team Ready',
    desc: 'Perfect for individuals and teams',
    icon: Users,
    color: 'text-blue-400'
  }
];

const LandingPage = () => {
  const navigate = useNavigate();

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

  return (
    <>
      <SEO 
        title="QuickSideTool - Free PDF Tools, Image Editor, QR Generator | Alternative to Adobe"
        description="Free online PDF tools, image editor, and QR code generator. Merge, split, unlock PDFs. Resize, compress images. Create QR codes. No registration required. Better than Adobe Acrobat."
        keywords="PDF tools, PDF editor, PDF merger, PDF splitter, PDF unlocker, image editor, image compressor, image resizer, QR code generator, free PDF tools, Adobe alternative, online PDF editor, PDF to image, image to PDF, document tools, file converter"
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
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/toolkit')}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 flex items-center gap-2"
            >
              Enter Dashboard <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/toolkit')}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400/50 flex items-center gap-2"
            >
              Try All Tools <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </motion.section>

      {/* Ad Section 1 - After Hero */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
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
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-16 px-4 max-w-6xl mx-auto" 
        id="why-us"
      >
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-white mb-8 text-center"
        >
          Why Choose QuickSideTool?
        </motion.h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
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
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-16 px-4 max-w-6xl mx-auto" 
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
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-16 px-4 max-w-4xl mx-auto" 
        id="about"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
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
          className="text-3xl md:text-4xl font-bold text-white mb-8 text-center"
        >
          What Our Users Say
        </motion.h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
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
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>



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
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Subscribe
            </motion.button>
          </div>
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
                                 <p>📧 support@quicksidetool.com</p>
                 <p>🌐 quicksidetool.com</p>
                 <p>💬 <a href="https://discord.gg/5SufsJSj" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">Discord Community</a></p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#features" className="block text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#about" className="block text-gray-300 hover:text-white transition-colors">About</a>
                <a href="#testimonials" className="block text-gray-300 hover:text-white transition-colors">Testimonials</a>
                <a href="https://github.com/AmanYadav007/QuickSideTool" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">GitHub</a>
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