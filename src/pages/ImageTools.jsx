import React from "react";
import SEO from "../components/SEO";
import Layout from "../components/Layout";
import AdSlot from "../components/AdSlot";
import { ToolCategory, categories } from "../components/ToolDirectory";
import { CheckCircle, Image as ImageIcon } from "lucide-react";

const HIGHLIGHTS = [
  "Batch upload supported",
  "JPG, PNG, and WebP friendly",
  "Download single files or ZIP",
];

const source = categories.find((category) => category.id === "image-tools");
// Drop the "Image Toolkit" entry — on this page it would link back to itself.
const imageCategory = {
  ...source,
  tools: source.tools.filter((tool) => tool.to !== "/image-tools"),
};

const ImageTools = () => {
  return (
    <Layout>
      <SEO
        title="Free Image Tools - Resize, Compress and Convert Images"
        description="Simple image tools for resizing, compressing and converting JPG, PNG, and WebP images. Pick a tool, choose your options, and download the result."
      />

      <main className="mx-auto w-full max-w-content px-4 py-8 md:px-6 md:py-12">
        <section className="rounded-lg border border-border bg-card/40 p-5 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ImageIcon className="h-6 w-6 text-primaryHover" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-primaryHover">
                Image tools
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-text md:text-4xl">
                Make images ready faster
              </h1>
              <p className="mt-3 leading-relaxed text-secondary">
                Pick one job: resize for dimensions, compress for smaller files, or
                convert between formats. Each tool opens on its own focused page.
              </p>
            </div>

            <ul className="grid gap-2.5 text-sm text-secondary">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 shrink-0 text-primaryHover" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="mt-6">
          <ToolCategory {...imageCategory} />
        </div>

        <div className="pt-8">
          <AdSlot size="leaderboard" />
        </div>
      </main>
    </Layout>
  );
};

export default ImageTools;
