// Google Tag Manager Event Tracking
export const trackConversion = (conversionId, conversionLabel, value = 0) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      'event': 'conversion',
      'conversion_id': conversionId,
      'conversion_label': conversionLabel,
      'value': value,
      'currency': 'USD'
    });
  }
};

// Track tool usage
export const trackToolUsage = (toolName) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      'event': 'tool_usage',
      'tool_name': toolName,
      'event_category': 'Tools',
      'event_label': toolName
    });
  }
};

// Track file processing
export const trackFileProcessing = (toolName, fileType, fileSize) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      'event': 'file_processed',
      'tool_name': toolName,
      'file_type': fileType,
      'file_size': fileSize,
      'event_category': 'File Processing'
    });
  }
};

// Track donation clicks
export const trackDonationClick = () => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      'event': 'donation_click',
      'event_category': 'Monetization',
      'event_label': 'Buy Me a Coffee'
    });
  }
};

// Track navigation to toolkit
export const trackToolkitNavigation = () => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      'event': 'toolkit_navigation',
      'event_category': 'Navigation',
      'event_label': 'Toolkit Dashboard'
    });
  }
}; 