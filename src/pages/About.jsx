import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Globe,
  Heart,
  Shield,
  Target,
  Zap,
} from "lucide-react";
import SEO from "../components/SEO";
import Layout from "../components/Layout";

const values = [
  {
    icon: Shield,
    title: "Privacy first",
    text: "Tools are designed to keep work simple and safe, with browser-based processing wherever possible.",
  },
  {
    icon: Zap,
    title: "Fast by default",
    text: "Each tool should open quickly, explain itself clearly, and get users to a download without extra steps.",
  },
  {
    icon: Heart,
    title: "Built for real use",
    text: "The goal is not a busy dashboard. The goal is a practical place to finish file tasks.",
  },
  {
    icon: Globe,
    title: "Accessible anywhere",
    text: "No complicated setup. Open the site, choose a tool, and keep moving.",
  },
];

const About = () => {
  return (
    <>
      <SEO
        title="About QuickSideTool"
        description="Learn about QuickSideTool, a simple browser-first toolkit for PDFs, images, QR codes, OCR, and file conversion."
        keywords="about QuickSideTool, online tools, PDF tools, image tools, QR code generator"
      />

      <Layout showAnimatedBackground={false}>
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-8 md:pt-14">
          <section className="rounded-lg border border-white/10 bg-[#0b1f2a]/85 p-6 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">
              About
            </p>
            <h1 className="mt-2 max-w-4xl text-4xl font-bold leading-tight text-white md:text-5xl">
              Simple tools for everyday file work.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              QuickSideTool is built for people who need to resize images,
              compress files, make QR codes, convert documents, and get back to
              work without learning a complicated app.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/toolkit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-200"
              >
                Open toolkit <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Contact us
              </Link>
            </div>
          </section>

          <section className="mt-8 grid gap-5 md:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article
                  key={value.title}
                  className="rounded-lg border border-white/10 bg-white/[0.05] p-5"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200 ring-1 ring-amber-200/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="font-semibold text-white">{value.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {value.text}
                  </p>
                </article>
              );
            })}
          </section>

          <section className="mt-8 grid gap-8 rounded-lg border border-white/10 bg-[#0b1f2a]/85 p-6 md:grid-cols-[280px_1fr] md:p-8">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">What we focus on</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Clear tool pages with one main task each.",
                "Useful browser-based workflows where possible.",
                "Simple labels and actions instead of heavy marketing copy.",
                "Practical tools people can use without an account.",
              ].map((item) => (
                <div key={item} className="flex gap-3 text-slate-300">
                  <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-amber-200" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default About;
