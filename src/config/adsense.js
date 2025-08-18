// Google AdSense Configuration
export const ADSENSE_CONFIG = {
  // ✅ REAL AdSense Publisher ID
  PUBLISHER_ID: 'ca-pub-4914476223914148',
  
  // ✅ REAL Ad Slot IDs
  AD_SLOTS: {
    // Homepage Ads (2-3 ads)
    HOME_HERO: '7324881311',        // Extension Ads - After hero section
    HOME_FEATURES: '2353624224',    // 300x600 - Before features section
    HOME_ABOUT: '6077246815',       // Fluid layout - Before about section
    
    // Toolkit Page Ads (1-2 ads)
    TOOLKIT_TOP: '7091747913',      // 300x250 - Top of tools grid
    TOOLKIT_BOTTOM: '7324881311',   // Extension Ads - Bottom of tools grid
  },
  
  // Ad Formats
  AD_FORMATS: {
    BANNER: 'auto',
    RESPONSIVE: 'auto',
    RECTANGLE: 'rectangle',
    FLUID: 'fluid',
  },
  
  // Ad Styles
  AD_STYLES: {
    container: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '16px',
      backdropFilter: 'blur(8px)',
      margin: '16px 0',
    },
    ad: {
      minHeight: '90px',
      display: 'block',
      textAlign: 'center',
    }
  }
};

// Helper function to get ad slot
export const getAdSlot = (slotName) => {
  return ADSENSE_CONFIG.AD_SLOTS[slotName] || '';
};

// Helper function to get publisher ID
export const getPublisherId = () => {
  return ADSENSE_CONFIG.PUBLISHER_ID;
}; 