import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Shield, Zap } from "lucide-react";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import ToolDirectory from "../components/ToolDirectory";

const LandingPage = () => {
  return (
    <>
      <SEO
        title="QuickSideTool - Free PDF Tools, Image Tools, QR Generator"
        description="Simple online tools for PDFs, images, QR codes, OCR, and file conversion. Pick a tool, choose the options, and download the result."
        keywords="PDF tools, image tools, QR code generator, PDF compressor, PDF unlocker, PDF to Word, Word to PDF, OCR processor, file converter"
      />
      <Layout showAnimatedBackground={false}>
        <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 md:px-8 md:pt-14">
          <section className="rounded-lg border border-white/10 bg-[#081f29]/80 p-6 shadow-2xl md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm font-medium text-cyan-100">
                  Free browser tools
                </div>
                <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl">
                  We have all the tools you need.
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                  Click a tool, open the tool page, choose the options, and get
                  your file ready. Simple screens, clear actions, no confusing
                  dashboard.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#tools"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
                  >
                    See all tools <ArrowRight className="h-5 w-5" />
                  </a>
                  <Link
                    to="/pdf-tool"
                    className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                  >
                    Open PDF Tools
                  </Link>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  How it works
                </p>
                <div className="mt-5 space-y-4">
                  <Step icon={CheckCircle} title="Choose a tool" text="PDF, image, QR, OCR, or converter." />
                  <Step icon={Zap} title="Use the options" text="Each tool page keeps its existing controls." />
                  <Step icon={Shield} title="Download result" text="Finish the task without extra navigation." />
                </div>
              </div>
            </div>
          </section>

          <div id="tools" className="mt-12 scroll-mt-28">
            <ToolDirectory />
          </div>
        </div>
      </Layout>
    </>
  );
};

const Step = ({ icon: Icon, title, text }) => (
  <div className="flex gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-200">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <div className="font-semibold text-white">{title}</div>
      <div className="mt-1 text-sm leading-6 text-slate-300">{text}</div>
    </div>
  </div>
);

export default LandingPage;
