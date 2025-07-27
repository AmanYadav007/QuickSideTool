import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';

const AdPlaceholder = ({ position = 'horizontal', className = '' }) => {
  const isHorizontal = position === 'horizontal';
  const isVertical = position === 'vertical';
  const isBanner = position === 'banner';

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const getDimensions = () => {
    if (isHorizontal) return 'w-full h-20 md:h-24';
    if (isVertical) return 'w-72 h-96 md:h-[600px]';
    if (isBanner) return 'w-full h-16 md:h-20';
    return 'w-full h-20';
  };

  const getContent = () => {
    if (isHorizontal) {
      return (
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-400" size={16} />
            <span className="text-sm font-medium text-purple-300">Premium Tools</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="text-blue-400" size={16} />
            <span className="text-sm font-medium text-blue-300">Boost Productivity</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="text-green-400" size={16} />
            <span className="text-sm font-medium text-green-300">Lightning Fast</span>
          </div>
        </div>
      );
    }

    if (isVertical) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <div className="text-center space-y-3">
            <Sparkles className="text-purple-400 mx-auto" size={24} />
            <h4 className="text-sm font-semibold text-purple-300">Premium Features</h4>
            <p className="text-xs text-gray-400">Unlock advanced tools</p>
          </div>
          <div className="text-center space-y-3">
            <TrendingUp className="text-blue-400 mx-auto" size={24} />
            <h4 className="text-sm font-semibold text-blue-300">Pro Tools</h4>
            <p className="text-xs text-gray-400">Professional solutions</p>
          </div>
          <div className="text-center space-y-3">
            <Zap className="text-green-400 mx-auto" size={24} />
            <h4 className="text-sm font-semibold text-green-300">Fast Processing</h4>
            <p className="text-xs text-gray-400">Optimized performance</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-3">
        <Sparkles className="text-purple-400" size={14} />
        <span className="text-xs font-medium text-purple-300">Premium Tools Available</span>
        <TrendingUp className="text-blue-400" size={14} />
      </div>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`${getDimensions()} ${className} bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-600/30 rounded-lg flex items-center justify-center overflow-hidden relative group`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {getContent()}
      </div>
      
      {/* Corner accent */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-60"></div>
    </motion.div>
  );
};

export default AdPlaceholder; 