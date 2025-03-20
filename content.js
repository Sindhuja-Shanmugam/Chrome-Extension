chrome.storage.local.get("mood", ({ mood }) => {
    injectChatBox(mood);
});

function injectChatBox(mood) {
    const chatBox = document.createElement("div");
    chatBox.id = "chatBloomChatbox";
    chatBox.innerText = `🌟 ChatBloom: Hey! Feeling ${mood}? Let's chat!`;
    chatBox.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        cursor: pointer;
    `;
    document.body.appendChild(chatBox);

    chatBox.addEventListener("click", () => {
        // Show or activate the chatbot interface
        const chatbotInterface = document.getElementById("chatBloomInterface");
        if (chatbotInterface) {
            chatbotInterface.style.display = "block"; // Make the chatbot visible
        } else {
            console.error("ChatBloom interface not found!");
        }
    });
}