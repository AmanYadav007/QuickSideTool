import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Brand stand-in for Axiforma: Regular, Medium and Semi Bold only
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// Offline cache (src/service-worker.js): production website only. The
// extension serves its files locally and can't register one.
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
