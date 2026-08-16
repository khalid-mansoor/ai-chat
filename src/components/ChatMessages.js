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

            {/* Concept Notice */}
            <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 text-[#ececec] relative overflow-hidden group w-full max-w-2xl mb-8 text-left mx-auto">
                <div className="absolute top-0 right-[-10%] w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none transition-all group-hover:bg-blue-500/20" />
                <div className="flex items-center gap-3 mb-3 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                    </div>
                    <h3 className="font-bold text-lg text-white">How it works: Conversational Streaming</h3>
                </div>
                <ul className="text-sm text-[#9b9b9b] space-y-2.5 list-disc pl-11 marker:text-blue-500/50 relative z-10">
                    <li><strong>API Tool:</strong> Utilizes <code className="text-blue-300 bg-blue-900/40 border border-blue-500/20 px-1.5 py-0.5 rounded font-mono text-[13px]">streamText</code> from the Vercel AI SDK.</li>
                    <li><strong>Methodology:</strong> Provides a natural chat interface. The backend establishes a persistent stream and pipes chunks of the AI&apos;s thoughts down as quickly as it generates them.</li>
                    <li><strong>Benefit:</strong> Essential for standard chatbots, providing the lowest latency possible.</li>
                </ul>
            </div>

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
