import React, { useEffect, useState } from 'react';
import { Coffee } from 'lucide-react';

const BuyMeACoffee = () => {
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY + 10) setHidden(true); // scrolling down => hide
      if (y < lastY - 10) setHidden(false); // scrolling up => show
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  const handleClick = () => {
    window.open('https://www.buymeacoffee.com/amanryadav', '_blank');
  };

  return (
    <div
      className={`fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-4 md:bottom-8 md:right-8 z-40 transition-opacity duration-300 ${
        hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <button
        aria-label="Support the project"
        onClick={handleClick}
        className="group relative flex items-center gap-2 md:gap-3 rounded-lg border border-amber-200/20 bg-[#091923]/90 text-amber-100 shadow-xl backdrop-blur-md px-3 py-2 md:px-5 md:py-3 hover:border-amber-200/60 hover:bg-[#102936] transition-all duration-300"
      >
        <span className="relative flex items-center justify-center w-8 h-8 md:w-5 md:h-5 rounded-full bg-white/10">
          <Coffee className="w-4 h-4 md:w-4 md:h-4" />
        </span>
        <span className="hidden md:inline text-sm font-semibold">Support</span>

        <span className="absolute inset-0 rounded-lg ring-0 group-hover:ring-4 ring-amber-200/10 transition-all duration-300" />
      </button>
    </div>
  );
};

export default BuyMeACoffee;
