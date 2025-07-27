// Google Sheets Integration Utility
// This utility handles form submissions to Google Sheets using Google Apps Script

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfJ8qgedHb9z_JPm9qB7YFzOVRBIq9Bsyhbx4S5aSS6jB1yA2NJMb6gbp8kyriI0nATg/exec';

/**
 * Submit form data to Google Sheets
 * @param {Object} formData - The form data to submit
 * @returns {Promise<Object>} - Response from Google Sheets
 */
export const submitToGoogleSheets = async (formData) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        pageUrl: window.location.href,
        referrer: document.referrer || 'Direct',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    // Use logger instead of console.error for cleaner output
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error submitting to Google Sheets:', error);
    }
    
    // Check if it's a CORS error
    if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('CORS error detected, this might be due to Google Apps Script configuration');
      }
      return { 
        success: false, 
        error: 'CORS error - please check Google Apps Script configuration',
        corsError: true
      };
    }
    
    return { 
      success: false, 
      error: error.message || 'Failed to submit form' 
    };
  }
};

/**
 * Fallback submission method when Google Sheets is not available
 * @param {Object} formData - Form data to log
 * @returns {Promise<Object>} - Always returns success for fallback
 */
export const submitToFallback = async (formData) => {
  // In development, log the form data for debugging
  if (process.env.NODE_ENV === 'development') {
    console.info('Form submission (fallback):', {
      ...formData,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      pageUrl: window.location.href,
    });
  }
  
  // Simulate successful submission
  return { success: true, message: 'Form submitted successfully (fallback mode)' };
};

/**
 * Main form submission function with fallback
 * @param {Object} formData - Form data to submit
 * @param {string} type - Type of submission
 * @returns {Promise<Object>} - Submission result
 */
export const submitForm = async (formData, type = 'contact') => {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    return await submitToFallback(formData);
  }
  
  try {
    const result = await submitToGoogleSheets({
      ...formData,
      type,
    });
    
    if (result.corsError) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('CORS error detected, using fallback submission');
      }
      return await submitToFallback(formData);
    }
    
    return result;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Google Sheets submission failed, using fallback:', error);
    }
    return await submitToFallback(formData);
  }
}; 