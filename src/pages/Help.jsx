import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Image,
  MessageSquare,
  QrCode,
} from "lucide-react";
import SEO from "../components/SEO";
import Layout from "../components/Layout";

const helpSections = [
  {
    title: "PDF tools",
    icon: FileText,
    items: [
      ["How do I merge PDFs?", "Open PDF Tools, add your files, arrange the order, then download the merged result."],
      ["Can I unlock any PDF?", "Only unlock PDFs you own or have permission to modify. If a password is required, you need to know it."],
      ["Why is a large PDF slower?", "Large files need more browser memory. Try smaller batches or compress the PDF first."],
    ],
  },
  {
    title: "Image tools",
    icon: Image,
    items: [
      ["When should I resize?", "Use resize when you need exact dimensions such as 1080x1080 or a website thumbnail."],
      ["When should I compress?", "Use compress when the image is too large for upload, email, or website performance."],
      ["When should I convert?", "Use convert when you need JPG, PNG, or WebP for a specific website, form, or workflow."],
    ],
  },
  {
    title: "QR codes",
    icon: QrCode,
    items: [
      ["What QR types are supported?", "URL, text, Wi-Fi, WhatsApp, email, phone, and contact cards."],
      ["Which format should I download?", "Use PNG for most cases, SVG for print or sharp scaling, and JPG only when required."],
    ],
  },
];

const Help = () => {
  const [openItem, setOpenItem] = useState("PDF tools-0");

  return (
    <>
      <SEO
        title="Help & Support - QuickSideTool"
        description="Simple help for QuickSideTool PDF tools, image tools, QR codes, and browser-based file workflows."
        keywords="QuickSideTool help, PDF tools help, image tools help, QR code help"
      />

      <Layout showAnimatedBackground={false}>
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-8 md:pt-14">
          <section className="rounded-lg border border-white/10 bg-[#0b1f2a]/85 p-6 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">
              Help
            </p>
            <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">
              Quick answers.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Pick a tool, upload your file, choose options, and download the
              result. These notes cover the most common questions.
            </p>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="rounded-lg border border-white/10 bg-white/[0.05] p-5">
              <h2 className="font-semibold text-white">Need help?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                If something feels unclear or broken, send a short message and
                include the tool name.
              </p>
              <Link
                to="/contact"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-300 px-4 py-2 font-semibold text-slate-950 transition hover:bg-amber-200"
              >
                <MessageSquare className="h-4 w-4" />
                Contact support
              </Link>
            </aside>

            <div className="space-y-6">
              {helpSections.map((section) => {
                const Icon = section.icon;
                return (
                  <article
                    key={section.title}
                    className="rounded-lg border border-white/10 bg-[#0b1f2a]/85 p-5"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                    </div>
                    <div className="space-y-3">
                      {section.items.map(([question, answer], index) => {
                        const id = `${section.title}-${index}`;
                        const open = openItem === id;
                        return (
                          <div key={question} className="rounded-lg border border-white/10 bg-white/[0.04]">
                            <button
                              onClick={() => setOpenItem(open ? "" : id)}
                              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                            >
                              <span className="font-semibold text-white">{question}</span>
                              {open ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                            </button>
                            {open && <p className="px-4 pb-4 text-sm leading-6 text-slate-300">{answer}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default Help;
