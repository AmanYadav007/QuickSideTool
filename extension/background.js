// Clicking the toolbar icon opens the side panel. Set on install/update and
// on every browser start, so it holds even if Chrome resets extension state.
const openPanelOnClick = () =>
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});

chrome.runtime.onInstalled.addListener(openPanelOnClick);
chrome.runtime.onStartup.addListener(openPanelOnClick);
