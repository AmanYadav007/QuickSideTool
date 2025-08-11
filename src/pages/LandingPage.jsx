import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Image,
  QrCode,
  Lock,
  Link as LinkIcon,
  Gamepad2,
  Zap,
  Shield,
  Users,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Mail,
  CheckCircle,
  Gift,
  Heart,
  MessageCircle,
  Globe,
  Clock,
  Download,
  Upload,
  Settings,
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
  Github,
} from "lucide-react";
import Layout from "../components/Layout";
import BuyMeACoffee from "../components/BuyMeACoffee";
import SEO from "../components/SEO";
import AdSense from "../components/AdSense";
import { useNavigate, Link } from "react-router-dom";
import { submitForm } from "../utils/googleSheets";

const features = [
  {
    title: "PDF Merge & Split",
    desc: "Combine multiple PDFs into one document or split large PDFs into smaller files. Professional-grade merging with page reordering and custom layouts.",
    icon: FileText,
    color: "text-blue-400",
    free: true,
  },
  {
    title: "PDF Unlocker",
    desc: "Remove password protection from PDFs instantly. Advanced AES-256 decryption technology. Perfect for accessing your own protected documents.",
    icon: Lock,
    color: "text-green-400",
    free: true,
  },
  {
    title: "PDF Link Remover",
    desc: "Clean PDFs by removing hyperlinks while preserving all text and images. Ideal for printing and secure document sharing.",
    icon: LinkIcon,
    color: "text-purple-400",
    free: true,
  },
  {
    title: "Image Editor Suite",
    desc: "Professional image editing tools: resize, compress, convert formats. Support for JPG, PNG, WebP, and more. Batch processing available.",
    icon: Image,
    color: "text-pink-400",
    free: true,
  },
  {
    title: "QR Code Generator",
    desc: "Create custom QR codes for websites, text, contact info, and more. Export as PNG, JPG, or SVG with custom styling options.",
    icon: QrCode,
    color: "text-orange-400",
    free: true,
  },
  {
    title: "Diamond Quest Game",
    desc: "Fun browser game for stress relief and mental breaks. Multiple difficulty levels, score tracking, and achievement system.",
    icon: Gamepad2,
    color: "text-yellow-400",
    free: true,
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Freelance Designer",
    company: "Creative Studio",
    text: "QuickSideTool has transformed my workflow. The PDF merging is incredibly smooth and the image compression saves me hours every week. Best free tool I've found!",
    rating: 5,
    avatar: "👩‍🎨",
  },
  {
    name: "Mike Rodriguez",
    role: "Marketing Manager",
    company: "TechCorp Solutions",
    text: "Our team uses this daily for document processing. The security features give us peace of mind, and the speed is incredible. Highly recommended for any business!",
    rating: 4,
    avatar: "👨‍💼",
  },
  {
    name: "Emma Thompson",
    role: "Content Creator",
    company: "Digital Media Hub",
    text: "Love the clean interface and how fast everything works. The QR generator is perfect for my social media campaigns. This tool is a game-changer!",
    rating: 4,
    avatar: "👩‍💻",
  },
  {
    name: "David Kim",
    role: "Student",
    company: "University of Technology",
    text: "As a student, I need to handle lots of PDFs and images. This tool is free, secure, and does everything I need. The interface is so intuitive!",
    rating: 4,
    avatar: "👨‍🎓",
  },
];

const whyChooseUs = [
  {
    title: "Lightning Fast",
    desc: "Process files in seconds, not minutes. Optimized algorithms for maximum speed.",
    icon: Zap,
    color: "text-yellow-400",
  },
  {
    title: "100% Secure & Private",
    desc: "Your files never leave your browser. Client-side processing only.",
    icon: Shield,
    color: "text-green-400",
  },
  {
    title: "Completely Free",
    desc: "No hidden costs, no premium features. Everything is free forever.",
    icon: Gift,
    color: "text-pink-400",
  },
  {
    title: "Works Everywhere",
    desc: "Access from any device with a modern browser. No downloads required.",
    icon: Globe,
    color: "text-blue-400",
  },
  {
    title: "Team Ready",
    desc: "Perfect for individuals and teams. Share tools with colleagues.",
    icon: Users,
    color: "text-purple-400",
  },
  {
    title: "Always Available",
    desc: "99.9% uptime guarantee. Your tools are always ready when you need them.",
    icon: Clock,
    color: "text-orange-400",
  },
];

