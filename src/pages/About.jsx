import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  Shield, 
  Zap, 
  Heart, 
  Star,
  CheckCircle,
  TrendingUp,
  Clock,
  Smartphone
} from 'lucide-react';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
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

  const stats = [
    { icon: Users, value: "500K+", label: "Happy Users", color: "text-blue-400" },
    { icon: Target, value: "10M+", label: "Files Processed", color: "text-green-400" },
    { icon: Award, value: "99.9%", label: "Uptime", color: "text-purple-400" },
    { icon: Star, value: "4.8/5", label: "User Rating", color: "text-yellow-400" }
  ];

  const values = [
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your files never leave your device. We believe in complete privacy and security for all our users.",
      color: "text-green-400"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process files in seconds, not minutes. Our optimized algorithms ensure maximum efficiency.",
      color: "text-yellow-400"
    },
    {
      icon: Heart,
      title: "User Centric",
      description: "Every feature is designed with our users in mind. We listen, we improve, we deliver.",
      color: "text-red-400"
    },
    {
      icon: Globe,
      title: "Accessible Everywhere",
      description: "No downloads, no installations. Access our tools from any device, anywhere in the world.",
      color: "text-blue-400"
    }
  ];

  const team = [
    {
      name: "Aman Yadav",
      role: "Founder & Lead Developer",
      bio: "Passionate about creating tools that make people's lives easier. Believes in the power of technology to solve real-world problems.",
      expertise: ["Full-Stack Development", "UI/UX Design", "Product Strategy"]
    }
  ];

  return (
    <>
      <SEO 
        title="About QuickSideTool - Our Story, Mission, and Team"
        description="Learn about QuickSideTool's mission to provide free, secure, and powerful online tools. Discover our story, values, and the team behind the platform."
        keywords="about QuickSideTool, our story, mission, team, values, privacy-first tools, online PDF tools, image editor"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Navbar />
        
        <div className="relative z-10 pt-24">
          {/* Hero Section */}
          <motion.section 
            className="container mx-auto px-4 py-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="text-center mb-16"
              variants={itemVariants}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                About QuickSideTool
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                We're on a mission to democratize professional-grade digital tools, making them accessible to everyone, everywhere, for free.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
              variants={itemVariants}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.section>

          {/* Our Story */}
          <motion.section 
            className="container mx-auto px-4 py-16"
            variants={itemVariants}
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Story</h2>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 space-y-6">
                <p className="text-gray-300 leading-relaxed text-lg">
                  QuickSideTool was born from a simple frustration: the need for professional-quality digital tools that don't require expensive software or compromise on privacy. In today's digital world, everyone needs to work with PDFs, images, and documents, but the available solutions were either too expensive, too complicated, or too invasive.
                </p>
                
                <p className="text-gray-300 leading-relaxed text-lg">
                  We started with a simple question: "What if we could create tools that are as powerful as Adobe Acrobat, but completely free and privacy-focused?" This question led us to develop a suite of online tools that process files entirely in your browser, ensuring your data never leaves your device.
                </p>
                
                <p className="text-gray-300 leading-relaxed text-lg">
                  Today, QuickSideTool serves hundreds of thousands of users worldwide, from students and freelancers to small businesses and large corporations. Our commitment to privacy, ease of use, and powerful functionality has made us a trusted name in online document and image processing.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Mission & Vision */}
          <motion.section 
            className="container mx-auto px-4 py-16"
            variants={itemVariants}
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Mission & Vision</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="text-blue-400" size={32} />
                    <h3 className="text-2xl font-bold">Our Mission</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    To provide free, secure, and powerful digital tools that empower individuals and businesses to work more efficiently. We believe that professional-quality software should be accessible to everyone, regardless of their budget or technical expertise.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="text-green-400" size={32} />
                    <h3 className="text-2xl font-bold">Our Vision</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    To become the world's most trusted platform for online document and image processing, setting new standards for privacy, security, and user experience in the digital tools industry.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Values */}
          <motion.section 
            className="container mx-auto px-4 py-16"
            variants={itemVariants}
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Values</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full flex items-center justify-center`}>
                      <value.icon className={`w-8 h-8 ${value.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-gray-300 text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* What We Do */}
          <motion.section 
            className="container mx-auto px-4 py-16"
            variants={itemVariants}
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">What We Do</h2>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 space-y-6">
                <p className="text-gray-300 leading-relaxed text-lg">
                  QuickSideTool provides a comprehensive suite of online tools designed to handle all your digital file processing needs. Our platform includes powerful PDF tools, image editing capabilities, QR code generation, and even a fun mini-game for stress relief.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-blue-300">PDF Processing</h3>
                    <ul className="text-gray-300 space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Merge multiple PDFs into one
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Split large PDFs into smaller files
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Remove password protection
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Extract and remove hyperlinks
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-green-300">Image Tools</h3>
                    <ul className="text-gray-300 space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Resize images to any dimension
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Compress images without quality loss
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Convert between formats
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Batch processing capabilities
                      </li>
                    </ul>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed text-lg">
                  All our tools are designed with privacy in mind. Your files are processed entirely in your browser, ensuring they never leave your device. This approach not only protects your privacy but also provides lightning-fast processing speeds.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Team */}
          <motion.section 
            className="container mx-auto px-4 py-16"
            variants={itemVariants}
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Meet Our Team</h2>
              
              <div className="grid md:grid-cols-1 gap-8">
                {team.map((member, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Users className="w-12 h-12 text-white" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                        <p className="text-blue-400 mb-4">{member.role}</p>
                        <p className="text-gray-300 mb-4">{member.bio}</p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                          {member.expertise.map((skill, skillIndex) => (
                            <span key={skillIndex} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Why Choose Us */}
          <motion.section 
            className="container mx-auto px-4 py-16"
            variants={itemVariants}
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why Choose QuickSideTool?</h2>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Privacy-First Approach</h4>
                        <p className="text-gray-300 text-sm">Your files never leave your device. All processing happens locally in your browser.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Zap className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Lightning Fast</h4>
                        <p className="text-gray-300 text-sm">Process files in seconds, not minutes. Our optimized algorithms ensure maximum efficiency.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Smartphone className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Works Everywhere</h4>
                        <p className="text-gray-300 text-sm">No downloads required. Access our tools from any device with a web browser.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Heart className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Completely Free</h4>
                        <p className="text-gray-300 text-sm">No hidden fees, no premium tiers. All our core tools are completely free to use.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Always Available</h4>
                        <p className="text-gray-300 text-sm">99.9% uptime guarantee. Our tools are available whenever you need them.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Star className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Professional Quality</h4>
                        <p className="text-gray-300 text-sm">Enterprise-grade tools that rival expensive software like Adobe Acrobat.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Contact CTA */}
          <motion.section 
            className="container mx-auto px-4 py-16"
            variants={itemVariants}
          >
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-blue-500/30">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
                <p className="text-gray-300 mb-6 text-lg">
                  Have questions about QuickSideTool? Want to share feedback or suggest new features? We'd love to hear from you!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="mailto:support@quicksidetool.com"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                  >
                    Contact Us
                  </a>
                  <a 
                    href="https://discord.gg/5SufsJSj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-700 transition-all duration-300"
                  >
                    Join Our Community
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

export default About; 