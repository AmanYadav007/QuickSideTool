import React from "react";
import { Link } from "react-router-dom";
import {
  Minimize2,
  FileText,
  Files,
  Unlock,
  Link2Off,
  ScanLine,
  FileType,
  Image as ImageIcon,
  Repeat,
  Maximize2,
  QrCode,
  FileSpreadsheet,
} from "lucide-react";

// Every `to` below maps to a real route registered in src/App.jsx.
export const categories = [
  {
    id: "pdf-tools",
    name: "PDF Tools",
    tagline: "Most popular",
    tools: [
      { title: "Compress PDF", description: "Reduce file size instantly.", to: "/pdf-compressor", icon: Minimize2 },
      { title: "Organise & Merge", description: "Reorder, delete and combine pages.", to: "/pdf-tool", icon: Files },
      { title: "Unlock PDF", description: "Remove password protection.", to: "/unlock-pdf", icon: Unlock },
      { title: "PDF to Word", description: "Keep formatting intact.", to: "/pdf-to-word", icon: FileText },
      { title: "Word to PDF", description: "Turn .docx into a clean PDF.", to: "/word-to-pdf", icon: FileType },
      { title: "Remove Links", description: "Strip hyperlinks from a PDF.", to: "/pdf-link-remove", icon: Link2Off },
      { title: "PDF to Excel", description: "Extract tables into a spreadsheet.", to: "/file-converter", icon: FileSpreadsheet },
    ],
  },
  {
    id: "image-tools",
    name: "Image Tools",
    tagline: "Resize, compress, convert",
    tools: [
      { title: "Resize Image", description: "Change dimensions exactly.", to: "/image-tools/resize", icon: Maximize2 },
      { title: "Compress Image", description: "Smaller files, same look.", to: "/image-tools/compress", icon: Minimize2 },
      { title: "Convert Image", description: "PNG, JPG, WebP and more.", to: "/image-tools/convert", icon: Repeat },
      { title: "Image Toolkit", description: "All image tools in one place.", to: "/image-tools", icon: ImageIcon },
    ],
  },
  {
    id: "other-tools",
    name: "QR & Text",
    tagline: "Generate and extract",
    tools: [
      { title: "QR Code Generator", description: "Create QR codes instantly.", to: "/qr-tool", icon: QrCode },
      { title: "OCR Scanner", description: "Pull text out of scans.", to: "/ocr-processor", icon: ScanLine },
    ],
  },
];

const ToolCard = ({ title, description, to, icon: Icon }) => (
  <Link
    to={to}
    className="group flex min-h-card flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:border-primaryHover hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary/40 md:p-5"
  >
    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
      <Icon className="h-6 w-6 text-primaryHover" aria-hidden="true" />
    </span>
    <h3 className="mt-0.5 text-base font-bold leading-snug text-text md:text-lg">{title}</h3>
    <p className="text-sm leading-snug text-secondary">{description}</p>
  </Link>
);

export const ToolCategory = ({ name, tagline, id, tools }) => (
  <section id={id} className="scroll-mt-24 rounded-lg border border-border bg-card/40 p-4 md:p-6">
    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
      <h2 className="text-xl font-bold text-text md:text-2xl">{name}</h2>
      <p className="text-sm text-secondary">{tagline}</p>
    </div>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {tools.map((tool) => (
        <ToolCard key={tool.to} {...tool} />
      ))}
    </div>
  </section>
);

const ToolDirectory = ({ only }) => {
  const shown = only ? categories.filter((c) => only.includes(c.id)) : categories;

  return (
    <div className="flex flex-col gap-6">
      {shown.map((category) => (
        <ToolCategory key={category.id} {...category} />
      ))}
    </div>
  );
};

export default ToolDirectory;
