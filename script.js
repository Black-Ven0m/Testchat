const BACKEND_URL = "https://vnm-ai-backend.vercel.app/api/chat";

let conversation = [
    { role: "system", content: "You are a powerful AI assistant." }
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
    chatbox.scrollTop = chatbox.scrollHeight;

    conversation.push({ role: "user", content: userMessage });

    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: conversation
            })
        });

        const data = await response.json();
        const aiReply = data.choices[0].message.content;

        document.getElementById("typing").remove();

        chatbox.innerHTML += `<div class="message ai">${aiReply}</div>`;
        chatbox.scrollTop = chatbox.scrollHeight;

        conversation.push({ role: "assistant", content: aiReply });

    } catch (error) {
        document.getElementById("typing").remove();
        chatbox.innerHTML += `<div class="message ai">Server connection failed.</div>`;
    }
}

document.getElementById("userInput")
    .addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
});
