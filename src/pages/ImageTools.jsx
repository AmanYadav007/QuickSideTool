import React from "react";
import SEO from "../components/SEO";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Image,
  Minimize2,
  MoveDiagonal,
  RefreshCw,
} from "lucide-react";

const imageTools = [
  {
    title: "Resize Images",
    description: "Set exact width and height, keep aspect ratio, and download one image or a ZIP.",
    to: "/image-tools/resize",
    icon: MoveDiagonal,
    action: "Open resizer",
  },
  {
    title: "Compress Images",
    description: "Reduce image file size for websites, forms, and sharing.",
    to: "/image-tools/compress",
    icon: Minimize2,
    action: "Open compressor",
  },
  {
    title: "Convert Images",
    description: "Change image format between JPG, PNG, and WebP.",
    to: "/image-tools/convert",
    icon: RefreshCw,
    action: "Open converter",
  },
];

const ImageTools = () => {
  return (
    <Layout showAnimatedBackground={false}>
      <SEO
        title="Free Image Tools - Resize and Compress Images"
        description="Simple image tools for resizing and compressing JPG, PNG, and WebP images. Pick a tool, choose your options, and download the result."
        url="https://quicksidetool.com/image-tools"
      />

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-8 md:pt-14">
        <section className="rounded-lg border border-white/10 bg-[#0b1f2a]/85 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200 ring-1 ring-amber-200/20">
                <Image className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">
                Image tools
              </p>
              <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">
                Make images ready faster
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                Choose one job: resize for dimensions, or compress for smaller
                files. Each tool opens on its own focused page.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-slate-300">
              <Benefit text="Batch upload supported" />
              <Benefit text="JPG, PNG, and WebP friendly" />
              <Benefit text="Download single files or ZIP" />
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {imageTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.to}
                to={tool.to}
                className="group rounded-lg border border-white/10 bg-[#102936] p-6 transition hover:-translate-y-0.5 hover:border-amber-200/50 hover:bg-[#143241] focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200 ring-1 ring-amber-200/20">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="text-xl font-semibold text-white">
                      {tool.title}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-slate-300">
                      {tool.description}
                    </span>
                  </span>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-amber-200">
                  {tool.action}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </section>

        <section className="mt-8 rounded-lg border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-semibold text-white">
            Which one should I use?
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <HelpCard
              title="Use Resize when..."
              text="You need an exact size like 1200x628, a smaller thumbnail, or matching dimensions for many images."
            />
            <HelpCard
              title="Use Compress when..."
              text="The image size is too large for upload, email, website speed, or form limits."
            />
            <HelpCard
              title="Use Convert when..."
              text="You need a different format like WebP for websites, JPG for sharing, or PNG for transparency."
            />
          </div>
        </section>
      </div>
    </Layout>
  );
};

const Benefit = ({ text }) => (
  <div className="flex items-center gap-2">
    <CheckCircle className="h-4 w-4 text-amber-200" />
    <span>{text}</span>
  </div>
);

const HelpCard = ({ title, text }) => (
  <div className="rounded-lg border border-white/10 bg-[#0b1f2a] p-4">
    <h3 className="font-semibold text-white">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
  </div>
);

export default ImageTools;
