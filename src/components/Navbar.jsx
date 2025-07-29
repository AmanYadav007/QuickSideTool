import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on a page that should show the main navigation links
  const isMainPage = location.pathname === '/' || location.pathname === '/home';

  return (
    <nav className="w-full sticky top-0 z-50 bg-gradient-to-r from-[#1a1440]/80 via-[#1e215d]/80 to-[#2a1a4a]/80 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
          Quick Side Tool
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {isMainPage && (
            <>
              <a href="#features" className="text-white/90 hover:text-purple-300 font-medium transition">Features</a>
              <a href="#testimonials" className="text-white/90 hover:text-purple-300 font-medium transition">Reviews</a>
            </>
          )}
          <Link to="/contact" className="text-white/90 hover:text-purple-300 font-medium transition">Contact</Link>
          <button
            onClick={() => navigate('/toolkit')}
            className="ml-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all duration-300"
          >
            Get Started
          </button>
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
            {isMainPage && (
              <>
                <a href="#features" className="text-white/90 hover:text-purple-300 font-medium transition" onClick={() => setMenuOpen(false)}>Features</a>
                <a href="#testimonials" className="text-white/90 hover:text-purple-300 font-medium transition" onClick={() => setMenuOpen(false)}>Reviews</a>
              </>
            )}
            <Link to="/contact" className="text-white/90 hover:text-purple-300 font-medium transition" onClick={() => setMenuOpen(false)}>Contact</Link>
            <button
              onClick={() => { setMenuOpen(false); navigate('/toolkit'); }}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        )}
    </nav>
  );
};

export default Navbar; 