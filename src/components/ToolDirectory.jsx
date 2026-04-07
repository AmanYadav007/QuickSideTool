import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  FileType,
  Gamepad2,
  Image,
  Link as LinkIcon,
  Lock,
  Minimize2,
  QrCode,
  RefreshCw,
  ScanLine,
  Shrink,
} from "lucide-react";

const toolCategories = [
  {
    name: "PDF tools",
    description: "Edit, unlock, compress, and convert PDF files.",
    tools: [
      {
        title: "PDF Tools",
        description: "Merge, split, reorder, and manage PDF pages.",
        to: "/pdf-tool",
        icon: FileText,
      },
      {
        title: "Unlock PDF",
        description: "Remove passwords from PDFs you own.",
        to: "/unlock-pdf",
        icon: Lock,
      },
      {
        title: "Compress PDF",
        description: "Reduce PDF size before sharing or uploading.",
        to: "/pdf-compressor",
        icon: Shrink,
      },
      {
        title: "Remove PDF Links",
        description: "Clean hyperlinks from PDF documents.",
        to: "/pdf-link-remove",
        icon: LinkIcon,
      },
      {
        title: "PDF to Word",
        description: "Convert PDF files into editable Word documents.",
        to: "/pdf-to-word",
        icon: FileType,
      },
      {
        title: "Word to PDF",
        description: "Turn Word documents into PDF files.",
        to: "/word-to-pdf",
        icon: FileText,
      },
      {
        title: "OCR Processor",
        description: "Extract text from scanned PDFs and images.",
        to: "/ocr-processor",
        icon: ScanLine,
      },
      {
        title: "File Converter",
        description: "Convert PDFs to Word or Excel.",
        to: "/file-converter",
        icon: FileType,
      },
    ],
  },
  {
    name: "Image tools",
    description: "Resize and compress images for everyday use.",
    tools: [
      {
        title: "Image Tools",
        description: "Open the image tool page.",
        to: "/image-tools",
        icon: Image,
      },
      {
        title: "Image Resize",
        description: "Change image dimensions quickly.",
        to: "/image-tools/resize",
        icon: Image,
      },
      {
        title: "Image Compressor",
        description: "Make image files smaller.",
        to: "/image-tools/compress",
        icon: Minimize2,
      },
      {
        title: "Image Converter",
        description: "Convert JPG, PNG, and WebP files.",
        to: "/image-tools/convert",
        icon: RefreshCw,
      },
    ],
  },
  {
    name: "Quick utilities",
    description: "Small tools for simple daily tasks.",
    tools: [
      {
        title: "QR Code Generator",
        description: "Create QR codes for URL, Wi-Fi, WhatsApp, contact, and more.",
        to: "/qr-tool",
        icon: QrCode,
      },
      {
        title: "Diamond Quest",
        description: "Take a quick browser game break.",
        to: "/diamond-mines",
        icon: Gamepad2,
      },
    ],
  },
];

const allTools = toolCategories.flatMap((category) => category.tools);

const ToolDirectory = ({ showIntro = true }) => {
  return (
    <section className="w-full">
      {showIntro && (
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">
            Tool list
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            All the tools you need
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            Pick one tool, open its page, upload your file, choose the options,
            and download the result.
          </p>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard label="Tools ready" value={allTools.length} />
        <SummaryCard label="Main groups" value={toolCategories.length} />
        <SummaryCard label="Sign up needed" value="No" />
      </div>

      <div className="space-y-8">
        {toolCategories.map((category) => (
          <div key={category.name}>
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {category.name}
                </h3>
                <p className="text-sm text-slate-400">
                  {category.description}
                </p>
              </div>
              <span className="text-sm text-slate-400">
                {category.tools.length} tools
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {category.tools.map((tool) => (
                <ToolCard key={tool.to} tool={tool} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const SummaryCard = ({ label, value }) => (
  <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="mt-1 text-sm text-slate-400">{label}</div>
  </div>
);

const ToolCard = ({ tool }) => {
  const Icon = tool.icon;

  return (
    <Link
      to={tool.to}
      className="group flex h-full items-start gap-4 rounded-lg border border-white/10 bg-[#0d2530]/80 p-5 text-left transition hover:-translate-y-0.5 hover:border-amber-200/60 hover:bg-[#102f3c] focus:outline-none focus:ring-2 focus:ring-amber-200"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200 ring-1 ring-amber-200/20">
        <Icon className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-3">
          <span className="font-semibold text-white">{tool.title}</span>
          <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-amber-200" />
        </span>
        <span className="mt-2 block text-sm leading-6 text-slate-300">
          {tool.description}
        </span>
      </span>
    </Link>
  );
};

export { toolCategories };
export default ToolDirectory;