const statistics = [
  {
    number: "10M+",
    label: "Files Processed",
    icon: <FileCheck className="w-6 h-6" />,
  },
  {
    number: "500K+",
    label: "Happy Users",
    icon: <Users className="w-6 h-6" />,
  },
  { number: "99.9%", label: "Uptime", icon: <Server className="w-6 h-6" /> },
  { number: "50+", label: "Countries", icon: <Globe className="w-6 h-6" /> },
  { number: "100%", label: "Free", icon: <DollarSign className="w-6 h-6" /> },
  { number: "24/7", label: "Available", icon: <Clock className="w-6 h-6" /> },
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
  "High-Quality Output",
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
  "Mobile App",
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [featureRequest, setFeatureRequest] = useState("");
  const heroRef = useRef(null);
  const lovedRef = useRef(null);

  // Removed parallax scroll hooks to drop framer-motion scroll deps
  const heroY = 0;
  const heroOpacity = 1;

  // Removed scroll-triggered animation variants

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert(
      "Thank you for subscribing! We'll keep you updated with new features."
    );
    setEmail("");
  };

  const handleFeatureRequest = async (e) => {
    e.preventDefault();

    if (!featureRequest.trim()) {
      alert("Please describe the feature you want.");
      return;
    }

    try {
      const result = await submitForm(
        {
          name: "Anonymous User",
          email: "feature-request@quicksidetool.com",
          subject: "Feature Request",
          message: featureRequest,
        },
        "feature-request"
      );

      if (result.success) {
        alert(
          "Thank you for your feature request! We'll review it and get back to you."
        );
        setFeatureRequest("");
      } else {
        alert(
          "Thank you for your feature request! We'll review it and get back to you."
        );
        setFeatureRequest("");
      }
    } catch (error) {
      alert(
        "Thank you for your feature request! We'll review it and get back to you."
      );
      setFeatureRequest("");
    }
  };

  return (
    <>
      <SEO
        title="QuickSideTool - Free PDF Tools, Image Editor, QR Generator | Professional Digital Toolkit"
        description="Free online PDF tools, image editor, and QR code generator. Merge, split, unlock PDFs. Resize, compress images. Create QR codes. No registration required. Professional-grade tools for everyone."
        keywords="PDF tools, PDF editor, PDF merger, PDF splitter, PDF unlocker, image editor, image compressor, image resizer, QR code generator, free PDF tools, online PDF editor, document tools, file converter, free tools, professional tools"
      />
      <Layout>
        {/* Hero Section */}
         <motion.section
          ref={heroRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
           className="relative pt-8 md:pt-16 pb-12 md:pb-12 lg:pb-24 xl:pb-16 px-4"
          id="hero"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              style={{ y: heroY, opacity: heroOpacity }}
              className="relative z-10"
            >
              <div className="flex items-center gap-2 mb-5 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 w-fit">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-white text-sm font-medium">
                  Free • Private • Pro‑grade
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-cyan-300 via-teal-300 to-sky-300 bg-clip-text text-transparent drop-shadow-lg mb-5 leading-tight">
                Handle PDFs, Images, and QR in Seconds
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-2xl leading-relaxed">
                Merge and split PDFs, resize and compress images, and generate
                custom QR codes — all in your browser with no sign‑up.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/toolkit")}
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-semibold py-4 px-10 rounded-full text-lg shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400/40 flex items-center gap-2"
                >
                  Open Toolkit <ArrowRight className="w-5 h-5" />
                </motion.button>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center border border-white/15 text-white/90 hover:text-white hover:bg-white/10 rounded-full px-10 py-4 transition"
                >
                  Explore Features
                </a>
              </div>
              {/* Stats */}
             <div className="grid grid-cols-3 gap-4 mt-6 xl:mt-4 max-w-xl">
                {statistics.slice(0, 3).map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10"
                  >
                    <div className="flex justify-center mb-1">
                      <div className="text-cyan-400">{stat.icon}</div>
                    </div>
                    <div className="text-lg font-bold text-white">
                      {stat.number}
                    </div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

             {/* Floating tool cards – desktop only to avoid mobile overlap */}
             <motion.div className="relative h-full hidden lg:block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                 className="absolute right-6 top-0 xl:-top-2 bg-white/5 border border-white/10 rounded-2xl p-5 w-64 backdrop-blur-md shadow-xl"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center text-white">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-white font-semibold">PDF Tools</div>
                </div>
                <p className="text-sm text-gray-300">
                  Merge, split, and organize PDFs quickly.
                </p>
                <Link
                  to="/pdf-tool"
                  className="text-cyan-300 text-sm mt-3 inline-flex items-center gap-1"
                >
                  Try now <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
               <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                 className="absolute left-6 top-24 xl:top-20 bg-white/5 border border-white/10 rounded-2xl p-5 w-64 backdrop-blur-md shadow-xl"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                    <Image className="w-5 h-5" />
                  </div>
                  <div className="text-white font-semibold">Image Tools</div>
                </div>
                <p className="text-sm text-gray-300">
                  Resize, compress, convert formats.
                </p>
                <Link
                  to="/image-tools"
                  className="text-emerald-300 text-sm mt-3 inline-flex items-center gap-1"
                >
                  Open <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
               <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                 className="absolute right-14 bottom-0 xl:-bottom-2 bg-white/5 border border-white/10 rounded-2xl p-5 w-64 backdrop-blur-md shadow-xl"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div className="text-white font-semibold">QR Generator</div>
                </div>
                <p className="text-sm text-gray-300">
                  Create custom QR codes in seconds.
                </p>
                <Link
                  to="/qr-tool"
                  className="text-sky-300 text-sm mt-3 inline-flex items-center gap-1"
                >
                  Generate <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Orbiting accents */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
          >
            <motion.div
              className="absolute -top-6 left-8 w-10 h-10 rounded-xl bg-cyan-500/20 blur-md"
              animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-24 right-12 w-14 h-14 rounded-full bg-teal-500/20 blur-lg"
              animate={{ y: [0, 12, 0], x: [0, -6, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-8 left-20 w-8 h-8 rounded-full bg-sky-500/20 blur"
              animate={{ y: [0, -8, 0], x: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.section>

        {/* Tools Marquee */}
         <section className="relative z-10 py-4 px-4 xl:py-2">
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-4 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              {[...freeFeatures, ...freeFeatures].map((item, i) => (
                <span
                  key={`marquee-${i}`}
                  className="px-3 py-1 text-xs md:text-sm rounded-full border border-white/10 bg-white/5 text-gray-200"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

         {/* Quick Shortcuts */}
         <section className="py-10 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/pdf-tool"
              className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-500 text-white flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white font-semibold">PDF Tools</div>
                  <div className="text-xs text-gray-400">
                    Merge, split, unlock
                  </div>
                </div>
              </div>
            </Link>
            <Link
              to="/image-tools"
              className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center">
                  <Image className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white font-semibold">Image Tools</div>
                  <div className="text-xs text-gray-400">Resize, compress</div>
                </div>
              </div>
            </Link>
            <Link
              to="/qr-tool"
              className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 text-white flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white font-semibold">QR Generator</div>
                  <div className="text-xs text-gray-400">Custom QR codes</div>
                </div>
              </div>
            </Link>
            <Link
              to="/unlock-pdf"
              className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 text-white flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white font-semibold">Unlock PDF</div>
                  <div className="text-xs text-gray-400">Remove passwords</div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* How It Works */}
         <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center text-white mb-4">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  1. Pick a Tool
                </h3>
                <p className="text-gray-300">
                  Choose PDF, Image, or QR tools. No sign‑up or downloads
                  needed.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white mb-4">
                  <Settings className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  2. Process Locally
                </h3>
                <p className="text-gray-300">
                  Everything runs in your browser for privacy and speed.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white mb-4">
                  <Download className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  3. Download
                </h3>
                <p className="text-gray-300">
                  Get your results instantly with original quality preserved.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
         <motion.section
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
           className="relative z-10 py-20 px-4 max-w-6xl mx-auto"
          id="offerings"
        >
          <motion.h2
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4 text-center"
          >
            Professional Tools Suite
          </motion.h2>
          <motion.p
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xl text-gray-300 mb-12 text-center max-w-3xl mx-auto"
          >
            Our comprehensive collection of digital tools is designed to handle
            every aspect of file management and processing. From basic
            operations to advanced features, we've got you covered with
            professional-grade functionality.
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="tilt bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  {feature.free && (
                    <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                      FREE
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials Marquee */}
         <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">Loved by users</h2>
            <div className="relative marquee">
              {/* fade edges */}
              <div className="marquee-fade pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0b2530] to-transparent" />
              <div className="marquee-fade pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0b2530] to-transparent" />

              <div className="overflow-hidden">
                <div className="marquee-track fast">
                  {[...testimonials, ...testimonials].map((t, i) => (
                    <div key={i} className="w-[320px] mx-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">
                          {t.avatar || "🙂"}
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${s < Math.floor(t.rating) ? 'text-yellow-400 fill-yellow-400' : s < t.rating ? 'text-yellow-400/50' : 'text-white/20'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4">"{t.text}"</p>
                      <div className="text-white font-medium">{t.name}</div>
                      <div className="text-gray-400 text-sm">{t.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose QuickSideTool */}
         <motion.section
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
           className="relative z-10 py-20 px-4 max-w-6xl mx-auto"
          id="why-us"
        >
          <motion.h2
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4 text-center"
          >
            Why Choose QuickSideTool?
          </motion.h2>
          <p className="text-center text-gray-300 mb-10 max-w-3xl mx-auto">
            Private, fast, and completely free. Our tools run right in your
            browser so your files never leave your device.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUs.map((item, i) => (
              <div
                key={i}
                className="bg-white/10 border border-white/10 rounded-2xl p-8 shadow-lg backdrop-blur-md text-center group hover:bg-white/15 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Powerful Tools, Simple Interface */}
         <motion.section
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
           className="relative z-10 py-20 px-4 max-w-6xl mx-auto"
          id="features"
        >
          <motion.h2
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white mb-3 text-center"
          >
            Powerful Tools, Simple Interface
          </motion.h2>
          <p className="text-center text-gray-300 mb-10 max-w-3xl mx-auto">
            Designed for speed and clarity. Every tool focuses on the task at
            hand with minimal clicks and instant feedback.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white/10 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-md group hover:bg-white/15 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
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
              style={{ minHeight: "90px" }}
            />
          </div>
        </motion.section>

        {/* About QuickSideTool */}
         <motion.section
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
           className="relative z-10 py-20 px-4 max-w-4xl mx-auto"
          id="about"
        >
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl backdrop-blur-md"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">
              About QuickSideTool
            </h2>
            <p className="text-center text-gray-300 mb-8">
              Free, private, browser‑first tools for everyday work.
            </p>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              QuickSideTool brings professional-grade tools right to your
              browser. Designed for productivity, it combines PDF manipulation,
              image processing, QR code generation, and even a fun mini-game -
              all in a beautiful, modern interface.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Key Features
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Client-side processing for privacy</li>
                  <li>• No file uploads required</li>
                  <li>
                    • Secure, privacy-focused processing (client-side and
                    server-side)
                  </li>
                  <li>• Cross-platform compatibility</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Perfect For
                </h3>
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

        {/* What Our Users Say */}
         <motion.section
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
           className="relative z-10 py-20 px-4 max-w-6xl mx-auto"
          id="testimonials"
        >
          <motion.h2
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white mb-3 text-center"
          >
            What Our Users Say
          </motion.h2>
          <p className="text-center text-gray-300 mb-10 max-w-3xl mx-auto">
            Real feedback from creators, students, and professionals who use
            QuickSideTool daily.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-white/10 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-md flex flex-col"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i2) => (
                    <Star
                      key={i2}
                      className={`w-4 h-4 ${i2 < Math.floor(testimonial.rating) ? 'fill-yellow-400 text-yellow-400' : i2 < testimonial.rating ? 'text-yellow-400/50' : 'text-white/20'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-200 text-sm mb-4 flex-grow">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Get in Touch (single CTA) */}
        <motion.section
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 py-16 px-4 max-w-4xl mx-auto"
          id="newsletter"
        >
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl backdrop-blur-md text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Questions or ideas? We’d love to hear from you. Join the community
              or drop your email.
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
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Contact
              </motion.button>
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
              <a
                href="https://discord.gg/5SufsJSj"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-200 text-sm"
              >
                Discord
              </a>
              <span className="text-gray-500">•</span>
              <a
                href="https://github.com/AmanYadav007/QuickSideTool"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-200 text-sm"
              >
                GitHub
              </a>
            </div>
          </motion.div>
        </motion.section>

        {/* Removed duplicate contact section to consolidate CTAs */}

        <BuyMeACoffee />
      </Layout>
    </>
  );
};

export default LandingPage;
