"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const SUGGESTIONS = [
  "Explain quantum computing in simple terms",
  "Write a creative short story about AI",
  "What are the best practices for React?",
  "Help me debug a JavaScript error",
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [message]);

  async function sendMessage(text) {
    const msg = text || message;
    if (!msg.trim() || loading) return;

    const userMessage = { role: "user", content: msg.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setMessage("");
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `${errorData?.error || "Something went wrong."}`,
          },
        ]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiResponse += chunk;

        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content: aiResponse,
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Network error. Please check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="chat-app">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-header-inner">
          <div className="chat-header-logo">✦</div>
          <span className="chat-header-title">AI Chat</span>
          <span className="chat-header-badge">Gemini</span>
        </div>
      </header>

      {/* Messages or Empty State */}
      {!hasMessages ? (
        <div className="chat-empty">
          <div className="chat-empty-logo">✦</div>
          <h1 className="chat-empty-title">How can I help you today?</h1>
          <p className="chat-empty-sub">
            I'm powered by Google Gemini. Ask me anything — from coding help to
            creative writing.
          </p>
          <div className="chat-suggestions">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                className="chat-suggestion-btn"
                onClick={() => sendMessage(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="chat-messages">
          <div className="chat-messages-inner">
            {messages.map((msg, index) => (
              <div key={index} className={`message-row ${msg.role}`}>
                <div className={`message-avatar ${msg.role === "user" ? "user" : "ai"}`}>
                  {msg.role === "user" ? "U" : "✦"}
                </div>
                <div className="message-content">
                  <div className="message-label">
                    {msg.role === "user" ? "You" : "AI"}
                  </div>
                  <div className="message-bubble">
                    {msg.role === "assistant" ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="typing-indicator">
                <div className="message-avatar ai">✦</div>
                <div className="message-content">
                  <div className="message-label">AI</div>
                  <div className="typing-dots">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="chat-input-area">
        <div className="chat-input-container">
          <div className="chat-input-box">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message AI..."
              rows={1}
              id="chat-input"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !message.trim()}
              className="chat-send-btn"
              id="send-button"
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="chat-footer-text">
            AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}