export default function ChatInput({
    message,
    setMessage,
    loading,
    textareaRef,
    onKeyDown,
    onSend,
}) {
    return (
        <div className="chat-input-area">
            <div className="chat-input-container">
                <div className="chat-input-box">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Message AI..."
                        rows={1}
                        id="chat-input"
                    />
                    <button
                        onClick={onSend}
                        disabled={loading || !message.trim()}
                        className="chat-send-btn"
                        id="send-button"
                        aria-label="Send message"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
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
    );
}
