import React from "react";
import { Link } from "react-router-dom";
import { Shield, Zap, Heart, ArrowRight } from "lucide-react";
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
];

const About = () => {
  return (
    <>
      <SEO
        title="About QuickSideTool"
        description="Learn about QuickSideTool, a simple browser-first toolkit for PDFs, images, QR codes, OCR, and file conversion."
      />
      <Layout>
        <div className="container section">
          <section className="text-center mb-12">
            <h1 className="h1">Simple tools for everyday file work</h1>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto leading-relaxed">
              QuickSideTool is built for people who need to resize images, compress files, make QR codes, convert documents, and get back to work without learning a complicated app.
            </p>
          </section>

          <section className="max-w-3xl mx-auto space-y-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article key={value.title} className="card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1">{value.title}</h2>
                      <p className="text-gray-500">{value.text}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="mt-12 text-center">
            <Link to="/home" className="btn-primary inline-flex items-center gap-2">
              Open App <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default About;