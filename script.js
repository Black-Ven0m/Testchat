const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
const API_TOKEN = "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";

let conversationHistory = [];

async function sendMessage() {
    const inputField = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");

    const userMessage = inputField.value.trim();
    if (!userMessage) return;

    chatbox.innerHTML += `<div class="message user">${userMessage}</div>`;
    inputField.value = "";
    chatbox.scrollTop = chatbox.scrollHeight;

    chatbox.innerHTML += `<div class="message ai" id="typing">AI is typing...</div>`;
    chatbox.scrollTop = chatbox.scrollHeight;

    conversationHistory.push({ role: "user", content: userMessage });

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: conversationHistory.map(m => m.content).join("\n")
            })
        });

        const data = await response.json();
        let aiReply = data[0]?.generated_text || "Model loading...";

        document.getElementById("typing").remove();

        chatbox.innerHTML += `<div class="message ai">${aiReply}</div>`;
        chatbox.scrollTop = chatbox.scrollHeight;

        conversationHistory.push({ role: "assistant", content: aiReply });

    } catch (error) {
        document.getElementById("typing").remove();
        chatbox.innerHTML += `<div class="message ai">Connection error.</div>`;
    }
}

document.getElementById("userInput")
    .addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
});
