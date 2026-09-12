import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Lock, Zap, FileText, Image, QrCode, ScanLine } from "lucide-react";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import ToolDirectory from "../components/ToolDirectory";
import UploadZone from "../components/UploadZone";

const features = [
  { icon: FileText, title: "PDF Tools", description: "Compress, merge, unlock, convert PDFs", href: "/pdf-tool" },
  { icon: Image, title: "Image Tools", description: "Resize, compress, convert images", href: "/image-tools" },
  { icon: QrCode, title: "QR Generator", description: "Create QR codes for links & text", href: "/qr-tool" },
  { icon: ScanLine, title: "OCR Scanner", description: "Extract text from scans & PDFs", href: "/ocr-processor" },
];

const trustBadges = [
  { label: "Free forever", icon: Check },
  { label: "No signup required", icon: Zap },
  { label: "Files stay private", icon: Lock },
];

const LandingPage = () => {
  return (
    <>
      <SEO
        title="QuickSideTool - Free PDF Tools, Image Tools, QR Generator"
        description="Compress PDFs, resize images, convert files and generate QR codes. Free, no signup, runs in your browser."
      />
      <Layout>
        {/* Hero Section */}
        <section className="bg-[var(--color-bg)] border-b border-[var(--color-border)]">
          <div className="container section text-center">
            <h1 className="h1">
              Every file tool you'll ever need.
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-[var(--color-text-muted)] leading-relaxed">
              Compress PDFs, resize images, convert files and generate QR codes — free, secure, runs in your browser.
            </p>

            <div className="mt-10 max-w-md mx-auto">
              <UploadZone />
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {trustBadges.map(({ label, icon: Icon }) => (
                <li key={label} className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <Icon className="h-4 w-4 text-blue-500" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="bg-[var(--color-bg-alt)]">
          <div className="container section">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <Link
                  key={feature.title}
                  to={feature.href}
                  className="card p-6 hover:border-[var(--color-primary)] transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-light)] mb-4">
                    <feature.icon className="w-5 h-5 text-[var(--color-primary)] mx-auto" aria-hidden="true" />
                  </div>
                  <h3 className="h3 mb-1">{feature.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{feature.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm text-[var(--color-primary)] font-medium">
                    <span>Open tool</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* All Tools */}
        <section className="bg-[var(--color-bg)]">
          <div className="container section">
            <div className="flex items-center justify-between mb-8">
              <h2 className="h2">All Tools</h2>
              <Link to="/home" className="btn-secondary text-sm">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ToolDirectory />
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-[var(--color-bg-alt)]">
          <div className="container section">
            <h2 className="h2 text-center mb-10">Frequently asked questions</h2>
            <div className="max-w-3xl mx-auto divide-y divide-[var(--color-border)]">
              {[
                { q: "Is QuickSideTool really free?", a: "Yes. Every tool on this site is free to use with no account, no watermark and no daily limit." },
                { q: "Do my files get uploaded to a server?", a: "The PDF and image tools run in your browser, so your files stay on your device. Nothing is stored after you close the tab." },
                { q: "What file sizes can I use?", a: "Anything your browser can hold in memory — in practice that means files up to a few hundred megabytes on a modern laptop." },
                { q: "Which formats are supported?", a: "PDF and DOCX for documents, plus PNG, JPG, WebP and GIF for images." },
              ].map((faq) => (
                <details key={faq.q} className="group py-5">
                  <summary className="cursor-pointer list-none text-base font-semibold text-[var(--color-text)] marker:hidden">
                    <span className="flex items-center justify-between gap-3">
                      {faq.q}
                      <ArrowRight className="h-4 w-4 shrink-0 text-[var(--color-text-light)] transition-transform duration-200 group-open:rotate-90" aria-hidden="true" />
                    </span>
                  </summary>
                  <p className="mt-3 pr-7 text-sm leading-relaxed text-[var(--color-text-muted)]">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[var(--color-bg)] border-t border-[var(--color-border)]">
          <div className="container section text-center">
            <h2 className="h2">Ready to combine your files?</h2>
            <p className="mt-2 text-[var(--color-text-muted)]">Start in one click — no signup needed.</p>
            <Link to="/pdf-tool" className="mt-6 inline-block btn-primary">
              Start Combining <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default LandingPage;