import React from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

const COLUMNS = [
  {
    heading: 'PDF',
    links: [
      { label: 'Compress PDF', to: '/pdf-compressor' },
      { label: 'Organise & Merge', to: '/pdf-tool' },
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
      { label: 'All tools', to: '/toolkit' },
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
  <footer className="border-t border-border bg-card/30">
    <div className="mx-auto w-full max-w-content px-4 py-10 md:px-6">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-5 md:gap-8">
        <div className="col-span-2 md:col-span-1">
          <p className="text-lg font-extrabold tracking-tight text-text">QuickSideTool</p>
          <p className="mt-1.5 text-sm text-secondary">Fast. Free. Secure.</p>
          <a
            href="https://github.com/AmanYadav007/QuickSideTool"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="QuickSideTool on GitHub"
            className="mt-4 inline-flex text-secondary transition-colors hover:text-text"
          >
            <Github className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h3 className="text-sm font-semibold text-text">{column.heading}</h3>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-secondary transition-colors hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <p className="mt-8 border-t border-border pt-5 text-sm text-secondary">
        &copy; {new Date().getFullYear()} QuickSideTool. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
