import React, { useEffect, useState } from 'react';
import { getPublisherId } from '../config/adsense';
import logger from '../utils/logger';

const AdSense = ({ 
  adSlot, 
  adFormat = 'auto', 
  style = {}, 
  className = '',
  responsive = true,
  position = 'horizontal'
}) => {
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [adsLoaded, setAdsLoaded] = useState(false);

  useEffect(() => {
    // Load AdSense script if not already loaded
    if (typeof window !== 'undefined' && !window.adsbygoogle) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${getPublisherId()}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
      
      script.onload = () => {
        logger.info('AdSense script loaded successfully');
        setAdsLoaded(true);
      };
      
      script.onerror = () => {
        logger.error('Failed to load AdSense script');
        setAdsLoaded(false);
      };
    } else if (window.adsbygoogle) {
      setAdsLoaded(true);
    }

    // Check if AdSense is ready and ads are approved
    const checkAdSense = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle && adsLoaded) {
        try {
          // Try to push an ad - if it works, ads are approved
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setShowPlaceholder(false);
          logger.info('AdSense ads are ready and approved!');
        } catch (error) {
          logger.debug('AdSense not ready yet or not approved:', error);
          setShowPlaceholder(true);
        }
      } else {
        setShowPlaceholder(true);
      }
    };

    // Initial check
    checkAdSense();

    // Retry after delay
    const timer = setTimeout(checkAdSense, 3000);

    return () => clearTimeout(timer);
  }, [adSlot, adsLoaded]);

  // Show placeholder while loading or if ads aren't approved yet
  if (showPlaceholder || !adsLoaded) {
    return (
      <div className={`ad-placeholder ${className}`} style={style}>
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
          <div className="text-purple-400 text-sm font-medium mb-2">
            {!adsLoaded ? 'Loading AdSense...' : 'AdSense Loading...'}
          </div>
          <div className="text-purple-300 text-xs">
            {!adsLoaded ? 'Initializing ad system' : 'Preparing ads for display'}
          </div>
        </div>
      </div>
    );
  }

  // Show real AdSense ad
  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={getPublisherId()}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default AdSense; 