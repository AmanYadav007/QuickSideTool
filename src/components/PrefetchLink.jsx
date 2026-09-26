import React from "react";
import { Link } from "react-router-dom";
import { prefetchPath } from "../pageLoaders";

/**
 * Drop-in for react-router's Link that starts downloading the target page's
 * code on hover, focus or touch, so it's usually ready by the time of the click.
 */
const PrefetchLink = React.forwardRef(
  ({ to, onMouseEnter, onFocus, onTouchStart, ...props }, ref) => {
    const prefetch = () => prefetchPath(to);
    return (
      <Link
        ref={ref}
        to={to}
        onMouseEnter={(event) => {
          prefetch();
          onMouseEnter?.(event);
        }}
        onFocus={(event) => {
          prefetch();
          onFocus?.(event);
        }}
        onTouchStart={(event) => {
          prefetch();
          onTouchStart?.(event);
        }}
        {...props}
      />
    );
  },
);

export default PrefetchLink;
