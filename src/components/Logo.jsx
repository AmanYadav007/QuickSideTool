import React from "react";

/**
 * The mark is the product itself: a browser side panel - a narrow rail of
 * controls beside a sheet of content. Same idea as the Chrome extension icon,
 * drawn in the site's blue instead of the old purple.
 */
export const LogoMark = ({ size = 28, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="qstMark" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#22D3EE" />
        <stop offset="0.55" stopColor="#3B82F6" />
        <stop offset="1" stopColor="#2563EB" />
      </linearGradient>
    </defs>

    {/* panel */}
    <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#qstMark)" />

    {/* side rail: the tool buttons */}
    <rect x="5" y="8.2" width="3.4" height="1.6" rx="0.8" fill="#fff" opacity="0.95" />
    <rect x="5" y="11.2" width="3.4" height="1.6" rx="0.8" fill="#fff" opacity="0.95" />
    <rect x="5" y="14.2" width="3.4" height="1.6" rx="0.8" fill="#fff" opacity="0.95" />

    {/* the document being worked on */}
    <rect x="11.5" y="5.5" width="7.5" height="13" rx="1.6" fill="#fff" opacity="0.95" />
  </svg>
);

/** Mark + wordmark. `compact` drops the wordmark (for tight spaces). */
const Logo = ({ size = 28, compact = false, className = "" }) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <LogoMark size={size} />
    {!compact && (
      <span
        className="font-extrabold tracking-tight text-[var(--color-text)]"
        style={{ fontSize: Math.round(size * 0.58) }}
      >
        Quick<span className="text-[var(--color-primary)]">Side</span>Tool
      </span>
    )}
  </span>
);

export default Logo;
