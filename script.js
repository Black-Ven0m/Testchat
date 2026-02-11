const API_KEY = "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";

let conversation = [
    { role: "system", content: "You are a helpful AI assistant." }
];

async function sendMessage() {
    const inputField = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");

    const userMessage = inputField.value.trim();
    if (!userMessage) return;

    chatbox.innerHTML += `<div class="message user">${userMessage}</div>`;
    inputField.value = "";
    chatbox.scrollTop = chatbox.scrollHeight;

    chatbox.innerHTML += `<div class="message ai" id="typing">AI is typing...</div>`;

    conversation.push({ role: "user", content: userMessage });

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
                "HTTP-Referer": "https://black-ven0m.github.io",
                "X-Title": "VNM AI"
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct",
                messages: conversation
            })
        });

        const data = await response.json();
        const aiReply = data.choices?.[0]?.message?.content || "No response.";

        document.getElementById("typing").remove();

        chatbox.innerHTML += `<div class="message ai">${aiReply}</div>`;
        chatbox.scrollTop = chatbox.scrollHeight;

        conversation.push({ role: "assistant", content: aiReply });

    } catch (error) {
        document.getElementById("typing").remove();
        chatbox.innerHTML += `<div class="message ai">Connection failed.</div>`;
    }
}

document.getElementById("userInput")
.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
