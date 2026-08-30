import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'PDF Tools', to: '/pdf-tool' },
  { label: 'Image Tools', to: '/image-tools' },
  { label: 'QR Code', to: '/qr-tool' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen
          ? 'border-b border-border bg-background/95 backdrop-blur-md'
          : 'border-b border-transparent bg-background/40 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-content items-center justify-between gap-3 px-4 md:px-6">
        <Link to="/" className="text-lg font-extrabold tracking-tight text-text md:text-xl">
          QuickSideTool
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-secondary transition-colors hover:text-text"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/toolkit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primaryHover hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-text md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-md px-2 py-3 text-base font-medium text-text transition-colors hover:bg-card"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/toolkit"
              className="mt-2 rounded-lg bg-primary px-4 py-3 text-center text-base font-semibold text-white transition hover:bg-primaryHover"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
