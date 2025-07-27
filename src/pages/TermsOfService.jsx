import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, AlertTriangle, CheckCircle, XCircle, Users, Globe, Scale } from 'lucide-react';
import SEO from '../components/SEO';

const TermsOfService = () => {
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
        title="Terms of Service - QuickSideTool"
        description="Read QuickSideTool's Terms of Service to understand your rights and responsibilities when using our PDF and image tools."
        keywords="terms of service, user agreement, QuickSideTool, legal terms, service conditions"
        canonical="/terms"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <motion.div 
            className="container mx-auto px-4 py-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="text-center mb-12"
              variants={itemVariants}
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-blue-500/20 rounded-full">
                  <FileText size={48} className="text-blue-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Terms of Service
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Please read these terms carefully before using QuickSideTool. By using our services, you agree to these terms.
              </p>
              <p className="text-sm text-gray-400 mt-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </motion.div>

            {/* Content */}
            <motion.div 
              className="max-w-4xl mx-auto space-y-8"
              variants={itemVariants}
            >
              {/* Introduction */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <FileText className="text-blue-400" />
                  Agreement to Terms
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  These Terms of Service ("Terms") govern your use of QuickSideTool ("Service") operated by QuickSideTool ("we," "us," or "our").
                </p>
                <p className="text-gray-300 leading-relaxed mt-4">
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
                </p>
              </section>

              {/* Service Description */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Globe className="text-green-400" />
                  Service Description
                </h2>
                
                <p className="text-gray-300 mb-4">
                  QuickSideTool provides online tools for:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">PDF Tools</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Merge and split PDFs</li>
                      <li>• Remove password protection</li>
                      <li>• Remove hyperlinks</li>
                      <li>• Page manipulation</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-300 mb-2">Image Tools</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Resize images</li>
                      <li>• Compress images</li>
                      <li>• Format conversion</li>
                      <li>• Batch processing</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-300 mb-2">QR Code Generator</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Custom QR codes</li>
                      <li>• Multiple formats</li>
                      <li>• Color customization</li>
                      <li>• Size options</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-300 mb-2">Games & Entertainment</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Diamond Quest game</li>
                      <li>• Stress relief</li>
                      <li>• Score tracking</li>
                      <li>• Multiple difficulty levels</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* User Responsibilities */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Users className="text-purple-400" />
                  User Responsibilities
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-green-300 flex items-center gap-2">
                      <CheckCircle size={20} />
                      What You Can Do
                    </h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li>Use our tools for personal and business purposes</li>
                      <li>Process your own files and documents</li>
                      <li>Share processed files with others</li>
                      <li>Use our services for educational purposes</li>
                      <li>Contact us for support and feedback</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-red-300 flex items-center gap-2">
                      <XCircle size={20} />
                      What You Cannot Do
                    </h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li>Upload files that violate copyright or intellectual property rights</li>
                      <li>Use our services for illegal activities</li>
                      <li>Attempt to reverse engineer or hack our systems</li>
                      <li>Upload malicious files or viruses</li>
                      <li>Use automated tools to overload our servers</li>
                      <li>Share inappropriate or offensive content</li>
                      <li>Violate any applicable laws or regulations</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Privacy and Data */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Shield className="text-blue-400" />
                  Privacy and Data Protection
                </h2>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-200 font-medium mb-1">
                        Important Privacy Notice
                      </p>
                      <p className="text-xs text-blue-300">
                        All file processing is done locally in your browser. Your files never leave your device and are not stored on our servers.
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information.
                </p>
                
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>We do not store or access your uploaded files</li>
                  <li>All processing happens in your browser</li>
                  <li>We may collect usage analytics to improve our services</li>
                  <li>We use cookies as described in our Privacy Policy</li>
                  <li>You can control your privacy settings through our consent manager</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Scale className="text-yellow-400" />
                  Intellectual Property
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-blue-300">Our Rights</h3>
                    <p className="text-gray-300">
                      QuickSideTool and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-green-300">Your Rights</h3>
                    <p className="text-gray-300">
                      You retain all rights to your uploaded files and processed content. We do not claim ownership of any files you upload or process through our services.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-purple-300">Third-Party Content</h3>
                    <p className="text-gray-300">
                      Our service may contain links to third-party websites or services. We are not responsible for the content or privacy practices of these third-party sites.
                    </p>
                  </div>
                </div>
              </section>

              {/* Disclaimers */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <AlertTriangle className="text-orange-400" />
                  Disclaimers and Limitations
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-300 mb-2">Service Availability</h4>
                    <p className="text-sm text-orange-200">
                      Our service is provided "as is" and "as available." We do not guarantee uninterrupted access or error-free operation.
                    </p>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-red-300 mb-2">No Warranty</h4>
                    <p className="text-sm text-red-200">
                      We disclaim all warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
                    </p>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-300 mb-2">Limitation of Liability</h4>
                    <p className="text-sm text-yellow-200">
                      In no event shall QuickSideTool be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our service.
                    </p>
                  </div>
                </div>
              </section>

              {/* Termination */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <XCircle className="text-red-400" />
                  Termination
                </h2>
                
                <p className="text-gray-300 mb-4">
                  We may terminate or suspend your access to our service immediately, without prior notice, for any reason, including breach of these Terms.
                </p>
                
                <p className="text-gray-300">
                  Upon termination, your right to use the service will cease immediately. All provisions of these Terms which by their nature should survive termination shall survive termination.
                </p>
              </section>

              {/* Governing Law */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Scale className="text-blue-400" />
                  Governing Law
                </h2>
                
                <p className="text-gray-300">
                  These Terms shall be interpreted and governed by the laws of the jurisdiction in which QuickSideTool operates, without regard to its conflict of law provisions.
                </p>
              </section>

              {/* Changes to Terms */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <FileText className="text-purple-400" />
                  Changes to Terms
                </h2>
                
                <p className="text-gray-300">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              {/* Contact Information */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Users className="text-green-400" />
                  Contact Information
                </h2>
                
                <p className="text-gray-300 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">Email</h4>
                    <p className="text-gray-300">
                      legal@quicksidetool.com
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-300 mb-2">Website</h4>
                    <p className="text-gray-300">
                      quicksidetool.com
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-300 mt-6">
                  We will respond to your inquiry within 30 days of receipt.
                </p>
              </section>

              {/* Agreement */}
              <section className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-green-300">
                  <CheckCircle className="text-green-400" />
                  Agreement
                </h2>
                
                <p className="text-gray-300">
                  By using QuickSideTool, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
                </p>
                
                <p className="text-gray-300 mt-4">
                  If you do not agree to these terms, please do not use our service.
                </p>
              </section>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService; 