import React from 'react';

/**
 * Dedicated, labelled ad container. Reserves layout space up-front so the page
 * does not shift when a network creative loads (good CLS, good revenue).
 *
 * size: 'leaderboard' (728x90), 'billboard' (970x250), 'rectangle' (336x280)
 */
const SIZES = {
  leaderboard: 'h-[100px] md:h-[90px] max-w-[728px]',
  billboard: 'h-[250px] md:h-[250px] max-w-[970px]',
  rectangle: 'h-[280px] max-w-[336px]',
};

const LABELS = {
  leaderboard: '728 × 90',
  billboard: '970 × 250',
  rectangle: '336 × 280',
};

const AdSlot = ({ size = 'leaderboard', className = '', children }) => {
  return (
    <aside
      aria-label="Advertisement"
      className={`mx-auto w-full ${className}`}
    >
      <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-secondary">
        Sponsored
      </p>
      <div
        className={`${SIZES[size]} mx-auto flex w-full items-center justify-center rounded-lg border border-border bg-card/60`}
      >
        {children || (
          <span className="text-xs text-secondary">{LABELS[size]} Banner</span>
        )}
      </div>
    </aside>
  );
};

export default AdSlot;
