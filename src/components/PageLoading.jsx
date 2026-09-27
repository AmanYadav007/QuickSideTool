import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

/**
 * Shown while a page's code downloads. Stays blank for the first moment so
 * fast loads (and prefetched pages) don't flash a spinner.
 */
const PageLoading = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 250);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]"
      aria-busy="true"
    >
      {visible && (
        <Loader2
          className="h-8 w-8 animate-spin text-[var(--color-primary)]"
          aria-label="Loading"
        />
      )}
    </div>
  );
};

export default PageLoading;
