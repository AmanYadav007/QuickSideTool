// True when the site is open inside the Chrome extension's side panel.
// extension/sidepanel.js loads it with ?source=extension; the flag is kept
// for the rest of the visit, and the parameter removed from the address bar.
const KEY = "in-extension";

export const inExtension = (() => {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("source") === "extension";
  if (fromUrl) {
    params.delete("source");
    const query = params.toString();
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    );
  }
  try {
    if (fromUrl) sessionStorage.setItem(KEY, "1");
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return fromUrl; // storage blocked: still right for this page
  }
})();
