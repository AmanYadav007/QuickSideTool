import React from "react";
import { CheckCircle, Cookie, Lock, Mail, Shield, Folder, Clock } from "lucide-react";
import SEO from "../components/SEO";
import Layout from "../components/Layout";

const sections = [
  {
    icon: Shield,
    title: "Privacy-first design",
    text: "QuickSideTool is designed to keep file work simple and private. Many tools process files entirely in your browser, which means your files never leave your device. For tools that require backend processing, files are handled only for the requested task and are not stored or used to create profiles.",
  },
  {
    icon: Lock,
    title: "File handling and retention",
    text: "We do not use your files to create accounts, profiles, or personal records. Some tools may use temporary backend processing where required, and those files are handled solely for the requested task. Files are not retained longer than necessary for task completion.",
  },
  {
    icon: Cookie,
    title: "Cookies and analytics",
    text: "We may use essential cookies for website functionality, including remembering your tool preferences and session state. Optional analytics cookies help us understand how the site is used so we can improve the experience. You can manage cookie preferences through your browser settings.",
  },
  {
    icon: Mail,
    title: "Contact information",
    text: "If you contact us, we use the information you provide only to respond to your message, support request, feature idea, or bug report. We do not share your contact information with third parties for marketing purposes.",
  },
  {
    icon: Folder,
    title: "Third-party services",
    text: "Some tools may integrate with third-party services for specific functionality (e.g., PDF processing, image conversion). Any data shared with these services is governed by their own privacy policies. We only share the minimum data necessary to perform the requested task.",
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
      <Layout>
        <div className="container section max-w-4xl">
          <section className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Privacy Policy</p>
            <h1 className="h1 mt-2">Your files should stay yours.</h1>
            <p className="mt-4 max-w-2xl mx-auto text-gray-500 leading-relaxed">
              This page explains how QuickSideTool approaches privacy and data handling.
              Last updated: {new Date().toLocaleDateString()}.
            </p>
          </section>

          <section className="space-y-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <article key={section.title} className="card p-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-1">{section.title}</h2>
                      <p className="text-gray-500 leading-relaxed">{section.text}</p>
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
                <h2 className="font-semibold text-gray-900">Questions</h2>
                <p className="mt-1 text-sm text-gray-600">For privacy questions, contact support@quicksidetool.com.</p>
              </div>
            </div>
          </section>

          <section className="mt-6 card p-6 border-amber-200 bg-amber-50">
            <div className="flex gap-3">
              <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold text-gray-900">Effective date</h2>
                <p className="mt-1 text-sm text-gray-600">
                  This privacy policy was last updated on {new Date().toLocaleDateString()}. We may update this policy from time to time. Changes will be effective when posted on this page.
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