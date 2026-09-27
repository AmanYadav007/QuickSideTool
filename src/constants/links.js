// Chrome Web Store listing for the QuickSideTool side-panel extension.
export const CHROME_EXTENSION_URL =
  "https://chromewebstore.google.com/detail/quick-side-tool/ednlokciemgblchidkhbhhndphgjkoip";

// Public address of the site; canonical URLs and the sitemap use it.
export const SITE_URL = "https://www.ilovetools.website";

// Shown on Contact, Privacy and Terms when set. Left empty until there is a
// real inbox on the new domain - the contact form works without it.
export const SUPPORT_EMAIL = "";

// Google Apps Script web app that receives the Contact and Support forms and
// saves them to a Google Sheet (source and setup: scripts/forms-apps-script.gs).
// Override per deploy with REACT_APP_FORM_ENDPOINT.
export const FORM_ENDPOINT =
  process.env.REACT_APP_FORM_ENDPOINT ||
  "https://script.google.com/macros/s/AKfycby6IncKBU68LN7ZxWkBIEQJV_S_m18G1CSgPi1o4jUZ093FUSHTF-QS87BAOyepP1Vu/exec";

/**
 * Send a form to FORM_ENDPOINT. text/plain avoids a CORS preflight, which
 * Apps Script can't answer. Resolves on success, throws otherwise.
 */
export const sendForm = async (fields) => {
  const response = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(fields),
  });
  const result = await response.json();
  if (result.result !== "success") throw new Error(result.error || "The form service didn't accept the message.");
};
