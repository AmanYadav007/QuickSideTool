import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'All Tools', to: '/home' },
  { label: 'PDF', to: '/pdf-tool' },
  { label: 'Image', to: '/image-tools' },
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

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link to="/" className="text-[11px] font-extrabold tracking-widest uppercase text-blue-500">
          QuickSideTool
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/home"
            className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Open App
          </Link>
        </div>

        <button
          type="button"
          className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-alt)] md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] md:hidden">
          <div className="flex flex-col px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-2 py-3 text-base font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-alt)] rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/home"
              className="mt-2 rounded-full bg-[var(--color-primary)] px-4 py-3 text-center text-base font-semibold text-white hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Open App
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;