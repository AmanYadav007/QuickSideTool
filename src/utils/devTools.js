/**
 * Development Tools and Utilities for QuickSideTool
 * Provides helpful debugging and development features
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Development-only debug utility
 * @param {string} component - Component name
 * @param {string} method - Method name
 * @param {any} data - Data to log
 */
export const devLog = (component, method, data = null) => {
  if (!isDevelopment) return;
  
  const timestamp = new Date().toISOString();
  const logMessage = `[DEV] ${component}.${method} (${timestamp})`;
  
  if (data) {
    console.group(logMessage);
    console.log(data);
    console.groupEnd();
  } else {
    console.log(logMessage);
  }
};

/**
 * Performance measurement utility
 * @param {string} label - Label for the measurement
 * @param {Function} fn - Function to measure
 * @returns {Promise<any>} - Result of the function
 */
export const measurePerformance = async (label, fn) => {
  if (!isDevelopment) {
    return await fn();
  }
  
  const start = performance.now();
  try {
    const result = await fn();
    const end = performance.now();
    console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
    return result;
  } catch (error) {
    const end = performance.now();
    console.error(`❌ ${label} failed after ${(end - start).toFixed(2)}ms:`, error);
    throw error;
  }
};

/**
 * Component render counter for debugging
 */
export const createRenderCounter = (componentName) => {
  let renderCount = 0;
  
  return () => {
    if (isDevelopment) {
      renderCount++;
      console.log(`🔄 ${componentName} rendered ${renderCount} times`);
    }
  };
};

/**
 * State change logger
 * @param {string} component - Component name
 * @param {string} stateName - State variable name
 * @param {any} oldValue - Previous value
 * @param {any} newValue - New value
 */
export const logStateChange = (component, stateName, oldValue, newValue) => {
  if (!isDevelopment) return;
  
  console.log(`📊 ${component}.${stateName}:`, {
    from: oldValue,
    to: newValue,
    changed: oldValue !== newValue
  });
};

/**
 * Error boundary helper
 * @param {Error} error - Error object
 * @param {string} context - Error context
 */
export const logError = (error, context = 'Unknown') => {
  if (isDevelopment) {
    console.group(`❌ Error in ${context}`);
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    console.error('Context:', context);
    console.groupEnd();
  }
};

/**
 * Memory usage logger (development only)
 */
export const logMemoryUsage = () => {
  if (!isDevelopment || !performance.memory) return;
  
  const memory = performance.memory;
  console.log('🧠 Memory Usage:', {
    used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
    total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
    limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
  });
};

/**
 * Network request logger
 * @param {string} url - Request URL
 * @param {string} method - HTTP method
 * @param {number} status - Response status
 * @param {number} duration - Request duration in ms
 */
export const logNetworkRequest = (url, method, status, duration) => {
  if (!isDevelopment) return;
  
  const statusIcon = status >= 200 && status < 300 ? '✅' : '❌';
  console.log(`${statusIcon} ${method} ${url} (${status}) - ${duration}ms`);
};

/**
 * File processing logger
 * @param {string} operation - Operation name
 * @param {string} fileName - File name
 * @param {number} fileSize - File size in bytes
 * @param {number} duration - Processing duration in ms
 */
export const logFileProcessing = (operation, fileName, fileSize, duration) => {
  if (!isDevelopment) return;
  
  const sizeInMB = (fileSize / 1048576).toFixed(2);
  console.log(`📁 ${operation}: ${fileName} (${sizeInMB}MB) - ${duration}ms`);
};

/**
 * Development environment info
 */
export const getDevInfo = () => {
  if (!isDevelopment) return null;
  
  return {
    environment: process.env.NODE_ENV,
    version: process.env.REACT_APP_VERSION || '1.0.0',
    buildTime: process.env.REACT_APP_BUILD_TIME || new Date().toISOString(),
    userAgent: navigator.userAgent,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    memory: performance.memory ? {
      used: `${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      total: `${(performance.memory.totalJSHeapSize / 1048576).toFixed(2)} MB`
    } : 'Not available'
  };
};

/**
 * Initialize development tools
 */
export const initDevTools = () => {
  if (!isDevelopment) return;
  
  // Log development environment info
  console.group('🚀 QuickSideTool Development Environment');
  console.log(getDevInfo());
  console.groupEnd();
  
  // Add global error handler
  window.addEventListener('error', (event) => {
    logError(event.error, 'Global Error Handler');
  });
  
  // Add unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason, 'Unhandled Promise Rejection');
  });
  
  // Log memory usage periodically
  setInterval(logMemoryUsage, 30000); // Every 30 seconds
  
  console.log('🔧 Development tools initialized');
};

// Auto-initialize in development
if (isDevelopment) {
  initDevTools();
} 