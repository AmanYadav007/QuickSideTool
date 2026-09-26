import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * Small "Back" pill for the top-left of every tool page.
 *
 * Goes back in history when the user came from somewhere in the app, so the
 * home page reopens where they left it. When the tool was the first page
 * loaded (a search result, a bookmark), there is nothing to go back to, so it
 * links to the home page instead.
 */
const BackButton = () => {
  const navigate = useNavigate();
  // React Router gives the first page loaded the key "default"
  const hasAppHistory = useLocation().key !== "default";

  const handleClick = (event) => {
    if (!hasAppHistory) return;
    event.preventDefault();
    navigate(-1);
  };

  return (
    <Link
      to="/home"
      onClick={handleClick}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Back
    </Link>
  );
};

export default BackButton;
