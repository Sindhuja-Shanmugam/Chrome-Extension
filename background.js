// background.js
chrome.runtime.onInstalled.addListener(() => {
    console.log("ChatBloom is ready to analyze your mood! 🎉");
});

// Detect user activity and determine mood based on website categories
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        const mood = analyzeUserMood(tab.url) || "neutral";
        chrome.storage.local.set({ mood });
        console.log(`Mood detected: ${mood}`);
    }
});

// Simple mood analyzer based on visited URL categories
function analyzeUserMood(url) {
    if (url.includes("news") || url.includes("finance")) return "serious";
    if (url.includes("youtube") || url.includes("entertainment")) return "happy";
    if (url.includes("shopping") || url.includes("ecommerce")) return "curious";
    if (url.includes("study") || url.includes("research")) return "focused";
    return "neutral"; // Default mood
}
