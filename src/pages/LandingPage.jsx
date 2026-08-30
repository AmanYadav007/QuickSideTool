import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Lock, Zap } from "lucide-react";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import ToolDirectory, { ToolCategory, categories } from "../components/ToolDirectory";
import UploadZone from "../components/UploadZone";
import AdSlot from "../components/AdSlot";

const BADGES = [
  { label: "Free", icon: Check },
  { label: "No signup", icon: Zap },
  { label: "Secure", icon: Lock },
];

const FAQS = [
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
    a: "Anything your browser can hold in memory — in practice that means files up to a few hundred megabytes on a modern laptop.",
  },
  {
    q: "Which formats are supported?",
    a: "PDF and DOCX for documents, plus PNG, JPG, WebP and GIF for images.",
  },
];

const LandingPage = () => {
  const [pdfCategory, ...restCategories] = categories;

  return (
    <>
      <SEO
        title="QuickSideTool - Free PDF Tools, Image Tools, QR Generator"
        description="Compress PDFs, resize images, convert files and generate QR codes. Free, no signup, runs in your browser."
      />
      <Layout>
        {/* ---------- Hero ---------- */}
        <section className="border-b border-border/60">
          <div className="mx-auto flex min-h-hero-mobile w-full max-w-content flex-col items-center justify-center px-4 py-10 text-center md:min-h-hero md:px-6 md:py-14">
            <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-text sm:text-4xl md:text-5xl lg:text-[52px] lg:leading-[56px]">
              Every file tool you'll ever need.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-secondary md:text-lg">
              Compress PDFs, resize images, convert files and generate QR codes —
              free and secure.
            </p>

            <div className="mt-7 w-full">
              <UploadZone />
            </div>

            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {BADGES.map(({ label, icon: Icon }) => (
                <li key={label} className="flex items-center gap-1.5 text-sm text-secondary">
                  <Icon className="h-4 w-4 text-primaryHover" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Ad: after hero ---------- */}
        <div className="mx-auto w-full max-w-content px-4 pt-6 md:px-6">
          <AdSlot size="leaderboard" />
        </div>

        {/* ---------- Tools ---------- */}
        <main
          id="tools"
          className="mx-auto w-full max-w-content scroll-mt-20 px-4 py-6 md:px-6"
        >
          <ToolCategory {...pdfCategory} />

          {/* ---------- Ad: after first tool section ---------- */}
          <div className="py-6">
            <AdSlot size="leaderboard" />
          </div>

          <ToolDirectory only={restCategories.map((c) => c.id)} />

          {/* ---------- FAQ ---------- */}
          <section className="mt-6 rounded-lg border border-border bg-card/40 p-4 md:p-6">
            <h2 className="text-xl font-bold text-text md:text-2xl">
              Frequently asked questions
            </h2>
            <div className="mt-4 divide-y divide-border">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group py-3">
                  <summary className="cursor-pointer list-none text-base font-semibold text-text marker:hidden">
                    <span className="flex items-center justify-between gap-3">
                      {faq.q}
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-secondary transition-transform duration-200 group-open:rotate-90"
                        aria-hidden="true"
                      />
                    </span>
                  </summary>
                  <p className="mt-2 pr-7 text-sm leading-relaxed text-secondary">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* ---------- Ad: before footer ---------- */}
          <div className="pt-6">
            <AdSlot size="leaderboard" />
          </div>
        </main>

        {/* ---------- Sticky mobile CTA ---------- */}
        <div className="sticky bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md md:hidden">
          <Link
            to="/toolkit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-base font-semibold text-white transition hover:bg-primaryHover"
          >
            Choose a tool <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Layout>
    </>
  );
};

export default LandingPage;
