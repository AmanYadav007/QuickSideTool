import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  variant = 'default',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const variants = {
    default: {
      spinner: 'text-blue-500',
      container: 'flex items-center justify-center'
    },
    overlay: {
      spinner: 'text-white',
      container: 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'
    },
    inline: {
      spinner: 'text-gray-400',
      container: 'flex items-center justify-center'
    }
  };

  const currentVariant = variants[variant];

  return (
    <div className={`${currentVariant.container} ${className}`}>
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`${sizeClasses[size]} ${currentVariant.spinner} mx-auto mb-2`}
        >
          <Loader2 className="w-full h-full" />
        </motion.div>
        {text && (
          <p className="text-sm text-gray-500 animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

// Specialized loading components
export const PageLoader = () => (
  <LoadingSpinner 
    size="xl" 
    text="Loading QuickSideTool..." 
    variant="overlay" 
  />
);

export const ToolLoader = ({ text = "Processing..." }) => (
  <LoadingSpinner 
    size="lg" 
    text={text} 
    variant="default" 
  />
);

export const InlineLoader = ({ text }) => (
  <LoadingSpinner 
    size="sm" 
    text={text} 
    variant="inline" 
  />
);

export default LoadingSpinner; 