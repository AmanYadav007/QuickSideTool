import React, { useEffect, useState } from 'react';
import { getPublisherId } from '../config/adsense';
import AdPlaceholder from './AdPlaceholder';
<<<<<<< HEAD
import logger from '../utils/logger';
=======
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1

const AdSense = ({ 
  adSlot, 
  adFormat = 'auto', 
  style = {}, 
  className = '',
  responsive = true,
  position = 'horizontal'
}) => {
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    // Load AdSense script if not already loaded
    if (typeof window !== 'undefined' && !window.adsbygoogle) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${getPublisherId()}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Check if AdSense is ready and ads are approved
    const checkAdSense = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          // If no error, ads might be ready
          setShowPlaceholder(false);
        } catch (error) {
<<<<<<< HEAD
          logger.debug('AdSense not ready yet', error);
=======
          console.log('AdSense not ready:', error);
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
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
  }, [adSlot]);

  // For now, always show placeholder since AdSense is in approval process
  // This will automatically switch to real ads when approved
  if (showPlaceholder || !window.adsbygoogle) {
    return <AdPlaceholder position={position} className={className} style={style} />;
  }

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