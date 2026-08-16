"use client";

import { useState } from "react";

function parseSSEChunk(chunk) {
    const events = [];

    const lines = chunk.split("\n");

    for (const line of lines) {
        if (!line.startsWith("data: ")) {
            continue;
        }

        const data = line.slice(6).trim();

        if (!data || data === "[DONE]") {
            continue;
        }

        try {
            events.push(JSON.parse(data));
        } catch (error) {
            console.log("Could not parse SSE data:", data);
        }
    }

    return events;
}

export default function AssistantPage() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    async function sendMessage() {
        if (!input.trim() || loading) return;

        const text = input.trim();

        const userMessage = {
            id: crypto.randomUUID(),
            role: "user",
            text,
        };

        const conversation = [
            ...messages.map((message) => ({
                role: message.role,
                parts: [
                    {
                        type: "text",
                        text: message.text || "",
                    },
                ],
            })),
            {
                role: "user",
                parts: [
                    {
                        type: "text",
                        text,
                    },
                ],
            },
        ];

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        // Create an empty AI message
        const assistantId = crypto.randomUUID();

        setMessages((prev) => [
            ...prev,
            {
                id: assistantId,
                role: "assistant",
                text: "",
                tool: null,
                toolInput: null,
                toolOutput: null,
                toolStatus: null,
            },
        ]);

        try {
            const response = await fetch("/api/assistant", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    messages: conversation,
                }),
            });

            if (!response.ok) {
                throw new Error(
                    `Request failed: ${response.status}`
                );
            }

            if (!response.body) {
                throw new Error("Response body is empty");
            }

            const reader = response.body.getReader();

            const decoder = new TextDecoder();

            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();

                if (done) break;

                buffer += decoder.decode(value, {
                    stream: true,
                });

                /*
                 * SSE events are separated by a blank line.
                 *
                 * Example:
                 *
                 * data: {"type":"text-delta"...}
                 *
                 * data: {"type":"text-delta"...}
                 *
                 */

                const events = buffer.split("\n\n");

                // Keep the incomplete event for the next chunk
                buffer = events.pop() || "";

                for (const rawEvent of events) {
                    const parsedEvents =
                        parseSSEChunk(rawEvent);

                    for (const event of parsedEvents) {
                        console.log("EVENT:", event);

                        handleEvent(
                            event,
                            assistantId
                        );
                    }
                }
            }

            // Process anything left in the buffer
            if (buffer.trim()) {
                const parsedEvents =
                    parseSSEChunk(buffer);

                for (const event of parsedEvents) {
                    handleEvent(
                        event,
                        assistantId
                    );
                }
            }
        } catch (error) {
            console.error(error);

            setMessages((prev) =>
                prev.map((message) =>
                    message.id === assistantId
                        ? {
                            ...message,
                            text:
                                "Sorry, something went wrong.",
                            toolStatus: "error",
                        }
                        : message
                )
            );
        } finally {
            setLoading(false);
        }
    }

    function handleEvent(event, assistantId) {
        switch (event.type) {
            /*
             * TOOL START
             */
            case "tool-input-start":
                setMessages((prev) =>
                    prev.map((message) =>
                        message.id === assistantId
                            ? {
                                ...message,
                                tool: event.toolName,
                                toolStatus: "running",
                            }
                            : message
                    )
                );

                break;

            /*
             * TOOL INPUT
             */
            case "tool-input-available":
                setMessages((prev) =>
                    prev.map((message) =>
                        message.id === assistantId
                            ? {
                                ...message,
                                tool: event.toolName,
                                toolInput: event.input,
                                toolStatus: "running",
                            }
                            : message
                    )
                );

                break;

            /*
             * TOOL RESULT
             */
            case "tool-output-available":
                setMessages((prev) =>
                    prev.map((message) =>
                        message.id === assistantId
                            ? {
                                ...message,
                                toolOutput: event.output,
                                toolStatus: "completed",
                            }
                            : message
                    )
                );

                break;

            /*
             * AI TEXT STREAM
             */
            case "text-delta":
                setMessages((prev) =>
                    prev.map((message) =>
                        message.id === assistantId
                            ? {
                                ...message,
                                text:
                                    message.text +
                                    (event.delta || ""),
                            }
                            : message
                    )
                );

                break;

            /*
             * COMPLETE
             */
            case "finish":
                setMessages((prev) =>
                    prev.map((message) =>
                        message.id === assistantId
                            ? {
                                ...message,
                                toolStatus:
                                    message.tool
                                        ? "completed"
                                        : null,
                            }
                            : message
                    )
                );

                break;

            default:
                break;
        }
    }

    function renderToolResult(output) {
        if (!output) return null;

        return (
            <div className="mt-3 rounded-lg bg-gray-50 border p-4">
                <div className="text-sm font-semibold mb-2">
                    Weather Result
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-gray-500">
                            City:
                        </span>{" "}
                        {output.city}
                    </div>

                    <div>
                        <span className="text-gray-500">
                            Country:
                        </span>{" "}
                        {output.country}
                    </div>

                    <div>
                        <span className="text-gray-500">
                            Temperature:
                        </span>{" "}
                        {output.temperature}°C
                    </div>

                    <div>
                        <span className="text-gray-500">
                            Feels like:
                        </span>{" "}
                        {output.apparentTemperature}°C
                    </div>

                    <div>
                        <span className="text-gray-500">
                            Humidity:
                        </span>{" "}
                        {output.humidity}%
                    </div>

                    <div>
                        <span className="text-gray-500">
                            Wind:
                        </span>{" "}
                        {output.windSpeed} km/h
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-3xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        AI Assistant
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Gemini + Vercel AI SDK
                    </p>
                </div>

                {/* CHAT */}

                <div className="space-y-5 mb-8">

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={
                                message.role === "user"
                                    ? "flex justify-end"
                                    : "flex justify-start"
                            }
                        >
                            <div
                                className={
                                    message.role === "user"
                                        ? "max-w-[80%] bg-black text-white rounded-2xl px-5 py-4"
                                        : "max-w-[90%] bg-white border rounded-2xl px-5 py-4 shadow-sm"
                                }
                            >

                                {/* NAME */}

                                <div className="text-xs font-semibold mb-2 opacity-60">
                                    {message.role === "user"
                                        ? "YOU"
                                        : "AI"}
                                </div>

                                {/* TOOL */}

                                {message.role ===
                                    "assistant" &&
                                    message.tool && (
                                        <div className="mb-4 rounded-xl border bg-gray-50 p-4">

                                            <div className="flex items-center gap-2">

                                                <span>
                                                    🔧
                                                </span>

                                                <span className="font-semibold">
                                                    {message.tool}
                                                </span>

                                                {message.toolStatus ===
                                                    "running" && (
                                                        <span className="text-sm text-gray-500">
                                                            ⏳ Running...
                                                        </span>
                                                    )}

                                                {message.toolStatus ===
                                                    "completed" && (
                                                        <span className="text-sm text-green-600">
                                                            ✓ Completed
                                                        </span>
                                                    )}

                                            </div>

                                            {/* TOOL INPUT */}

                                            {message.toolInput && (
                                                <pre className="mt-3 text-xs bg-white border rounded-lg p-3 overflow-auto">
                                                    {JSON.stringify(
                                                        message.toolInput,
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                            )}

                                            {/* TOOL OUTPUT */}

                                            {renderToolResult(
                                                message.toolOutput
                                            )}

                                        </div>
                                    )}

                                {/* AI TEXT */}

                                {message.text && (
                                    <div className="whitespace-pre-wrap leading-7">
                                        {message.text}
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}

                </div>

                {/* INPUT */}

                <div className="bg-white border rounded-2xl p-4 shadow-sm">

                    <textarea
                        value={input}
                        onChange={(event) =>
                            setInput(event.target.value)
                        }
                        onKeyDown={(event) => {
                            if (
                                event.key === "Enter" &&
                                !event.shiftKey
                            ) {
                                event.preventDefault();

                                sendMessage();
                            }
                        }}
                        placeholder="Ask something..."
                        disabled={loading}
                        className="w-full min-h-28 resize-none outline-none"
                    />

                    <div className="flex justify-between items-center mt-3">

                        <span className="text-xs text-gray-400">
                            Enter to send · Shift + Enter for new line
                        </span>

                        <button
                            onClick={sendMessage}
                            disabled={
                                loading ||
                                !input.trim()
                            }
                            className="px-6 py-3 rounded-xl bg-black text-white disabled:opacity-40"
                        >
                            {loading
                                ? "Thinking..."
                                : "Send"}
                        </button>

                    </div>

                </div>

            </div>
        </main>
    );
}