import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Puzzle } from 'lucide-react';
import Logo from './Logo';
import { CHROME_EXTENSION_URL } from '../constants/links';

const NAV_LINKS = [
  { label: 'All Tools', to: '/home' },
  { label: 'PDF', to: '/pdf-tool' },
  { label: 'Image', to: '/image-tools' },
  { label: 'QR Code', to: '/qr-tool' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link to="/" aria-label="QuickSideTool home">
          <Logo size={28} />
        </Link>

        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {/* Shown from lg up so it never crowds the md breakpoint */}
          <a
            href={CHROME_EXTENSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)] lg:inline-flex"
          >
            <Puzzle className="h-4 w-4" aria-hidden="true" />
            Extension
          </a>
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
            <a
              href={CHROME_EXTENSION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-2 py-3 text-base font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-primary)]"
            >
              <Puzzle className="h-4 w-4" aria-hidden="true" />
              Chrome extension
            </a>
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