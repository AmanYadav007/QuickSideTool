import React, { useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const VARIANTS = {
  success: { Icon: CheckCircle2, color: 'var(--color-success)' },
  error: { Icon: AlertCircle, color: 'var(--color-error)' },
  info: { Icon: Info, color: 'var(--color-primary)' },
};

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

  const { Icon, color } = VARIANTS[type] || VARIANTS.info;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] py-3 pl-4 pr-3 shadow-2xl animate-fade-in-up"
      role="alert"
    >
      <Icon className="h-5 w-5 shrink-0" style={{ color }} aria-hidden="true" />
      <span className="text-sm font-medium text-[var(--color-text)]">{message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        className="rounded-md p-1 text-[var(--color-text-light)] transition-colors hover:bg-[var(--color-border)] hover:text-[var(--color-text)]"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Notification;
