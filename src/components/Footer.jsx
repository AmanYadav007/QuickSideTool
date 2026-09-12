import React from 'react';
import { Link } from 'react-router-dom';

const COLUMNS = [
  {
    heading: 'PDF',
    links: [
      { label: 'Compress PDF', to: '/pdf-compressor' },
      { label: 'Combine PDFs', to: '/pdf-tool' },
      { label: 'Unlock PDF', to: '/unlock-pdf' },
      { label: 'PDF to Word', to: '/pdf-to-word' },
    ],
  },
  {
    heading: 'Image',
    links: [
      { label: 'Resize Image', to: '/image-tools/resize' },
      { label: 'Compress Image', to: '/image-tools/compress' },
      { label: 'Convert Image', to: '/image-tools/convert' },
    ],
  },
  {
    heading: 'More',
    links: [
      { label: 'QR Generator', to: '/qr-tool' },
      { label: 'OCR Scanner', to: '/ocr-processor' },
      { label: 'All tools', to: '/home' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Privacy', to: '/privacy-policy' },
      { label: 'Terms', to: '/terms-of-service' },
    ],
  },
];

const Footer = () => (
  <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-alt)]">
    <div className="mx-auto w-full max-w-7xl px-6 py-12">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-5 md:gap-8">
        <div className="col-span-2 md:col-span-1">
          <p className="text-[11px] font-extrabold tracking-widest uppercase text-blue-500">QuickSideTool</p>
          <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">Fast. Free. Secure.</p>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h3 className="text-sm font-semibold text-[var(--color-text)]">{column.heading}</h3>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <p className="mt-10 border-t border-[var(--color-border)] pt-6 text-sm text-[var(--color-text-light)] text-center">
        &copy; {new Date().getFullYear()} QuickSideTool. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;