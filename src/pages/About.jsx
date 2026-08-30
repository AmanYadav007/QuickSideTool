import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Zap,
  Heart,
  ArrowRight,
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
];

const About = () => {
  return (
    <>
      <SEO
        title="About QuickSideTool"
        description="Learn about QuickSideTool, a simple browser-first toolkit for PDFs, images, QR codes, OCR, and file conversion."
      />

      <Layout showAnimatedBackground={false}>
        <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-8 md:px-8 md:pt-14">
          <section className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-400 dark:text-blue-300">
              About
            </p>
            <h1 className="text-3xl font-bold text-gray-100 dark:text-gray-900 md:text-4xl">
              Simple tools for everyday file work
            </h1>
            <p className="mt-4 text-gray-300 dark:text-gray-500 max-w-2xl mx-auto">
              QuickSideTool is built for people who need to resize images,
              compress files, make QR codes, convert documents, and get back to
              work without learning a complicated app.
            </p>
          </section>

          <section className="mt-8 space-y-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article
                  key={value.title}
                  className="flex items-start gap-3 rounded-lg border border-gray-200/20 bg-gray-900/20 dark:bg-gray-900 p-4"
                >
                  <div className="flex-shrink-0 h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-100 dark:text-gray-900">{value.title}</h2>
                    <p className="text-gray-300 dark:text-gray-500 text-sm">{value.text}</p>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="mt-8 flex gap-3">
            <Link
              to="/toolkit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Open toolkit <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Contact us
            </Link>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default About;
