import React from "react";
import { AlertTriangle, CheckCircle, FileText, Shield, Share, Users, Clock } from "lucide-react";
import SEO from "../components/SEO";
import Layout from "../components/Layout";

const terms = [
  {
    icon: FileText,
    title: "Use of the service",
    text: "QuickSideTool provides browser-based and online utilities for file, image, QR, and document workflows. You may use the tools for personal, educational, or business purposes, but only for files and content that you own or have permission to process. You must not use the tools for unlawful, harmful, or unauthorized activity.",
  },
  {
    icon: Shield,
    title: "No warranty",
    text: "Tools are provided on an 'as-is' basis. We work to keep them useful and reliable, but we cannot guarantee every file, browser, or workflow will produce a perfect result. Results are generated automatically and should be verified before use or sharing.",
  },
  {
    icon: AlertTriangle,
    title: "User responsibility",
    text: "You are solely responsible for checking outputs before using or sharing them. You must not redistribute, sell, or commercially exploit content generated using QuickSideTool without proper rights. You are responsible for compliance with applicable laws in your jurisdiction.",
  },
  {
    icon: Share,
    title: "Intellectual property",
    text: "You retain ownership of your input files and output content. By using QuickSideTool, you grant us permission to process your data solely for providing the requested service. We do not claim any ownership over your content.",
  },
  {
    icon: Users,
    title: "Age requirement",
    text: "The tools are intended for users who are at least 13 years of age. If you are under 18, you must have parental or guardian permission to use the service.",
  },
  {
    icon: Clock,
    title: "Changes to terms",
    text: "We may update these terms over time. Continued use of QuickSideTool after changes are posted constitutes acceptance of the updated terms. You should review this page periodically for the latest version.",
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
      <Layout>
        <div className="container section max-w-4xl">
          <section className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Terms of Service</p>
            <h1 className="h1 mt-2">Clear terms for simple tools.</h1>
            <p className="mt-4 max-w-2xl mx-auto text-gray-500 leading-relaxed">
              By using QuickSideTool, you agree to use the tools responsibly.
              Last updated: {new Date().toLocaleDateString()}.
            </p>
          </section>

          <section className="space-y-6">
            {terms.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="card p-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h2>
                      <p className="text-gray-500 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="mt-10 card p-6 border-green-200 bg-green-50">
            <div className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold text-gray-900">Contact</h2>
                <p className="mt-1 text-sm text-gray-600">For terms questions, contact support@quicksidetool.com.</p>
              </div>
            </div>
          </section>

          <section className="mt-6 card p-6 border-amber-200 bg-amber-50">
            <div className="flex gap-3">
              <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold text-gray-900">Effective date</h2>
                <p className="mt-1 text-sm text-gray-600">
                  These terms of service were last updated on {new Date().toLocaleDateString()}. We may modify the terms at any time. Changes will be effective when posted on this page.
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