"use client";

import { useChat } from "@/hooks/useChat";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";

export default function Home() {
  const {
    message,
    setMessage,
    messages,
    loading,
    hasMessages,
    messagesEndRef,
    textareaRef,
    sendMessage,
    handleKeyDown,
  } = useChat();

  return (
    <div className="chat-app">
      <ChatHeader />

      <ChatMessages
        messages={messages}
        loading={loading}
        hasMessages={hasMessages}
        messagesEndRef={messagesEndRef}
        onSuggestionClick={sendMessage}
      />

      <ChatInput
        message={message}
        setMessage={setMessage}
        loading={loading}
        textareaRef={textareaRef}
        onKeyDown={handleKeyDown}
        onSend={() => sendMessage()}
      />
    </div>
  );
}