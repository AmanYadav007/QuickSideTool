import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="w-full sticky top-0 z-50 bg-gradient-to-r from-[#1a1440]/80 via-[#1e215d]/80 to-[#2a1a4a]/80 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
          QuickSideTool
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
          <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
          <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
          <Link to="/help" className="text-gray-300 hover:text-white transition-colors">Help</Link>
          <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>

          <Link 
            to="/toolkit" 
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
        {/* Mobile Hamburger */}
        <button className="md:hidden flex flex-col gap-1.5" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
          <span className="w-7 h-1 bg-white rounded-full" />
          <span className="w-7 h-1 bg-white rounded-full" />
          <span className="w-7 h-1 bg-white rounded-full" />
        </button>
      </div>
              {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#1a1440]/95 px-6 pb-4 pt-2 flex flex-col gap-4 text-lg">
            <Link to="/" className="text-white/90 hover:text-purple-300 font-medium transition" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/about" className="text-white/90 hover:text-purple-300 font-medium transition" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/blog" className="text-white/90 hover:text-purple-300 font-medium transition" onClick={() => setMenuOpen(false)}>Blog</Link>
            <Link to="/help" className="text-white/90 hover:text-purple-300 font-medium transition" onClick={() => setMenuOpen(false)}>Help</Link>
            <Link to="/contact" className="text-white/90 hover:text-purple-300 font-medium transition" onClick={() => setMenuOpen(false)}>Contact</Link>

            <Link 
              to="/toolkit" 
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        )}
    </nav>
  );
};

export default Navbar; 