import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-[#1a1440]/90 via-[#1e215d]/90 to-[#2a1a4a]/90 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent tracking-wide mb-4">
              QuickSideTool
            </div>
            <p className="text-white/70 mb-4 max-w-md">
              Your essential digital toolkit for professional file processing. Free, secure, and powerful tools for PDFs, images, and more.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/AmanYadav007/QuickSideTool" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-purple-300 transition">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
              </a>
              <a href="https://aguider.in/" target="_blank" rel="noopener noreferrer" aria-label="Website" className="hover:text-purple-300 transition">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18c-4.411 0-8-3.589-8-8 0-4.411 3.589-8 8-8s8 3.589 8 8c0 4.411-3.589 8-8 8zm0-14c-3.309 0-6 2.691-6 6 0 3.309 2.691 6 6 6s6-2.691 6-6c0-3.309-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/></svg>
              </a>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-white/70">
              <li><Link to="/pdf-tool" className="hover:text-purple-300 transition-colors">PDF Tools</Link></li>
              <li><Link to="/image-tools" className="hover:text-purple-300 transition-colors">Image Tools</Link></li>
              <li><Link to="/qr-tool" className="hover:text-purple-300 transition-colors">QR Generator</Link></li>
              <li><Link to="/unlock-pdf" className="hover:text-purple-300 transition-colors">PDF Security</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-white/70">
              <li><Link to="/about" className="hover:text-purple-300 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-purple-300 transition-colors">Contact</Link></li>
              <li><Link to="/help" className="hover:text-purple-300 transition-colors">Help & Support</Link></li>
              <li><a href="https://discord.gg/5SufsJSj" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">Community</a></li>
            </ul>
          </div>
        </div>
        
        {/* Legal Links */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-white/60">
              &copy; {new Date().getFullYear()} QuickSideTool. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-white/60">
              <Link to="/privacy-policy" className="hover:text-purple-300 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="hover:text-purple-300 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 