import React, { useEffect, useRef, useState } from "react";
import { Maximize, ScanLine } from "lucide-react";
import { detectPage, fullImageQuad } from "../../utils/scan";

/**
 * Drag the four corners of the page. Works in the source image's pixel
 * coordinates (the SVG viewBox matches the image), so no scaling maths.
 */
const CropEditor = ({ source, quad, onApply, onCancel }) => {
  const [corners, setCorners] = useState(quad || fullImageQuad(source));
  const [imageUrl, setImageUrl] = useState(null);
  // The handles are positioned over the photo, so wait until it has its size
  const [imageLoaded, setImageLoaded] = useState(false);
  const [notice, setNotice] = useState("");
  const svgRef = useRef(null);
  const dragging = useRef(null);

  useEffect(() => {
    let url;
    source.toBlob(
      (blob) => {
        url = URL.createObjectURL(blob);
        setImageUrl(url);
      },
      "image/jpeg",
      0.9,
    );
    return () => url && URL.revokeObjectURL(url);
  }, [source]);

  const toImagePoint = (event) => {
    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const { x, y } = point.matrixTransform(svg.getScreenCTM().inverse());
    return {
      x: Math.min(source.width, Math.max(0, x)),
      y: Math.min(source.height, Math.max(0, y)),
    };
  };

  const onPointerMove = (event) => {
    if (dragging.current === null) return;
    const point = toImagePoint(event);
    setCorners((prev) =>
      prev.map((c, i) => (i === dragging.current ? point : c)),
    );
  };

  const autoDetect = () => {
    const found = detectPage(source);
    setCorners(found || fullImageQuad(source));
    setNotice(
      found ? "" : "Couldn't find the page edges - drag the corners instead.",
    );
  };

  const handle = Math.max(source.width, source.height) * 0.035;
  const outline = corners.map((c) => `${c.x},${c.y}`).join(" ");

  return (
    <div>
      <p className="mb-2 text-center text-sm text-[var(--color-text-muted)]">
        Drag the corners to the edges of the page.
      </p>
      <div className="relative mx-auto max-h-[65vh] w-fit touch-none select-none">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Page to crop"
            className="block max-h-[65vh] max-w-full"
            draggable={false}
            onLoad={() => setImageLoaded(true)}
          />
        )}
        {!imageLoaded && (
          <div className="h-48 w-64 max-w-full animate-pulse rounded bg-[var(--color-bg-alt)]" />
        )}
        {imageLoaded && (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${source.width} ${source.height}`}
            className="absolute inset-0 h-full w-full"
            onPointerMove={onPointerMove}
            onPointerUp={() => (dragging.current = null)}
            onPointerCancel={() => (dragging.current = null)}
          >
            {/* Dim everything outside the page */}
            <path
              d={`M0,0 H${source.width} V${source.height} H0 Z M${outline.replace(/ /g, " L")} Z`}
              fillRule="evenodd"
              fill="rgba(0,0,0,0.5)"
            />
            <polygon
              points={outline}
              fill="none"
              stroke="#00DF81"
              strokeWidth={handle * 0.15}
            />
            {corners.map((c, i) => (
              <circle
                key={i}
                cx={c.x}
                cy={c.y}
                r={handle}
                fill="rgba(0,223,129,0.35)"
                stroke="#fff"
                strokeWidth={handle * 0.12}
                className="cursor-grab"
                onPointerDown={(e) => {
                  dragging.current = i;
                  svgRef.current.setPointerCapture(e.pointerId);
                }}
              />
            ))}
          </svg>
        )}
      </div>

      {notice && (
        <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
          {notice}
        </p>
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={autoDetect}
          className="btn-secondary px-4 py-2"
        >
          <ScanLine className="h-4 w-4" /> Auto-detect
        </button>
        <button
          type="button"
          onClick={() => setCorners(fullImageQuad(source))}
          className="btn-secondary px-4 py-2"
        >
          <Maximize className="h-4 w-4" /> Full image
        </button>
      </div>
      <div className="mt-3 flex justify-center gap-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onApply(corners)}
          className="btn-primary"
        >
          Apply crop
        </button>
      </div>
    </div>
  );
};

export default CropEditor;
