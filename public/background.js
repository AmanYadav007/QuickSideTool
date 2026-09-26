// Extension service worker (Manifest V3). There is no `window` here.

// One click on the toolbar icon opens the tools in the side panel.
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(() => {});

chrome.runtime.onInstalled.addListener(({ reason }) => {
  chrome.storage.local.set({
    installed: true,
    version: chrome.runtime.getManifest().version,
    ...(reason === "install" && { installDate: new Date().toISOString() }),
  });
});
