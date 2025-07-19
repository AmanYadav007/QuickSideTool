// Google AdSense Configuration
export const ADSENSE_CONFIG = {
  // Replace with your actual AdSense Publisher ID
  PUBLISHER_ID: 'ca-pub-6691394501138909',
  
  // Ad Slots for different pages
  AD_SLOTS: {
    // Landing Page Ads
    LANDING_HERO: '4643686467',      // After hero section
    LANDING_FEATURES: '2025261981',  // Before about section
    
    // Toolkit Page Ads  
    TOOLKIT_TOP: '3179433696',       // Top of tools grid
    TOOLKIT_BOTTOM: '1427545936',    // Bottom of tools grid
  },
  
  // Ad Formats
  AD_FORMATS: {
    BANNER: 'auto',
    RESPONSIVE: 'auto',
    RECTANGLE: 'rectangle',
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