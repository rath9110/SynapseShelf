/**
 * Background Service Worker
 * Enables the side panel to open when clicking the extension icon
 */

// Enable side panel to open on action click
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error('Error setting panel behavior:', error));

// Optional: Listen for extension icon clicks to manually open side panel
chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ windowId: tab.windowId });
});
