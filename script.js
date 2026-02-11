const API_KEY = "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";

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
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
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
        chatbox.innerHTML += `<div class="message ai">Error connecting to OpenAI.</div>`;
    }
}

document.getElementById("userInput")
    .addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
});
