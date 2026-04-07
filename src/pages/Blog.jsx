import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Image, QrCode } from "lucide-react";
import SEO from "../components/SEO";
import Layout from "../components/Layout";

const articles = [
  {
    title: "Prepare images for websites",
    category: "Image workflow",
    description: "Resize first, convert to WebP when possible, then compress for a smaller final file.",
    to: "/image-tools",
    icon: Image,
  },
  {
    title: "Choose the right QR code type",
    category: "QR workflow",
    description: "Use URL for links, Wi-Fi for networks, WhatsApp for chats, and Contact for vCards.",
    to: "/qr-tool",
    icon: QrCode,
  },
  {
    title: "Keep document workflows simple",
    category: "File workflow",
    description: "Pick one task at a time: convert, compress, unlock, or extract text before moving to the next step.",
    to: "/toolkit",
    icon: FileText,
  },
];

const Blog = () => {
  return (
    <>
      <SEO
        title="QuickSideTool Guides"
        description="Simple guides for image tools, QR codes, PDF workflows, and file conversion."
        keywords="QuickSideTool blog, image tools guide, QR code guide, PDF workflow"
      />

      <Layout showAnimatedBackground={false}>
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-8 md:pt-14">
          <section className="rounded-lg border border-white/10 bg-[#0b1f2a]/85 p-6 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">
              Guides
            </p>
            <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">
              Simple file workflow notes.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Short, practical guides for using the tools without turning a
              quick task into a research project.
            </p>
          </section>

          <section className="mt-8 grid gap-5 md:grid-cols-3">
            {articles.map((article) => {
              const Icon = article.icon;
              return (
                <Link
                  key={article.title}
                  to={article.to}
                  className="group rounded-lg border border-white/10 bg-white/[0.05] p-6 transition hover:-translate-y-0.5 hover:border-amber-200/60 hover:bg-white/[0.08]"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                    {article.category}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white">{article.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{article.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-semibold text-amber-200">
                    Open tool <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </section>
        </div>
      </Layout>
    </>
  );
};

export default Blog;
