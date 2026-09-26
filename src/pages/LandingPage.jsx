import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import ToolDirectory from "../components/ToolDirectory";
import { prefetchPopular } from "../pageLoaders";

const faqs = [
  {
    q: "Is QuickSideTool really free?",
    a: "Yes. Every tool on this site is free to use with no account, no watermark and no daily limit.",
  },
  {
    q: "Do my files get uploaded to a server?",
    a: "Image tools, merging, QR codes and OCR run entirely in your browser. Compressing, unlocking, converting and removing links from PDFs happen on our server: files are processed in memory and never stored.",
  },
  {
    q: "What file sizes can I use?",
    a: "Up to 100 MB for the tools that use our server (compress, unlock, convert, remove links). Browser-only tools handle anything your device has memory for.",
  },
  {
    q: "Which formats are supported?",
    a: "PDF, Word (.docx) and Excel (.xlsx) for documents, plus PNG, JPG, WebP and GIF for images.",
  },
];

const LandingPage = () => {
  useEffect(prefetchPopular, []);

  return (
    <>
      <SEO
        title="QuickSideTool - Free PDF Tools, Image Tools, QR Generator"
        description="Compress PDFs, resize images, convert files and generate QR codes. Free, no signup, runs in your browser."
        url="/"
      />
      <Layout>
        {/* Every tool, once */}
        <section id="tools" className="bg-[var(--color-bg-alt)]">
          <div className="container py-20 md:py-24">
            <h1 className="h2 text-center mb-10">Free PDF &amp; image tools</h1>
            <ToolDirectory />
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-[var(--color-bg)]">
          <div className="container py-20 md:py-24">
            <h2 className="h2 text-center mb-10">Frequently asked questions</h2>
            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group card px-6 py-1 open:border-brand-caribbean-green/40 hover:border-[var(--color-border-strong)] transition-all duration-200"
                >
                  <summary className="cursor-pointer list-none py-4 text-base font-semibold text-[var(--color-text)] marker:hidden">
                    <span className="flex items-center justify-between gap-3">
                      {faq.q}
                      <ChevronDown
                        className="h-4 w-4 shrink-0 text-[var(--color-text-light)] transition-transform duration-200 group-open:rotate-180 group-open:text-[var(--color-primary)]"
                        aria-hidden="true"
                      />
                    </span>
                  </summary>
                  <p className="pb-4 pr-7 text-sm leading-relaxed text-[var(--color-text-muted)] animate-fade-in">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
            <p className="mt-10 text-center text-sm text-[var(--color-text-muted)]">
              Still stuck?{" "}
              <Link to="/contact" className="link font-semibold">
                Get in touch
              </Link>
              .
            </p>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default LandingPage;
