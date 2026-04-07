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
      <div className="mx-auto w-full md:w-auto md:max-w-5xl lg:max-w-6xl xl:max-w-7xl px-3 py-2 md:px-4 md:py-2.5 rounded-none md:rounded-lg border-b md:border border-white/10 shadow-lg backdrop-blur-md bg-[#091923]/90 flex items-center justify-between gap-3">
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
              <a href="#tools" className="relative group text-white/80 hover:text-amber-200 font-medium transition">
                Tools
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-amber-200 group-hover:w-full transition-all duration-300" />
              </a>
            </>
          )}
          <Link to="/contact" className="relative group text-white/80 hover:text-amber-200 font-medium transition">
            Contact
            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-amber-200 group-hover:w-full transition-all duration-300" />
          </Link>
          <button
            onClick={() => navigate('/toolkit')}
            className="ml-2 bg-amber-300 hover:bg-amber-200 text-slate-950 font-semibold py-2 px-5 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-200/30"
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
          <div className="absolute top-16 left-3 right-3 rounded-lg border border-white/10 bg-[#091923]/95 text-white p-5 shadow-2xl">
            <div className="flex flex-col gap-4 text-lg">
              {isMainPage && (
                <>
                  <a href="#tools" className="hover:text-amber-200 transition" onClick={() => setMenuOpen(false)}>Tools</a>
                </>
              )}
              <Link to="/contact" className="hover:text-amber-200 transition" onClick={() => setMenuOpen(false)}>Contact</Link>
              <a href="https://www.buymeacoffee.com/amanryadav" target="_blank" rel="noopener noreferrer" className="hover:text-amber-200 transition" onClick={() => setMenuOpen(false)}>Support</a>
            </div>
            <button
              onClick={() => { setMenuOpen(false); navigate('/toolkit'); }}
              className="mt-5 w-full bg-amber-300 hover:bg-amber-200 text-slate-950 font-semibold py-3 rounded-lg shadow-md transition-all duration-300"
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
