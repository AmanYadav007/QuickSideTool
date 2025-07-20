// Consent Management Utility Functions

// Initialize consent state
export const initializeConsent = () => {
  const existingConsent = localStorage.getItem('quickSideTool_consent');
  
  if (existingConsent) {
    try {
      const consent = JSON.parse(existingConsent);
      updateGTMConsent(consent.preferences);
      return consent.preferences;
    } catch (error) {
      console.error('Error parsing consent data:', error);
      localStorage.removeItem('quickSideTool_consent');
    }
  }
  
  // Default consent state
  const defaultConsent = {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  };
  
  updateGTMConsent(defaultConsent);
  return defaultConsent;
};

// Update Google Tag Manager consent
export const updateGTMConsent = (consentPreferences) => {
  if (window.dataLayer) {
    window.dataLayer.push({
      'event': 'consent_update',
      'consent_state': {
        'analytics_storage': consentPreferences.analytics ? 'granted' : 'denied',
        'ad_storage': consentPreferences.marketing ? 'granted' : 'denied',
        'functionality_storage': consentPreferences.preferences ? 'granted' : 'denied',
        'personalization_storage': consentPreferences.preferences ? 'granted' : 'denied',
        'security_storage': 'granted' // Always granted
      }
    });
  }
};

// Save consent to localStorage
export const saveConsent = (preferences) => {
  const consentData = {
    timestamp: new Date().toISOString(),
    preferences: preferences,
    version: '1.0'
  };
  
  localStorage.setItem('quickSideTool_consent', JSON.stringify(consentData));
  updateGTMConsent(preferences);
};

// Check if user has given consent for specific category
export const hasConsent = (category) => {
  const existingConsent = localStorage.getItem('quickSideTool_consent');
  
  if (!existingConsent) return false;
  
  try {
    const consent = JSON.parse(existingConsent);
    return consent.preferences[category] || false;
  } catch (error) {
    console.error('Error checking consent:', error);
    return false;
  }
};

// Check if user is in European region
export const isEuropeanUser = () => {
  // List of European Economic Area countries, UK, and Switzerland
  const europeanCountries = [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 
    'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 
    'SK', 'SI', 'ES', 'SE', 'CH', 'GB'
  ];
  
  // Try to get country from timezone (simplified approach)
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isEuropeanTimezone = timezone.startsWith('Europe/') || 
                            timezone.startsWith('Atlantic/') || 
                            timezone.includes('London') ||
                            timezone.includes('Dublin');
  
  return isEuropeanTimezone;
};

// Revoke all consent
export const revokeConsent = () => {
  localStorage.removeItem('quickSideTool_consent');
  
  const defaultConsent = {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  };
  
  updateGTMConsent(defaultConsent);
  return defaultConsent;
};

// Get consent summary for analytics
export const getConsentSummary = () => {
  const existingConsent = localStorage.getItem('quickSideTool_consent');
  
  if (!existingConsent) {
    return {
      hasConsent: false,
      analytics: false,
      marketing: false,
      preferences: false
    };
  }
  
  try {
    const consent = JSON.parse(existingConsent);
    return {
      hasConsent: true,
      analytics: consent.preferences.analytics || false,
      marketing: consent.preferences.marketing || false,
      preferences: consent.preferences.preferences || false,
      timestamp: consent.timestamp
    };
  } catch (error) {
    console.error('Error getting consent summary:', error);
    return {
      hasConsent: false,
      analytics: false,
      marketing: false,
      preferences: false
    };
  }
}; 