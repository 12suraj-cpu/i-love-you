const API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const speakBtn = document.getElementById("speakBtn");
const chatBox = document.getElementById("chatBox");
const status = document.getElementById("status");

// 💬 Add message to chat
function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 🗣️ Speak with speech synthesis
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}

// 🎧 Start voice recognition
function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();
  status.innerText = "Listening...";

  recognition.onresult = (e) => {
    const command = e.results[0][0].transcript;
    addMessage("user", command);
    processCommand(command);
  };

  recognition.onend = () => {
    status.innerText = "Click the button to speak again.";
  };

  recognition.onerror = (e) => {
    status.innerText = "Error: " + e.error;
  };
}

// 🧠 Check for smart command, otherwise ask AI
function processCommand(command) {
  command = command.toLowerCase();

  // 🔗 Open website command
  if (command.includes("open")) {
    const site = command.replace("open", "").trim();
    speak(`Opening ${site}`);
    addMessage("ai", `Opening ${site}`);
    window.open(`https://${site}.com`, "_blank");
    return;
  }

  // ⏰ Tell time
  if (command.includes("time")) {
    const now = new Date().toLocaleTimeString();
    speak(`It's ${now}`);
    addMessage("ai", `It's ${now}`);
    return;
  }

  // 💡 Fallback to AI
  askDeepSeek(command);
}

// 🤖 Get response from DeepSeek API
async function askDeepSeek(prompt) {
  status.innerText = "Thinking...";
  const payload = {
    model: "deepseek-chat",
    messages: [{ role: "user", content: prompt }],
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    const reply = data.choices[0].message.content;
    speak(reply);
    addMessage("ai", reply);
  } catch (err) {
    console.error("API error:", err);
    addMessage("ai", "Error contacting the AI.");
    speak("Sorry, I couldn't connect to my brain.");
  } finally {
    status.innerText = "Ready.";
  }
}

// 🎤 Trigger microphone
speakBtn.onclick = startListening;
async function askDeepSeek(prompt) {
  status.innerText = "Thinking...";
  const payload = {
    model: "deepseek-chat",
    messages: [{ role: "user", content: prompt }],
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    console.log("API response status:", res.status);
    const data = await res.json();
    console.log("API full response:", data);

    if (!res.ok) {
      throw new Error(data?.message || res.statusText);
    }

    const reply = data.choices[0].message.content;
    speak(reply);
    addMessage("ai", reply);
  } catch (err) {
    console.error("API error:", err.message);
    addMessage("ai", "Error contacting the AI.");
    speak("Sorry, I couldn't connect to my brain.");
  } finally {
    status.innerText = "Ready.";
  }
}
