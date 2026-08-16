"use client";

import { useState } from "react";
import Link from "next/link";

export default function WeatherPage() {
    const [message, setMessage] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function getWeather() {
        if (!message.trim()) return;

        try {
            setLoading(true);
            setResult(null);
            setError("");

            const response = await fetch("/api/weather", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Something went wrong"
                );
            }

            setResult(data);
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#0d0d0d] text-[#ececec] font-sans selection:bg-[#3b82f6]/30 overflow-x-hidden">
            {/* Header linking to all pages */}
            <header className="sticky top-0 z-20 px-6 py-4 bg-[#0d0d0d]/80 backdrop-blur-xl border-b border-white/5 shadow-sm">
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
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#3b82f6]/20 transition-colors text-[#60a5fa]">
                                🌤️
                            </div>
                            <span className="hidden md:inline">Weather</span>
                        </Link>
                        <Link
                            href="/weather-stream"
                            className="group flex items-center gap-2 text-[#9b9b9b] text-xs md:text-sm font-medium hover:text-[#22d3ee] transition-colors"
                        >
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#06b6d4]/20 transition-colors">
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
                            <div className="absolute inset-0 bg-[#3b82f6] blur-md opacity-30 rounded-full animate-pulse"></div>
                            <div className="relative w-8 h-8 bg-gradient-to-tr from-[#2563eb] to-[#06b6d4] rounded-full flex items-center justify-center text-sm shadow-[0_4px_12px_rgba(0,0,0,0.4)] border border-white/10">
                                🌤️
                            </div>
                        </div>
                        <span className="text-base font-bold tracking-tight text-white/90">Weather AI</span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#60a5fa] bg-[#60a5fa]/10 border border-[#60a5fa]/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Tools Call
                        </span>
                    </div>
                    <div className="w-[124px] hidden lg:block"></div>
                </div>
            </header>

            <main className="flex-1 px-6 py-12 relative flex flex-col">
                {/* Ambient Background */}
                <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-[#1e3a8a]/20 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#164e63]/15 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col z-10">
                    <div className="text-center mb-10 space-y-4 animate-[fadeInUp_0.7s_ease-out]">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-[#dbeafe] to-[#60a5fa] bg-clip-text text-transparent">
                            AI Weather Assistant
                        </h1>
                        <p className="text-[#9ca3af] max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                            Ask Gemini about the weather anywhere. Experience seamless tool calling with beautiful structured results.
                        </p>
                    </div>

                    {/* Concept Notice */}
                    <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-[#3b82f6]/20 rounded-2xl p-6 mb-8 text-[#ececec] relative overflow-hidden group animate-[fadeInUp_0.7s_ease-out]" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                        <div className="absolute top-0 right-[-10%] w-48 h-48 bg-[#3b82f6]/10 blur-[60px] rounded-full pointer-events-none transition-all group-hover:bg-[#3b82f6]/20" />
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                            <div className="w-8 h-8 rounded-full bg-[#3b82f6]/20 flex items-center justify-center text-[#60a5fa] border border-[#3b82f6]/30">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                            </div>
                            <h3 className="font-bold text-lg text-white">How it works: Multi-Step Tool Calling</h3>
                        </div>
                        <ul className="text-sm text-[#9b9b9b] space-y-2.5 list-disc pl-11 marker:text-[#3b82f6]/50 relative z-10">
                            <li><strong>API Tool:</strong> Utilizes <code className="text-[#93c5fd] bg-[#1e3a8a]/40 border border-[#3b82f6]/20 px-1.5 py-0.5 rounded font-mono text-[13px]">generateText</code> alongside the <code className="text-[#93c5fd] bg-[#1e3a8a]/40 border border-[#3b82f6]/20 px-1.5 py-0.5 rounded font-mono text-[13px]">tools</code> configuration.</li>
                            <li><strong>Methodology:</strong> When asked a question, Gemini determines it needs external data. It interrupts generation, calls a Javascript function on your backend (e.g. hitting Open-Meteo), and sends the results back into the prompt.</li>
                            <li><strong>Benefit:</strong> Safely extends the LLMs knowledge graph in real-time, preventing hallucinations and allowing complex logic like math, database lookups, or live weather tracking.</li>
                        </ul>
                    </div>

                    <div className="relative group mb-8 animate-[fadeInUp_0.7s_ease-out]" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                        <div className="relative bg-[#1a1a1a]/90 backdrop-blur-xl border border-[#3a3a3a] rounded-2xl p-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition duration-300">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        getWeather();
                                    }
                                }}
                                placeholder="E.g., What's the weather in Tokyo right now?"
                                className="w-full bg-transparent text-[#ececec] placeholder:text-[#6b7280] p-4 min-h-[120px] resize-none focus:outline-none focus:ring-0 text-lg leading-relaxed"
                            />
                            <div className="flex justify-end p-2 border-t border-[#3a3a3a] mt-2">
                                <button
                                    onClick={getWeather}
                                    disabled={loading || !message.trim()}
                                    className="px-6 py-2.5 bg-[#2563eb] hover:bg-[#3b82f6] text-white font-semibold rounded-xl focus:ring-2 focus:ring-[#3b82f6]/50 disabled:opacity-50 disabled:hover:bg-[#2563eb] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] disabled:shadow-none"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Checking Weather...
                                        </>
                                    ) : (
                                        <>
                                            Get Weather
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 border border-[#ef4444]/30 bg-[#ef4444]/10 text-[#f87171] rounded-xl flex items-center gap-3 animate-[fadeInUp_0.5s_ease-out]">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6 animate-[fadeInUp_0.5s_ease-out] pb-16">

                            {/* AI Response Text */}
                            {result.text && (
                                <div className="bg-gradient-to-br from-[#1e3a8a]/30 to-[#1a1a1a]/80 border border-[#3a3a3a] rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-10 text-[#60a5fa]">
                                        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-[#2563eb]/20 flex items-center justify-center text-[#60a5fa] border border-[#2563eb]/30">
                                            ✦
                                        </div>
                                        <h2 className="text-xl font-bold text-white">AI Analysis</h2>
                                    </div>
                                    <p className="text-[#ececec] whitespace-pre-wrap leading-relaxed relative z-10 text-[15px]">
                                        {result.text}
                                    </p>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}