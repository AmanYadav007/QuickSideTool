import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Cookie, Users, Mail, Phone, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
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
        title="Privacy Policy - QuickSideTool"
        description="Learn how QuickSideTool protects your privacy and handles your data. Our comprehensive privacy policy explains data collection, usage, and your rights under GDPR."
        keywords="privacy policy, data protection, GDPR, cookies, QuickSideTool, user privacy"
        canonical="/privacy"
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
                  <Shield size={48} className="text-blue-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Your privacy is important to us. This policy explains how QuickSideTool collects, uses, and protects your information.
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
                  <Eye className="text-blue-400" />
                  Introduction
                </h2>
                
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Shield size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-green-200 font-medium mb-1">
                        Privacy-First Approach
                      </p>
                      <p className="text-xs text-green-300">
                        QuickSideTool is designed with privacy as the foundation. We don't collect, store, or process any personal data.
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed">
                  QuickSideTool ("we," "our," or "us") is committed to protecting your privacy through a <strong>zero-data collection</strong> approach. This Privacy Policy explains our privacy practices and how we handle your information when you use our website and services.
                </p>
                <p className="text-gray-300 leading-relaxed mt-4">
                  Unlike most online tools, QuickSideTool operates without collecting personal information. Your files are processed entirely in your browser and never leave your device. By using QuickSideTool, you can be confident that your privacy is protected.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Database className="text-green-400" />
                  Information We Collect
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-green-200 font-medium mb-1">
                          No Personal Data Collection
                        </p>
                        <p className="text-xs text-green-300">
                          QuickSideTool does not collect, store, or process any personal information. We have no database and do not track individual users.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-blue-300">What We Don't Collect</h3>
                    <p className="text-gray-300 mb-3">
                      Unlike many online tools, QuickSideTool does NOT collect:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li>Personal information (names, emails, addresses)</li>
                      <li>User accounts or profiles</li>
                      <li>File content or documents</li>
                      <li>Usage patterns or behavior data</li>
                      <li>IP addresses or location data</li>
                      <li>Any data that could identify you personally</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-green-300">What We May Collect (Optional)</h3>
                    <p className="text-gray-300 mb-3">
                      The only information we might collect is through:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li><strong>Contact Forms:</strong> If you choose to contact us directly</li>
                      <li><strong>Analytics Cookies:</strong> Only if you consent (see Cookie Policy)</li>
                      <li><strong>Ad Cookies:</strong> Only if you consent (see Cookie Policy)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-purple-300">File Processing - 100% Local</h3>
                    <p className="text-gray-300">
                      <strong>Important:</strong> All file processing (PDFs, images) is done entirely in your browser. 
                      Your files never leave your device and are not stored on our servers. We cannot access, view, or store your files.
                    </p>
                  </div>
                </div>
              </section>

              {/* How We Use Your Information */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Users className="text-purple-400" />
                  How We Use Your Information
                </h2>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Shield size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-200 font-medium mb-1">
                        Minimal Data Usage
                      </p>
                      <p className="text-xs text-blue-300">
                        Since we don't collect personal data, there's very little information to use. Your privacy is our priority.
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">
                  Since QuickSideTool operates without collecting personal data, our data usage is extremely limited:
                </p>
                
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li><strong>No Personal Data:</strong> We don't have any personal information to use</li>
                  <li><strong>No User Profiles:</strong> We don't create or maintain user accounts</li>
                  <li><strong>No File Storage:</strong> Your files are never stored on our servers</li>
                  <li><strong>Optional Analytics:</strong> Only if you consent to cookies (anonymous data)</li>
                  <li><strong>Contact Responses:</strong> Only if you choose to contact us directly</li>
                  <li><strong>Legal Compliance:</strong> Minimal data required for legal obligations</li>
                </ul>
              </section>

              {/* Cookies and Tracking */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Cookie className="text-yellow-400" />
                  Cookies and Tracking Technologies
                </h2>
                
                <p className="text-gray-300 mb-4">
                  We use cookies and similar tracking technologies to enhance your experience:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">Necessary Cookies</h4>
                    <p className="text-sm text-gray-300">
                      Essential for website functionality. Cannot be disabled.
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-300 mb-2">Analytics Cookies</h4>
                    <p className="text-sm text-gray-300">
                      Help us understand how you use our site to improve services.
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-300 mb-2">Marketing Cookies</h4>
                    <p className="text-sm text-gray-300">
                      Used to show relevant advertisements and measure ad performance.
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-300 mb-2">Preference Cookies</h4>
                    <p className="text-sm text-gray-300">
                      Remember your settings and preferences for a better experience.
                    </p>
                  </div>
                </div>

                <p className="text-gray-300 mt-6">
                  You can manage your cookie preferences using our consent management tool located at the bottom right of our website.
                </p>
              </section>

              {/* Data Sharing */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Lock className="text-red-400" />
                  Data Sharing and Disclosure
                </h2>
                
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-green-200 font-medium mb-1">
                        No Data to Share
                      </p>
                      <p className="text-xs text-green-300">
                        Since we don't collect personal data, there's nothing to share, sell, or disclose to third parties.
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">
                  QuickSideTool's privacy-first approach means we have minimal data sharing:
                </p>
                
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li><strong>No Personal Data:</strong> We don't collect personal information, so there's nothing to share</li>
                  <li><strong>No User Data:</strong> We don't have user accounts or profiles to disclose</li>
                  <li><strong>No File Data:</strong> Your files never leave your device, so they can't be shared</li>
                  <li><strong>Optional Analytics:</strong> Only anonymous, aggregated data (if you consent to cookies)</li>
                  <li><strong>Legal Requirements:</strong> Minimal data sharing only when legally required</li>
                  <li><strong>No Third-Party Sales:</strong> We never sell or rent any user data</li>
                </ul>
              </section>

              {/* Your Rights */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Shield className="text-green-400" />
                  Your Privacy Rights
                </h2>
                
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-green-200 font-medium mb-1">
                        Maximum Privacy Protection
                      </p>
                      <p className="text-xs text-green-300">
                        Since we don't collect personal data, your privacy is automatically protected. No data = no privacy concerns.
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">
                  Under GDPR and other privacy laws, you have the following rights. However, since we don't collect personal data, most of these don't apply:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">Access</h4>
                    <p className="text-sm text-gray-300">
                      Request a copy of your personal data (we have none to provide)
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-300 mb-2">Rectification</h4>
                    <p className="text-sm text-gray-300">
                      Correct inaccurate personal data (no data to correct)
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-300 mb-2">Erasure</h4>
                    <p className="text-sm text-gray-300">
                      Request deletion of your personal data (already deleted - we don't store any)
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-300 mb-2">Portability</h4>
                    <p className="text-sm text-gray-300">
                      Receive your data in a portable format (no data to export)
                    </p>
                  </div>
                </div>

                <p className="text-gray-300 mt-6">
                  <strong>Cookie Consent:</strong> You can manage your cookie preferences using our consent manager at any time.
                </p>
                
                <p className="text-gray-300 mt-4">
                  If you have any questions about your privacy rights, please contact us using the information provided below.
                </p>
              </section>

              {/* Data Security */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Lock className="text-green-400" />
                  Data Security
                </h2>
                
                <p className="text-gray-300 mb-4">
                  We implement appropriate technical and organizational measures to protect your information:
                </p>
                
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>SSL encryption for all data transmission</li>
                  <li>Secure hosting and infrastructure</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication</li>
                  <li>Data backup and recovery procedures</li>
                </ul>
                
                <p className="text-gray-300 mt-4">
                  However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                </p>
              </section>

              {/* Children's Privacy */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Users className="text-pink-400" />
                  Children's Privacy
                </h2>
                
                <p className="text-gray-300">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. 
                  If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                </p>
              </section>

              {/* International Transfers */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Database className="text-orange-400" />
                  International Data Transfers
                </h2>
                
                <p className="text-gray-300">
                  Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
                </p>
              </section>

              {/* Changes to Policy */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Eye className="text-blue-400" />
                  Changes to This Policy
                </h2>
                
                <p className="text-gray-300">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. 
                  We encourage you to review this policy periodically for any changes.
                </p>
              </section>

              {/* Contact Information */}
              <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Mail className="text-blue-400" />
                  Contact Us
                </h2>
                
                <p className="text-gray-300 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                      <Mail size={20} />
                      Email
                    </h4>
                    <p className="text-gray-300">
                      privacy@quicksidetool.com
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-300 mb-2 flex items-center gap-2">
                      <Phone size={20} />
                      Website
                    </h4>
                    <p className="text-gray-300">
                      quicksidetool.com
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-300 mt-6">
                  We will respond to your inquiry within 30 days of receipt.
                </p>
              </section>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy; 