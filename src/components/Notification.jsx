import React, { useEffect, useRef } from 'react';

const Notification = ({ message, type, onClose }) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (message) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        onClose();
      }, 5000); // Notification disappears after 5 seconds
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, onClose]);

  if (!message) return null;

  let bgColor = 'bg-blue-500';
  let icon = 'ℹ️'; // Info icon

  switch (type) {
    case 'success':
      bgColor = 'bg-green-500';
      icon = '✅';
      break;
    case 'error':
      bgColor = 'bg-red-600';
      icon = '❌';
      break;
    case 'info':
    default:
      bgColor = 'bg-blue-500';
      icon = 'ℹ️';
      break;
  }

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg text-white text-center flex items-center space-x-3 z-50 transition-all duration-300 transform ${bgColor} animate-fade-in-up`}
      role="alert"
    >
      <span className="text-xl">{icon}</span>
      <span className="font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/80 hover:text-white transition-colors">
        &times;
      </button>
    </div>
  );
};

export default Notification;