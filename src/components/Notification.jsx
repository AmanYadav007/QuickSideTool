import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Notification = ({ message, type, duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Determine styling based on type
  let bgColor = 'bg-gray-800';
  let textColor = 'text-white';
  let icon = <Info className="w-5 h-5" />;

  switch (type) {
    case 'success':
      bgColor = 'bg-green-600';
      icon = <CheckCircle className="w-5 h-5" />;
      break;
    case 'error':
      bgColor = 'bg-red-600';
      icon = <XCircle className="w-5 h-5" />;
      break;
    case 'info':
      bgColor = 'bg-blue-600';
      icon = <Info className="w-5 h-5" />;
      break;
    default:
      // Default to info or a neutral style
      break;
  }

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose(); // Call onClose to clear message from parent state
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, duration, onClose]);

  if (!isVisible || !message) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl text-sm font-semibold flex items-center space-x-3 z-[60]
                  transition-all duration-300 ease-out transform
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}
                  ${bgColor} ${textColor}
                  `}
      role="alert"
    >
      {icon}
      <span>{message}</span>
      <button onClick={() => { setIsVisible(false); onClose(); }} className="ml-3 p-1 rounded-full hover:bg-white/20 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Notification;