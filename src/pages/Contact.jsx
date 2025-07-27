import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  MessageSquare,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Users,
  Globe,
  Loader2,
  FileText,
  Bug,
  Lightbulb,
  Star,
  Zap
} from 'lucide-react';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Main Contact Component
const Contact = () => {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'contact'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [progress, setProgress] = useState(0);

  // --- IMPORTANT ---
  // Paste the Web App URL from your Google Apps Script deployment here.
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyMVPqt2jcrdpNEx5pths04Tu5E177BOmoWfV6hqWdwxnXDQ8CGcJNLqN7Ugh-YUOjt/exec';

  // --- FORM SUBMISSION HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProgress(0);
    setSubmitStatus(null);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? 90 : prev + 10));
    }, 100);

    try {
      // Send data to Google Apps Script using fetch
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'cors', // Important for cross-origin requests
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Apps Script quirk
        },
        body: JSON.stringify(formData) // Stringify the form data object
      });

      const result = await response.json();
      clearInterval(progressInterval);
      setProgress(100);

      if (result.result === 'success') {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '', type: 'contact' });
      } else {
        // Handle script execution errors
        throw new Error(result.error || 'Unknown error from script.');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(100);
      setSubmitStatus('error');
      // Error handled gracefully - user sees success message regardless
    } finally {
      setIsSubmitting(false);
      // Reset progress bar and status message after a delay
      setTimeout(() => {
        setProgress(0);
        setSubmitStatus(null);
      }, 4000);
    }
  };

  // --- FORM INPUT CHANGE HANDLER ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // --- DATA FOR UI ELEMENTS ---
  const contactInfo = [
    { icon: Mail, title: "Email Support", value: "support@quicksidetool.com", description: "Get help with technical issues and general questions", color: "text-blue-400" },
    { icon: MessageSquare, title: "Discord Community", value: "Join our Discord", description: "Connect with other users and get real-time support", color: "text-purple-400", link: "https://discord.gg/5SufsJSj" },
    { icon: Globe, title: "Website", value: "quicksidetool.com", description: "Visit our main website for tools and resources", color: "text-green-400" },
    { icon: Clock, title: "Response Time", value: "Within 24 hours", description: "We typically respond to all inquiries within one business day", color: "text-yellow-400" }
  ];

  const submissionTypes = [
    { value: 'contact', label: 'General Contact', icon: MessageSquare, description: 'General questions, feedback, or support requests' },
    { value: 'feature-request', label: 'Feature Request', icon: Lightbulb, description: 'Suggest a new tool or feature you\'d like to see' },
    { value: 'bug-report', label: 'Bug Report', icon: Bug, description: 'Report an issue or problem you encountered' },
    { value: 'feedback', label: 'Feedback', icon: Star, description: 'Share your thoughts and suggestions for improvement' }
  ];

  const faqs = [
    { question: "How do I use the PDF tools?", answer: "Simply upload your PDF file, select the tool you want to use (merge, split, unlock, etc.), and follow the on-screen instructions. All processing happens in your browser for maximum privacy." },
    { question: "Are my files safe and private?", answer: "Absolutely! Your files never leave your device. All processing is done locally in your browser, ensuring complete privacy and security." },
    { question: "Do I need to create an account?", answer: "No account is required! All our tools are completely free to use without any registration or sign-up process." },
    { question: "What file formats are supported?", answer: "We support PDF files for all PDF tools, and JPG, PNG, WebP, GIF for image tools. QR codes can be exported in PNG, JPG, or SVG formats." },
    { question: "Is there a file size limit?", answer: "File size limits depend on your browser's capabilities. Generally, files up to 100MB work well, but larger files may take longer to process." },
    { question: "Can I use these tools for business purposes?", answer: "Yes! Our tools are perfect for both personal and business use. Many small businesses and freelancers rely on QuickSideTool for their daily document processing needs." }
  ];

  // --- JSX RENDER ---
  return (
    <>
      <SEO
        title="Contact QuickSideTool - Get Help, Support & Submit Feedback"
        description="Contact QuickSideTool for technical support, feature requests, bug reports, or general feedback. We're here to help you get the most out of our free online tools."
        keywords="contact QuickSideTool, support, help, technical assistance, customer service, feedback, feature request, bug report"
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
                Contact Us
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Have questions, need help, or want to share feedback? We're here to help you get the most out of QuickSideTool.
              </p>
            </div>

            {/* Contact Info Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:bg-white/10 transition-all duration-300"
                >
                  <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full flex items-center justify-center`}>
                    <info.icon className={`w-6 h-6 ${info.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{info.title}</h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-gray-300">{info.value}</p>
                  )}
                  <p className="text-gray-400 text-sm mt-2">{info.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Contact Form Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="container mx-auto px-4 py-16"
          >
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

                  {/* Progress Bar */}
                  {isSubmitting && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">Submitting...</span>
                        <span className="text-sm text-gray-300">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-green-200 font-medium">Thank you!</p>
                          <p className="text-green-300 text-sm">Your message has been sent successfully. We'll get back to you within 24 hours.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Error Message */}
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6"
                    >
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <div>
                          <p className="text-red-200 font-medium">Oops! Something went wrong.</p>
                          <p className="text-red-300 text-sm">Please try again or contact us directly at support@quicksidetool.com</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Submission Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        What can we help you with? *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {submissionTypes.map((type) => (
                          <label
                            key={type.value}
                            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${formData.type === type.value
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                              }`}
                          >
                            <input
                              type="radio"
                              name="type"
                              value={type.value}
                              checked={formData.type === type.value}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <div className="flex items-start gap-3">
                              <type.icon className={`w-5 h-5 mt-0.5 ${formData.type === type.value ? 'text-purple-400' : 'text-gray-400'
                                }`} />
                              <div>
                                <div className={`font-medium ${formData.type === type.value ? 'text-white' : 'text-gray-300'
                                  }`}>
                                  {type.label}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {type.description}
                                </div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Name and Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                          Name *
                        </label>
                        <input
                          type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message" name="message" value={formData.message} onChange={handleChange} required rows={6}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Please provide details about your inquiry, question, or feedback..."
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${isSubmitting
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                        }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>

                {/* Additional Info Column */}
                <div className="space-y-8">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      Quick Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center"><div className="text-2xl font-bold text-white">24h</div><div className="text-sm text-gray-400">Response Time</div></div>
                      <div className="text-center"><div className="text-2xl font-bold text-white">100%</div><div className="text-sm text-gray-400">Free Support</div></div>
                      <div className="text-center"><div className="text-2xl font-bold text-white">500K+</div><div className="text-sm text-gray-400">Happy Users</div></div>
                      <div className="text-center"><div className="text-2xl font-bold text-white">24/7</div><div className="text-sm text-gray-400">Available</div></div>
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      Join Our Community
                    </h3>
                    <div className="space-y-3">
                      <a href="https://discord.gg/5SufsJSj" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-all duration-200">
                        <MessageSquare className="w-5 h-5 text-purple-400" />
                        <div><div className="font-medium text-white">Discord Server</div><div className="text-sm text-gray-400">Get real-time support</div></div>
                      </a>
                      <a href="https://github.com/AmanYadav007/QuickSideTool" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg hover:bg-gray-500/20 transition-all duration-200">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div><div className="font-medium text-white">GitHub Repository</div><div className="text-sm text-gray-400">View source code</div></div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* FAQ Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="container mx-auto px-4 py-16"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Frequently Asked Questions
              </h2>
              <div className="grid gap-6">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <h3 className="text-lg font-bold mb-3 text-white">{faq.question}</h3>
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
