import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// Brand stand-in for Axiforma: Regular, Medium and Semi Bold only
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "./index.css";
import { inExtension } from "./utils/appContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
// Inside the extension's side panel: tell it the app is running, so it can
// tell a real page from Chrome's offline error page (extension/sidepanel.js)
if (inExtension && window.parent !== window) {
  window.parent.postMessage({ type: "quick-side-tool:ready" }, "*");
}

// Offline cache (src/service-worker.js), production only. Also works in the
// extension's side panel, which shows this site in a frame.
if (
  process.env.NODE_ENV === "production" &&
  "serviceWorker" in navigator &&
  /^https?:$/.test(window.location.protocol)
) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${process.env.PUBLIC_URL}/service-worker.js`)
      .catch(() => {});
  });
}
