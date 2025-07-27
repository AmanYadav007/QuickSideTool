// Google Sheets Integration Utility
// This utility handles form submissions to Google Sheets using Google Apps Script

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfJ8qgedHb9z_JPm9qB7YFzOVRBIq9Bsyhbx4S5aSS6jB1yA2NJMb6gbp8kyriI0nATg/exec'; // Replace with your actual Google Apps Script URL

/**
 * Submit form data to Google Sheets
 * @param {Object} formData - The form data to submit
 * @param {string} formData.name - User's name
 * @param {string} formData.email - User's email
 * @param {string} formData.subject - Message subject
 * @param {string} formData.message - Message content
 * @param {string} formData.type - Type of submission (contact, feature-request, bug-report, etc.)
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
    console.error('Error submitting to Google Sheets:', error);
    
    // Check if it's a CORS error
    if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
      console.warn('CORS error detected, this might be due to Google Apps Script configuration');
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
 * Submit contact form data
 * @param {Object} contactData - Contact form data
 * @returns {Promise<Object>} - Submission result
 */
export const submitContactForm = async (contactData) => {
  return await submitToGoogleSheets({
    ...contactData,
    type: 'contact',
  });
};

/**
 * Submit feature request
 * @param {Object} featureData - Feature request data
 * @returns {Promise<Object>} - Submission result
 */
export const submitFeatureRequest = async (featureData) => {
  return await submitToGoogleSheets({
    ...featureData,
    type: 'feature-request',
  });
};

/**
 * Submit bug report
 * @param {Object} bugData - Bug report data
 * @returns {Promise<Object>} - Submission result
 */
export const submitBugReport = async (bugData) => {
  return await submitBugReport({
    ...bugData,
    type: 'bug-report',
  });
};

/**
 * Submit general feedback
 * @param {Object} feedbackData - Feedback data
 * @returns {Promise<Object>} - Submission result
 */
export const submitFeedback = async (feedbackData) => {
  return await submitToGoogleSheets({
    ...feedbackData,
    type: 'feedback',
  });
};

// Fallback function for when Google Sheets is not configured
export const submitToFallback = async (formData) => {
  // This is a fallback that logs the data locally
  // In production, you might want to send to an email service or other backend
  console.log('Form submission (fallback):', formData);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { 
    success: true, 
    message: 'Thank you for your submission! We\'ll get back to you soon.',
    fallback: true 
  };
};

// Main submission function that tries Google Sheets first, then falls back
export const submitForm = async (formData, type = 'contact') => {
  // If Google Script URL is not configured, use fallback
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    return await submitToFallback(formData);
  }

  try {
    const result = await submitToGoogleSheets({
      ...formData,
      type,
    });
    
    // If CORS error, use fallback
    if (result.corsError) {
      console.warn('CORS error detected, using fallback submission');
      return await submitToFallback(formData);
    }
    
    return result;
  } catch (error) {
    console.warn('Google Sheets submission failed, using fallback:', error);
    return await submitToFallback(formData);
  }
}; 