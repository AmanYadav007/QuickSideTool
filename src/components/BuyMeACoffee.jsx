import React, { useEffect, useState } from 'react';
import { Coffee, Heart } from 'lucide-react';

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
        className="group relative flex items-center gap-2 md:gap-3 rounded-full border border-white/15 bg-gradient-to-r from-cyan-600/90 to-emerald-500/90 text-white shadow-xl backdrop-blur-md px-3 py-2 md:px-5 md:py-3 hover:from-cyan-500 hover:to-emerald-500 transition-all duration-300"
      >
        <span className="relative flex items-center justify-center w-8 h-8 md:w-5 md:h-5 rounded-full bg-white/10">
          <Coffee className="w-4 h-4 md:w-4 md:h-4" />
        </span>
        <span className="hidden md:inline text-sm font-semibold">Support</span>
        <Heart className="hidden md:inline w-3.5 h-3.5 text-pink-400 fill-pink-400 animate-pulse" />

        <span className="absolute inset-0 rounded-full ring-0 group-hover:ring-4 ring-white/10 transition-all duration-300" />
      </button>
    </div>
  );
};

export default BuyMeACoffee;