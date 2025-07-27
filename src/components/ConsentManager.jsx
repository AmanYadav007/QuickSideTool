import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Settings, X, Check, AlertTriangle } from 'lucide-react';
import { 
  initializeConsent, 
  saveConsent, 
  isEuropeanUser, 
  revokeConsent 
} from '../utils/consent';

const ConsentManager = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    // Initialize consent state
    const initialPreferences = initializeConsent();
    setPreferences(initialPreferences);
    
    // Check if user is in EEA, UK, or Switzerland
    const europeanUser = isEuropeanUser();
    
    // Check if consent was already given
    const existingConsent = localStorage.getItem('quickSideTool_consent');
    
    if (europeanUser && !existingConsent) {
      setShowConsent(true);
    } else if (existingConsent) {
      setConsentGiven(true);
    }
  }, []);



  const handleConsent = (type) => {
    let newPreferences;
    
    if (type === 'accept_all') {
      newPreferences = {
        necessary: true,
        analytics: true,
        marketing: true,
        preferences: true
      };
    } else if (type === 'accept_necessary') {
      newPreferences = {
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false
      };
    } else {
      newPreferences = preferences;
    }

    setPreferences(newPreferences);
    setConsentGiven(true);
    setShowConsent(false);
    setShowSettings(false);

    // Save consent using utility function
    saveConsent(newPreferences);
  };

  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSavePreferences = () => {
    setConsentGiven(true);
    setShowSettings(false);
    
    // Save consent using utility function
    saveConsent(preferences);
  };

  const handleRevokeConsent = () => {
    const defaultPreferences = revokeConsent();
    setConsentGiven(false);
    setShowConsent(true);
    setPreferences(defaultPreferences);
  };

  if (!showConsent && !showSettings) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          id="cookie-settings"
          onClick={() => setShowSettings(true)}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
          title="Cookie Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {(showConsent || showSettings) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Shield size={24} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {showSettings ? 'Cookie Settings' : 'Privacy & Cookies'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {showSettings ? 'Manage your preferences' : 'We value your privacy'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowConsent(false);
                  setShowSettings(false);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {showConsent && (
                <>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-200 font-medium mb-1">
                          European Privacy Notice
                        </p>
                        <p className="text-xs text-blue-300">
                          We use cookies to enhance your experience and show personalized ads. 
                          By continuing, you consent to our use of cookies.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300">
                    QuickSideTool uses cookies to provide you with the best experience. 
                    We respect your privacy and give you control over your data.
                  </p>
                </>
              )}

              {showSettings && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-white">Necessary Cookies</p>
                      <p className="text-xs text-gray-400">Required for the website to function</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.necessary}
                        disabled
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-white">Analytics Cookies</p>
                      <p className="text-xs text-gray-400">Help us understand how you use our site</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={() => handlePreferenceChange('analytics')}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-white">Marketing Cookies</p>
                      <p className="text-xs text-gray-400">Used to show relevant ads</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={() => handlePreferenceChange('marketing')}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-white">Preference Cookies</p>
                      <p className="text-xs text-gray-400">Remember your settings and preferences</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.preferences}
                        onChange={() => handlePreferenceChange('preferences')}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-4">
                {showConsent ? (
                  <>
                    <button
                      onClick={() => handleConsent('accept_all')}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Check size={16} />
                      Accept All Cookies
                    </button>
                    <button
                      onClick={() => handleConsent('accept_necessary')}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
                    >
                      Necessary Only
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="w-full bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
                    >
                      Customize Settings
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSavePreferences}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
                    >
                      Save Preferences
                    </button>
                    <button
                      onClick={handleRevokeConsent}
                      className="w-full bg-transparent border border-red-500/50 hover:border-red-500 text-red-400 hover:text-red-300 font-medium py-3 px-4 rounded-lg transition-all duration-300"
                    >
                      Revoke All Consent
                    </button>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-700">
                <p>
                  By using our site, you agree to our{' '}
                  <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="/terms" className="text-blue-400 hover:text-blue-300 underline">
                    Terms of Service
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsentManager; 