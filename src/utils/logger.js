/**
 * Professional Logger Utility for QuickSideTool
 * Provides structured logging with environment awareness and error tracking
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

class Logger {
  constructor() {
    this.prefix = '[QuickSideTool]';
    this.errorCount = 0;
    this.warningCount = 0;
  }

  /**
   * Log information messages (development only)
   * @param {string} message - The message to log
   * @param {any} data - Optional data to include
   */
  info(message, data = null) {
    if (isDevelopment) {
      const logMessage = `${this.prefix} ℹ️ ${message}`;
      if (data) {
        console.log(logMessage, data);
      } else {
        console.log(logMessage);
      }
    }
  }

  /**
   * Log success messages (development only)
   * @param {string} message - The message to log
   * @param {any} data - Optional data to include
   */
  success(message, data = null) {
    if (isDevelopment) {
      const logMessage = `${this.prefix} ✅ ${message}`;
      if (data) {
        console.log(logMessage, data);
      } else {
        console.log(logMessage);
      }
    }
  }

  /**
   * Log warning messages (always logged)
   * @param {string} message - The message to log
   * @param {any} data - Optional data to include
   */
  warn(message, data = null) {
    this.warningCount++;
    const logMessage = `${this.prefix} ⚠️ ${message}`;
    
    if (data) {
      console.warn(logMessage, data);
    } else {
      console.warn(logMessage);
    }

    // In production, consider sending to error tracking service
    if (isProduction) {
      this.trackWarning(message, data);
    }
  }

  /**
   * Log error messages (always logged)
   * @param {string} message - The message to log
   * @param {Error|any} error - The error object or data
   * @param {string} context - Optional context for the error
   */
  error(message, error = null, context = null) {
    this.errorCount++;
    const logMessage = `${this.prefix} ❌ ${message}`;
    
    if (context) {
      console.error(`${logMessage} [${context}]`, error);
    } else {
      console.error(logMessage, error);
    }

    // In production, send to error tracking service
    if (isProduction) {
      this.trackError(message, error, context);
    }
  }

  /**
   * Log debug messages (development only)
   * @param {string} message - The message to log
   * @param {any} data - Optional data to include
   */
  debug(message, data = null) {
    if (isDevelopment) {
      const logMessage = `${this.prefix} 🐛 ${message}`;
      if (data) {
        console.debug(logMessage, data);
      } else {
        console.debug(logMessage);
      }
    }
  }

  /**
   * Log performance metrics
   * @param {string} operation - The operation being measured
   * @param {number} duration - Duration in milliseconds
   */
  performance(operation, duration) {
    if (isDevelopment) {
      const logMessage = `${this.prefix} ⏱️ ${operation}: ${duration}ms`;
      console.log(logMessage);
    }
  }

  /**
   * Track errors in production (placeholder for error tracking service)
   * @param {string} message - Error message
   * @param {Error|any} error - Error object
   * @param {string} context - Error context
   */
  trackError(message, error, context = null) {
    // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
    // For now, just log to console in production
    if (isProduction) {
      const errorData = {
        message,
        error: error?.message || error,
        stack: error?.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      // In a real implementation, send this to your error tracking service
      console.error('Error tracked:', errorData);
    }
  }

  /**
   * Track warnings in production
   * @param {string} message - Warning message
   * @param {any} data - Warning data
   */
  trackWarning(message, data = null) {
    // TODO: Integrate with monitoring service
    if (isProduction) {
      const warningData = {
        message,
        data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      console.warn('Warning tracked:', warningData);
    }
  }

  /**
   * Get logging statistics
   * @returns {Object} Statistics about logged messages
   */
  getStats() {
    return {
      errors: this.errorCount,
      warnings: this.warningCount,
      environment: process.env.NODE_ENV
    };
  }

  /**
   * Reset counters
   */
  reset() {
    this.errorCount = 0;
    this.warningCount = 0;
  }
}

// Create singleton instance
const logger = new Logger();

// Export both the class and the instance
export { Logger };
export default logger; 