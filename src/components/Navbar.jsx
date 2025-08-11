import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on a page that should show the main navigation links
  const isMainPage = location.pathname === '/' || location.pathname === '/home';

  return (
    <nav className="fixed top-0 md:top-4 left-0 right-0 z-50">
      <div className="mx-auto w-full md:w-auto md:max-w-5xl lg:max-w-6xl xl:max-w-7xl px-3 py-2 md:px-4 md:py-2.5 rounded-none md:rounded-full border-b md:border border-white/10 shadow-lg backdrop-blur-md bg-gradient-to-r from-[#082129]/85 via-[#0b2f3b]/85 to-[#0e1f2a]/85 flex items-center justify-between gap-3">
        {/* Logo */}
        <div>
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Quick Side Tool logo" className="h-8 md:h-10 w-auto group-hover:scale-105 transition-transform" />
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {isMainPage && (
            <>
              <a href="#features" className="relative group text-white/80 hover:text-cyan-300 font-medium transition">
                Features
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-cyan-400 to-emerald-400 group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#testimonials" className="relative group text-white/80 hover:text-cyan-300 font-medium transition">
                Reviews
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-cyan-400 to-emerald-400 group-hover:w-full transition-all duration-300" />
              </a>
            </>
          )}
          <Link to="/contact" className="relative group text-white/80 hover:text-cyan-300 font-medium transition">
            Contact
            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-cyan-400 to-emerald-400 group-hover:w-full transition-all duration-300" />
          </Link>
          <button
            onClick={() => navigate('/toolkit')}
            className="ml-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-semibold py-2 px-5 rounded-full shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400/30"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="w-7 h-1 bg-white rounded-full transition-all" />
          <span className="w-7 h-1 bg-white rounded-full transition-all" />
          <span className="w-7 h-1 bg-white rounded-full transition-all" />
        </button>
      </div>

      {/* Mobile Menu - Fullscreen overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-16 left-3 right-3 rounded-2xl border border-white/10 bg-[#0b2530]/95 text-white p-5 shadow-2xl">
            <div className="flex flex-col gap-4 text-lg">
              {isMainPage && (
                <>
                  <a href="#features" className="hover:text-cyan-300 transition" onClick={() => setMenuOpen(false)}>Features</a>
                  <a href="#testimonials" className="hover:text-cyan-300 transition" onClick={() => setMenuOpen(false)}>Reviews</a>
                </>
              )}
              <Link to="/contact" className="hover:text-cyan-300 transition" onClick={() => setMenuOpen(false)}>Contact</Link>
              <a href="https://www.buymeacoffee.com/amanryadav" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition" onClick={() => setMenuOpen(false)}>Support</a>
            </div>
            <button
              onClick={() => { setMenuOpen(false); navigate('/toolkit'); }}
              className="mt-5 w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 