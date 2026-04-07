import React from "react";
import Layout from "../components/Layout";
import ToolDirectory from "../components/ToolDirectory";
import { SpeedInsights } from "@vercel/speed-insights/react";

const Toolkit = () => {
  return (
    <Layout showAnimatedBackground={false}>
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 md:px-8 md:pt-14">
        <div className="mb-10 rounded-lg border border-white/10 bg-[#081f29]/80 p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            Toolkit
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">
            Choose a tool
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Everything is listed in one place. Click the tool you need and the
            full tool page opens with all its options.
          </p>
        </div>

        <ToolDirectory showIntro={false} />
        <SpeedInsights />
      </main>
    </Layout>
  );
};

export default Toolkit;
