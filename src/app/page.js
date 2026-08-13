"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await res.json();

      const aiMessage = {
        role: "assistant",
        content: data.response,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        aiMessage,
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-10">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          My AI Chat
        </h1>

        <div className="space-y-4 mb-8">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${msg.role === "user"
                ? "bg-blue-100"
                : "bg-gray-100"
                }`}
            >
              <strong>
                {msg.role === "user" ? "You" : "AI"}
              </strong>

              <p className="mt-2 whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          ))}

          {loading && (
            <div className="bg-gray-500 text-black p-4 rounded-lg">
              AI is thinking...
            </div>
          )}
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something..."
          className="w-full border rounded-lg p-4 min-h-32"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="mt-4 px-6 py-3 bg-black text-white rounded-lg"
        >
          {loading ? "Thinking..." : "Send"}
        </button>

      </div>
    </main>
  );
}