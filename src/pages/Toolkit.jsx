import React from "react";
import Layout from "../components/Layout";
import ToolDirectory from "../components/ToolDirectory";
import AdSlot from "../components/AdSlot";
import { SpeedInsights } from "@vercel/speed-insights/react";

const Toolkit = () => {
  return (
    <Layout>
      <main className="mx-auto w-full max-w-content px-4 py-8 md:px-6 md:py-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primaryHover">
            Toolkit
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-text md:text-4xl">
            Choose a tool
          </h1>
          <p className="mt-3 text-base leading-relaxed text-secondary md:text-lg">
            Everything in one place. Pick a tool and its full page opens with all
            the options.
          </p>
        </div>

        <div className="mt-8">
          <ToolDirectory />
        </div>

        <div className="pt-8">
          <AdSlot size="leaderboard" />
        </div>
        <SpeedInsights />
      </main>
    </Layout>
  );
};

export default Toolkit;
