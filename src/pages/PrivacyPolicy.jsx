import React from "react";
import { CheckCircle, Cookie, Lock, Mail, Shield } from "lucide-react";
import SEO from "../components/SEO";
import Layout from "../components/Layout";

const sections = [
  {
    icon: Shield,
    title: "Privacy-first tools",
    text: "QuickSideTool is designed to keep file work simple and private. Many tools process files in your browser, which means your files do not need to leave your device for those workflows.",
  },
  {
    icon: Lock,
    title: "File handling",
    text: "We do not use your files to create accounts, profiles, or personal records. Some tools may use backend processing where required, and those files are handled only for the requested task.",
  },
  {
    icon: Cookie,
    title: "Cookies and analytics",
    text: "We may use essential cookies for website functionality and optional analytics or advertising cookies where applicable. You can manage cookie preferences through your browser or consent controls when available.",
  },
  {
    icon: Mail,
    title: "Contact information",
    text: "If you contact us, we use the information you provide only to respond to your message, support request, feature idea, or bug report.",
  },
];

const PrivacyPolicy = () => {
  return (
    <>
      <SEO
        title="Privacy Policy - QuickSideTool"
        description="Learn how QuickSideTool handles privacy, file processing, cookies, and contact information."
        keywords="privacy policy, QuickSideTool privacy, file privacy, cookies"
        canonical="/privacy"
      />

      <Layout showAnimatedBackground={false}>
        <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 md:px-8 md:pt-14">
          <section className="rounded-lg border border-white/10 bg-[#0b1f2a]/85 p-6 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">
              Privacy Policy
            </p>
            <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">
              Your files should stay yours.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              This page explains how QuickSideTool approaches privacy and data
              handling. Last updated: {new Date().toLocaleDateString()}.
            </p>
          </section>

          <section className="mt-8 space-y-4">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <article
                  key={section.title}
                  className="rounded-lg border border-white/10 bg-white/[0.05] p-6"
                >
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                      <p className="mt-2 leading-7 text-slate-300">{section.text}</p>
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
                <h2 className="font-semibold text-white">Questions</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  For privacy questions, contact support@quicksidetool.com.
                </p>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default PrivacyPolicy;
