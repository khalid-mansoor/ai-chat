"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';

export default function WeatherStreamPage() {
    const [message, setMessage] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const resultEndRef = useRef(null);

    // Auto scroll down as result streams
    useEffect(() => {
        if (resultEndRef.current) {
            resultEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [result]);

    async function getWeatherStream() {
        if (!message.trim()) return;

        setLoading(true);
        setResult("");

        try {
            const response = await fetch(
                "/api/weather-stream",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message,
                    }),
                }
            );

            if (!response.body) {
                throw new Error("No response body");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulated = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                accumulated += chunk;
                setResult(accumulated);
            }

        } catch (error) {
            console.error(error);
            setResult("*An error occurred while streaming the response.*");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#ececec] font-sans selection:bg-[#22d3ee]/30 overflow-x-hidden">
            {/* Header */}
            <header className="sticky top-0 z-20 px-6 py-4 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 shadow-sm">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <nav className="flex items-center gap-1.5 md:gap-3">
                        <Link
                            href="/"
                            className="group flex items-center gap-2 text-[#9b9b9b] text-xs md:text-sm font-medium hover:text-white transition-colors"
                        >
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                </svg>
                            </div>
                            <span className="hidden md:inline">Chat</span>
                        </Link>
                        <Link
                            href="/weather"
                            className="group flex items-center gap-2 text-[#9b9b9b] text-xs md:text-sm font-medium hover:text-[#60a5fa] transition-colors"
                        >
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#3b82f6]/20 transition-colors">
                                🌤️
                            </div>
                            <span className="hidden md:inline">Weather</span>
                        </Link>
                        <Link
                            href="/weather-stream"
                            className="group flex items-center gap-2 text-[#9b9b9b] text-xs md:text-sm font-medium hover:text-[#22d3ee] transition-colors"
                        >
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#06b6d4]/20 transition-colors text-[#22d3ee]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-pulse"></span>
                            </div>
                            <span className="hidden md:inline">W-Stream</span>
                        </Link>
                        <Link
                            href="/structured-stream"
                            className="group flex items-center gap-2 text-[#9b9b9b] text-xs md:text-sm font-medium hover:text-[#c084fc] transition-colors"
                        >
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#a855f7]/20 transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-pulse"></span>
                            </div>
                            <span className="hidden md:inline">Stream</span>
                        </Link>
                        <Link
                            href="/structured"
                            className="group flex items-center gap-2 text-[#9b9b9b] text-xs md:text-sm font-medium hover:text-[#fbbf24] transition-colors"
                        >
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#f59e0b]/20 transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                            </div>
                            <span className="hidden md:inline">Analyzer</span>
                        </Link>
                    </nav>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#06b6d4] blur-md opacity-30 rounded-full animate-pulse"></div>
                            <div className="relative w-8 h-8 bg-gradient-to-tr from-[#0ea5e9] to-[#2dd4bf] rounded-full flex items-center justify-center text-sm shadow-[0_4px_12px_rgba(0,0,0,0.4)] border border-white/10">
                                🌦️
                            </div>
                        </div>
                        <span className="text-base font-bold tracking-tight text-white/90">Weather Stream</span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#2dd4bf] bg-[#2dd4bf]/10 border border-[#2dd4bf]/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-pulse"></span>
                            Live Tools
                        </span>
                    </div>
                    <div className="w-[124px] hidden lg:block"></div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-6 py-12 relative flex flex-col">
                {/* Background ambient effects */}
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#0284c7]/15 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#0d9488]/15 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col z-10">
                    <div className="text-center mb-10 space-y-4 animate-[fadeInUp_0.7s_ease-out]">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-[#bae6fd] to-[#38bdf8] bg-clip-text text-transparent">
                            Live Weather & Time
                        </h1>
                        <p className="text-[#9ca3af] max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                            Ask about the weather or time, and watch the AI seamlessly call tools and stream the response back in real-time.
                        </p>
                    </div>

                    {/* Concept Notice */}
                    <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-[#0ea5e9]/20 rounded-2xl p-6 mb-8 text-[#ececec] relative overflow-hidden group animate-[fadeInUp_0.7s_ease-out]" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                        <div className="absolute top-0 right-[-10%] w-48 h-48 bg-[#0ea5e9]/10 blur-[60px] rounded-full pointer-events-none transition-all group-hover:bg-[#0ea5e9]/20" />
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                            <div className="w-8 h-8 rounded-full bg-[#0ea5e9]/20 flex items-center justify-center text-[#38bdf8] border border-[#0ea5e9]/30">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                            </div>
                            <h3 className="font-bold text-lg text-white">How it works: Streaming Tool Execution</h3>
                        </div>
                        <ul className="text-sm text-[#9b9b9b] space-y-2.5 list-disc pl-11 marker:text-[#0ea5e9]/50 relative z-10">
                            <li><strong>API Tool:</strong> Utilizes <code className="text-[#7dd3fc] bg-[#0284c7]/30 border border-[#0ea5e9]/20 px-1.5 py-0.5 rounded font-mono text-[13px]">streamText</code> infused with backend functions.</li>
                            <li><strong>Methodology:</strong> As opposed to waiting for all steps to complete behind the scenes, this method runs a live feed. Tools are executed and the AI's final natural language synthesis is piped immediately to the UI byte-by-byte.</li>
                            <li><strong>Benefit:</strong> The Absolute fastest perceived performance for the end-user. They see the AI typing the response dynamically based on live tool-fetched data.</li>
                        </ul>
                    </div>

                    {/* Input Area */}
                    <div className="relative group mb-8 animate-[fadeInUp_0.7s_ease-out]" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#0ea5e9] to-[#14b8a6] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                        <div className="relative bg-[#111] border border-[#3a3a3a] rounded-2xl p-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition duration-300">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        getWeatherStream();
                                    }
                                }}
                                placeholder="E.g., What's the time and weather in Paris right now?"
                                className="w-full bg-transparent text-[#ececec] placeholder:text-[#6b7280] p-4 min-h-[120px] resize-none focus:outline-none focus:ring-0 text-lg leading-relaxed"
                            />
                            <div className="flex justify-end p-2 border-t border-[#3a3a3a] mt-2">
                                <button
                                    onClick={getWeatherStream}
                                    disabled={loading || !message.trim()}
                                    className="px-6 py-2.5 bg-gradient-to-r from-[#0ea5e9] to-[#0891b2] text-white font-semibold rounded-xl hover:from-[#0284c7] hover:to-[#0e7490] focus:ring-2 focus:ring-[#0ea5e9]/50 disabled:opacity-50 disabled:hover:from-[#0ea5e9] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.2)] hover:shadow-[0_0_25px_rgba(14,165,233,0.4)] disabled:shadow-none"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Streaming...
                                        </>
                                    ) : (
                                        <>
                                            Stream Insight
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                <polyline points="12 5 19 12 12 19"></polyline>
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Area */}
                    {(result || loading) && (
                        <div className="relative mt-4 flex-1 animate-[fadeInUp_0.5s_ease-out] pb-16">
                            <div className="absolute top-0 left-8 bottom-0 w-px bg-gradient-to-b from-[#0ea5e9]/50 via-white/10 to-transparent hidden md:block"></div>

                            <div className="md:pl-16 relative">
                                {/* Indicator dot */}
                                <div className="absolute left-[-37px] top-8 w-3 h-3 bg-[#0ea5e9] rounded-full shadow-[0_0_10px_rgba(14,165,233,0.6)] hidden md:block z-10">
                                    {loading && <div className="absolute inset-0 rounded-full animate-ping bg-[#38bdf8] opacity-75"></div>}
                                </div>

                                <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-sm">
                                    <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-white prose-a:text-[#38bdf8] hover:prose-a:text-[#7dd3fc] prose-pre:bg-black/50 prose-pre:border prose-pre:border-[#3a3a3a] prose-img:rounded-xl">
                                        <ReactMarkdown>
                                            {result || (loading ? "*Connecting tools and streaming response...*" : "")}
                                        </ReactMarkdown>
                                    </div>
                                    <div ref={resultEndRef} className="h-4" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
