import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SCENE_MS = 4000;

/* A page thumbnail used by the merge scene. */
const MiniPage = ({ style, className = "" }) => (
  <div className={`qs-page ${className}`} style={style}>
    <span className="qs-page-line" style={{ width: "72%" }} />
    <span className="qs-page-line" style={{ width: "90%" }} />
    <span className="qs-page-line" style={{ width: "58%" }} />
    <span className="qs-page-line" style={{ width: "84%" }} />
  </div>
);

const MergeScene = () => (
  <div className="qs-scene">
    <div className="qs-merge">
      {[
        // --x/--y/--r is where the page starts, --fx/--fy/--fr where it lands:
        // a slight offset so the merged result still reads as three pages.
        { "--x": "-104px", "--y": "-10px", "--r": "-9deg", "--fx": "-9px", "--fy": "-7px", "--fr": "-3deg" },
        { "--x": "0px", "--y": "14px", "--r": "4deg", "--fx": "0px", "--fy": "0px", "--fr": "0deg" },
        { "--x": "104px", "--y": "-8px", "--r": "9deg", "--fx": "9px", "--fy": "7px", "--fr": "3deg" },
      ].map((vars, i) => (
        <MiniPage
          key={i}
          className="qs-merge-page"
          style={{ ...vars, animationDelay: `${i * 110}ms`, zIndex: 3 - i }}
        />
      ))}
    </div>
    <span className="qs-chip qs-chip--late">1 PDF · 3 pages</span>
  </div>
);

const CompressScene = () => (
  <div className="qs-scene">
    <div className="qs-bars">
      <div className="qs-bar-row">
        <span className="qs-bar-label">Before</span>
        <span className="qs-bar qs-bar--before" />
        <span className="qs-bar-size">8.4 MB</span>
      </div>
      <div className="qs-bar-row">
        <span className="qs-bar-label">After</span>
        <span className="qs-bar qs-bar--after" />
        <span className="qs-bar-size qs-bar-size--accent">1.1 MB</span>
      </div>
    </div>
    <span className="qs-chip qs-chip--late">87% smaller</span>
  </div>
);

const ConvertScene = () => (
  <div className="qs-scene">
    <div className="qs-convert">
      <span className="qs-format">PDF</span>
      <ArrowRight className="qs-convert-arrow" aria-hidden="true" />
      <span className="qs-format qs-format--out">DOCX</span>
    </div>
    <span className="qs-chip qs-chip--late">Formatting kept intact</span>
  </div>
);

const ExtractScene = () => (
  <div className="qs-scene">
    <div className="qs-extract">
      <div className="qs-doc">
        <span className="qs-doc-line" style={{ width: "80%" }} />
        <span className="qs-doc-line" style={{ width: "95%" }} />
        <span className="qs-doc-line" style={{ width: "66%" }} />
        <span className="qs-doc-line" style={{ width: "88%" }} />
        <span className="qs-doc-line" style={{ width: "74%" }} />
        <span className="qs-scanline" />
      </div>
      <div className="qs-text-out">
        {["Invoice #2043", "Total: $1,280.00", "Due 14 Mar 2026"].map((t, i) => (
          <span key={t} className="qs-text-line" style={{ animationDelay: `${600 + i * 420}ms` }}>
            {t}
          </span>
        ))}
      </div>
    </div>
    <span className="qs-chip qs-chip--late">Selectable, searchable text</span>
  </div>
);

const SCENES = [
  {
    id: "merge",
    label: "Merge",
    caption: "Drop in PDFs and images, drag them into order, download one file.",
    to: "/pdf-tool",
    cta: "Open combiner",
    Scene: MergeScene,
  },
  {
    id: "compress",
    label: "Compress",
    caption: "Shrink a PDF or image until it fits the upload limit.",
    to: "/pdf-compressor",
    cta: "Open compressor",
    Scene: CompressScene,
  },
  {
    id: "convert",
    label: "Convert",
    caption: "Move between PDF, Word, PNG, JPG and WebP in one step.",
    to: "/pdf-to-word",
    cta: "Open converter",
    Scene: ConvertScene,
  },
  {
    id: "extract",
    label: "Extract",
    caption: "Pull real text out of a scan or screenshot.",
    to: "/ocr-processor",
    cta: "Open OCR scanner",
    Scene: ExtractScene,
  },
];

const ToolShowcase = () => {
  const [index, setIndex] = useState(0);
  // Bumped on every scene change so clicking the tab you are already on
  // replays that scene instead of appearing to do nothing.
  const [run, setRun] = useState(0);

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Keying the timeout to `run` means a manual tab click restarts the dwell,
  // instead of cutting the scene the visitor just chose short.
  useEffect(() => {
    if (reducedMotion) return undefined;
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % SCENES.length);
      setRun((r) => r + 1);
    }, SCENE_MS);
    return () => clearTimeout(timer);
  }, [run, reducedMotion]);

  const show = (i) => {
    setIndex(i);
    setRun((r) => r + 1);
  };

  const active = SCENES[index];
  const { Scene } = active;

  return (
    <div className="qs-showcase">
      <div className="qs-tabs" role="tablist" aria-label="What QuickSideTool does">
        {SCENES.map((scene, i) => (
          <button
            key={scene.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => show(i)}
            className={`qs-tab ${i === index ? "qs-tab--active" : ""}`}
          >
            {scene.label}
            {i === index && !reducedMotion && (
              <span key={run} className="qs-tab-progress" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>

      <div className="qs-screen" key={`${active.id}-${run}`}>
        <Scene />
      </div>

      <div className="qs-showcase-foot">
        <p className="qs-caption" key={`cap-${active.id}-${run}`}>
          {active.caption}
        </p>
        <Link to={active.to} className="qs-showcase-cta">
          {active.cta}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};

export default ToolShowcase;
