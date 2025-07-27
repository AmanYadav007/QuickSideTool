// Background script for browser extension
chrome.runtime.onInstalled.addListener(() => {
  // Extension installed or updated
  chrome.storage.local.set({ 
    installed: true, 
    version: '1.0.0',
    installDate: new Date().toISOString()
  });
});

// Handle extension errors gracefully
chrome.runtime.onSuspend.addListener(() => {
  // Extension is being suspended
  chrome.storage.local.set({ 
    lastActive: new Date().toISOString() 
  });
});

// Error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  // Log error but don't crash the extension
  if (process.env.NODE_ENV === 'development') {
    console.warn('Background script: Unhandled promise rejection', event.reason);
  }
  event.preventDefault();
});