import React from "react";
import { Link } from "react-router-dom";
import { Check, ChevronDown, Lock, Zap } from "lucide-react";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import ToolDirectory from "../components/ToolDirectory";
import ToolShowcase from "../components/ToolShowcase";

const trustBadges = [
  { label: "Free forever", icon: Check },
  { label: "No signup required", icon: Zap },
  { label: "Files stay private", icon: Lock },
];

const faqs = [
  {
    q: "Is QuickSideTool really free?",
    a: "Yes. Every tool on this site is free to use with no account, no watermark and no daily limit.",
  },
  {
    q: "Do my files get uploaded to a server?",
    a: "The PDF and image tools run in your browser, so your files stay on your device. Nothing is stored after you close the tab.",
  },
  {
    q: "What file sizes can I use?",
    a: "Anything your browser can hold in memory - in practice that means files up to a few hundred megabytes on a modern laptop.",
  },
  {
    q: "Which formats are supported?",
    a: "PDF and DOCX for documents, plus PNG, JPG, WebP and GIF for images.",
  },
];

const LandingPage = () => {
  return (
    <>
      <SEO
        title="QuickSideTool - Free PDF Tools, Image Tools, QR Generator"
        description="Compress PDFs, resize images, convert files and generate QR codes. Free, no signup, runs in your browser."
      />
      <Layout>
        {/* Hero - headline, then a running demo of what the tools do */}
        <section className="bg-[var(--color-bg)] border-b border-[var(--color-border)]">
          <div className="container py-20 md:py-24 text-center">
            <h1 className="h1">Every file tool you'll ever need.</h1>
            <p className="mt-4 max-w-xl mx-auto text-lg text-[var(--color-text-muted)] leading-relaxed">
              Compress, merge, convert and scan - free, and it all runs in your
              browser.
            </p>

            <div className="mt-10">
              <ToolShowcase />
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {trustBadges.map(({ label, icon: Icon }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]"
                >
                  <Icon className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Every tool, once */}
        <section id="tools" className="bg-[var(--color-bg-alt)]">
          <div className="container py-20 md:py-24">
            <h2 className="h2 text-center">All tools</h2>
            <p className="mt-3 mb-10 text-center text-[var(--color-text-muted)]">
              Thirteen tools, no signup, nothing to install.
            </p>
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
                  className="group card px-6 py-1 open:border-[var(--color-primary)]/40 hover:border-[var(--color-border-strong)] transition-all duration-200"
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
