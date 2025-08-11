import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Heart, Sparkles } from 'lucide-react';

const BuyMeACoffee = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    window.open('https://www.buymeacoffee.com/amanryadav', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-40"
    >
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-black/80 backdrop-blur-md rounded-lg text-white text-xs font-medium whitespace-nowrap"
          >
            Support the project ☕
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="group relative bg-gradient-to-r from-purple-600/90 via-blue-600/90 to-purple-700/90 hover:from-purple-500 hover:via-blue-500 hover:to-purple-600 text-white font-medium py-3 px-5 rounded-2xl shadow-2xl transition-all duration-300 border border-white/20 backdrop-blur-xl flex items-center gap-3 min-w-[180px] overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-4 -right-4 w-8 h-8 border-2 border-white/30 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-2 -left-2 w-6 h-6 border border-white/20 rounded-full"
          />
        </div>

        {/* Coffee Icon with Pulse */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            scale: { duration: 2, repeat: Infinity },
            rotate: { duration: 3, repeat: Infinity }
          }}
          className="relative"
        >
          <Coffee className="w-4 h-4" />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-1 bg-purple-400/30 rounded-full"
          />
        </motion.div>

        {/* Text */}
        <span className="text-sm font-semibold relative z-10">Support</span>

        {/* Heart Icon */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
          className="relative z-10"
        >
          <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
        </motion.div>

        {/* Sparkles Effect */}
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="w-3 h-3 text-yellow-300" />
        </motion.div>
      </motion.button>

      {/* Floating Particles */}
      <motion.div
        animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1 -left-1 w-2 h-2 bg-purple-400/60 rounded-full"
      />
      <motion.div
        animate={{ y: [0, -6, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-blue-400/60 rounded-full"
      />
    </motion.div>
  );
};

export default BuyMeACoffee; 