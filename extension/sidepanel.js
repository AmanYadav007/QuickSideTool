// The side panel shows the website in a frame, so tool changes reach
// extension users as soon as the site deploys - no store review needed.
// This file only handles the loading, slow and offline states.
//
// source=extension tells the site it's in the side panel (it hides its own
// "Add to Chrome" buttons, for example).
const APP_URL = "https://www.ilovetools.website/?source=extension";
const APP_ORIGIN = new URL(APP_URL).origin;
const SLOW_AFTER_MS = 15000;

const frame = document.getElementById("app");
const status = document.getElementById("status");
const statusText = document.getElementById("status-text");
const spinner = document.getElementById("spinner");
const retry = document.getElementById("retry");

let loaded = false;
let slowTimer;

const showStatus = (text, { busy = false, canRetry = false } = {}) => {
  statusText.textContent = text;
  spinner.hidden = !busy;
  retry.hidden = !canRetry;
  status.hidden = false;
};

const load = () => {
  loaded = false;
  clearTimeout(slowTimer);
  // Offline, the site's own offline cache can still open the tools used
  // before, so try anyway and explain while it loads
  showStatus(
    navigator.onLine
      ? "Loading your tools..."
      : "You're offline. Tools you've used before will still open.",
    { busy: true }
  );
  slowTimer = setTimeout(() => {
    if (!loaded) {
      showStatus("This is taking longer than usual. Check your connection.", { canRetry: true });
    }
  }, SLOW_AFTER_MS);
  frame.src = APP_URL;
};

const showApp = () => {
  loaded = true;
  clearTimeout(slowTimer);
  status.hidden = true;
};

// The site posts this once it's running (src/index.js). Offline, it's the
// only reliable sign: the frame also "loads" Chrome's no-internet page.
window.addEventListener("message", (event) => {
  if (event.origin === APP_ORIGIN && event.data?.type === "quick-side-tool:ready") showApp();
});

frame.addEventListener("load", () => {
  if (!frame.src || loaded) return;
  if (navigator.onLine) {
    showApp();
  } else {
    // Give a cached copy of the site a moment to say it's ready
    setTimeout(() => {
      if (!loaded) {
        clearTimeout(slowTimer);
        showStatus("You're offline. Connect to the internet to open your tools.", { canRetry: true });
      }
    }, 3000);
  }
});

retry.addEventListener("click", load);

// Came back online while stuck on the loading or slow message: try again
window.addEventListener("online", () => {
  if (!loaded) load();
});

load();
