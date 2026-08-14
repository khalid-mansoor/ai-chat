import ReactMarkdown from "react-markdown";

const SUGGESTIONS = [
    "Explain quantum computing in simple terms",
    "Write a creative short story about AI",
    "What are the best practices for React?",
    "Help me debug a JavaScript error",
];

function MessageBubble({ msg }) {
    return (
        <div className={`message-row ${msg.role}`}>
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
    );
}

function TypingIndicator() {
    return (
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
    );
}

function EmptyState({ onSuggestionClick }) {
    return (
        <div className="chat-empty">
            <div className="chat-empty-logo">✦</div>
            <h1 className="chat-empty-title">How can I help you today?</h1>
            <p className="chat-empty-sub">
                I&apos;m powered by Google Gemini. Ask me anything — from coding help to
                creative writing.
            </p>
            <div className="chat-suggestions">
                {SUGGESTIONS.map((s, i) => (
                    <button
                        key={i}
                        className="chat-suggestion-btn"
                        onClick={() => onSuggestionClick(s)}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function ChatMessages({
    messages,
    loading,
    hasMessages,
    messagesEndRef,
    onSuggestionClick,
}) {
    if (!hasMessages) {
        return <EmptyState onSuggestionClick={onSuggestionClick} />;
    }

    return (
        <div className="chat-messages">
            <div className="chat-messages-inner">
                {messages.map((msg, index) => (
                    <MessageBubble key={index} msg={msg} />
                ))}

                {loading && <TypingIndicator />}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
