import React from "react";
import { AlertTriangle, CheckCircle, FileText, Scale, Shield } from "lucide-react";
import SEO from "../components/SEO";
import Layout from "../components/Layout";

const terms = [
  {
    icon: FileText,
    title: "Use of the service",
    text: "QuickSideTool provides browser-based and online utilities for file, image, QR, and document workflows. Use the tools only for files and content you own or have permission to process.",
  },
  {
    icon: Shield,
    title: "Your responsibility",
    text: "You are responsible for checking outputs before using or sharing them. Do not use QuickSideTool for unlawful, harmful, or unauthorized activity.",
  },
  {
    icon: AlertTriangle,
    title: "No warranty",
    text: "Tools are provided as-is. We work to keep them useful and reliable, but we cannot guarantee every file, browser, or workflow will produce a perfect result.",
  },
  {
    icon: Scale,
    title: "Changes",
    text: "We may update the site, tools, or these terms over time. Continued use of QuickSideTool means you accept the current terms.",
  },
];

const TermsOfService = () => {
  return (
    <>
      <SEO
        title="Terms of Service - QuickSideTool"
        description="Read QuickSideTool's terms for using the website, tools, and file workflows."
        keywords="terms of service, QuickSideTool terms, user agreement"
        canonical="/terms"
      />

      <Layout showAnimatedBackground={false}>
        <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 md:px-8 md:pt-14">
          <section className="rounded-lg border border-white/10 bg-[#0b1f2a]/85 p-6 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">
              Terms of Service
            </p>
            <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">
              Clear terms for simple tools.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              By using QuickSideTool, you agree to use the tools responsibly.
              Last updated: {new Date().toLocaleDateString()}.
            </p>
          </section>

          <section className="mt-8 space-y-4">
            {terms.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-lg border border-white/10 bg-white/[0.05] p-6"
                >
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                      <p className="mt-2 leading-7 text-slate-300">{item.text}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="mt-8 rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-6">
            <div className="flex gap-3">
              <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-200" />
              <div>
                <h2 className="font-semibold text-white">Contact</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  For terms questions, contact support@quicksidetool.com.
                </p>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default TermsOfService;
