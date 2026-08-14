import { useState, useRef, useEffect, useCallback } from "react";

export function useChat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    // Auto-resize textarea as user types
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                Math.min(textareaRef.current.scrollHeight, 150) + "px";
        }
    }, [message]);

    const sendMessage = useCallback(
        async (text) => {
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
                        content:
                            "Network error. Please check your connection and try again.",
                    },
                ]);
            } finally {
                setLoading(false);
                textareaRef.current?.focus();
            }
        },
        [message, messages, loading]
    );

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        },
        [sendMessage]
    );

    const hasMessages = messages.length > 0;

    return {
        message,
        setMessage,
        messages,
        loading,
        hasMessages,
        messagesEndRef,
        textareaRef,
        sendMessage,
        handleKeyDown,
    };
}
