import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * React Router keeps the window scroll position across route changes, so
 * opening a tool from halfway down the home page dropped you into the middle
 * of the tool page.
 *
 * Jump to the top on forward navigation. POP (back/forward) is left alone so
 * the browser can restore where you were on the page you are returning to.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "POP") return;

    // html carries scroll-behavior: smooth, which would animate a long scroll
    // up from wherever you were. Force this particular jump to be instant.
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    try {
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView();
          return;
        }
      }
      window.scrollTo(0, 0);
    } catch {
      // A malformed hash makes querySelector throw; top of page is still right.
      window.scrollTo(0, 0);
    } finally {
      root.style.scrollBehavior = previous;
    }
  }, [pathname, hash, navigationType]);

  return null;
};

export default ScrollToTop;
