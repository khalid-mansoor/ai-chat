"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';

export default function StructuredStreamPage() {
    const [product, setProduct] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const resultEndRef = useRef(null);

    // Auto scroll down as result streams
    useEffect(() => {
        if (resultEndRef.current) {
            resultEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [result]);

    async function analyzeProduct() {
        if (!product.trim()) return;

        setLoading(true);
        setResult("");

        try {
            const response = await fetch(
                "/api/structured-stream",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        product,
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
            setResult("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#ececec] font-sans selection:bg-violet-500/30 overflow-x-hidden">
            {/* Header */}
            <header className="sticky top-0 z-20 px-6 py-4 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 shadow-sm">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <nav className="flex items-center gap-1.5 md:gap-3">
                        <Link
                            href="/"
                            className="group flex items-center gap-2 text-zinc-400 text-xs md:text-sm font-medium hover:text-white transition-colors"
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
                            className="group flex items-center gap-2 text-zinc-400 text-xs md:text-sm font-medium hover:text-blue-400 transition-colors"
                        >
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                🌤️
                            </div>
                            <span className="hidden md:inline">Weather</span>
                        </Link>
                        <Link
                            href="/weather-stream"
                            className="group flex items-center gap-2 text-zinc-400 text-xs md:text-sm font-medium hover:text-cyan-400 transition-colors"
                        >
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                            </div>
                            <span className="hidden md:inline">W-Stream</span>
                        </Link>
                        <Link
                            href="/structured"
                            className="group flex items-center gap-2 text-zinc-400 text-xs md:text-sm font-medium hover:text-amber-400 transition-colors"
                        >
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors text-amber-500">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                            </div>
                            <span className="hidden md:inline">Analyzer</span>
                        </Link>
                    </nav>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-violet-500 blur-md opacity-30 rounded-full animate-pulse"></div>
                            <div className="relative w-8 h-8 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center text-sm shadow-lg border border-white/10">
                                ✨
                            </div>
                        </div>
                        <span className="text-base font-bold tracking-tight text-white/90">Deep Analyzer</span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Live Stream
                        </span>
                    </div>
                    <div className="w-[124px]"></div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-6 py-12 relative flex flex-col">
                {/* Background ambient effects */}
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-violet-900/20 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-fuchsia-900/20 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col z-10">
                    <div className="text-center mb-10 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent">
                            What would you like to analyze?
                        </h1>
                        <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                            Describe a product, service, or concept, and our AI will break it down into a structured, comprehensive analysis in real-time.
                        </p>
                    </div>

                    {/* Concept Notice */}
                    <div className="bg-[#111]/80 backdrop-blur-xl border border-violet-500/20 rounded-2xl p-6 mb-8 text-[#ececec] relative overflow-hidden group animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                        <div className="absolute top-0 right-[-10%] w-48 h-48 bg-violet-500/10 blur-[60px] rounded-full pointer-events-none transition-all group-hover:bg-violet-500/20" />
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 border border-violet-500/30">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                            </div>
                            <h3 className="font-bold text-lg text-white">How it works: Partial Object Streaming</h3>
                        </div>
                        <ul className="text-sm text-[#9b9b9b] space-y-2.5 list-disc pl-11 marker:text-violet-500/50 relative z-10">
                            <li><strong>API Tool:</strong> Utilizes <code className="text-violet-300 bg-violet-900/40 border border-violet-500/20 px-1.5 py-0.5 rounded font-mono text-[13px]">streamObject</code> from the Vercel AI SDK.</li>
                            <li><strong>Methodology:</strong> As the AI generates a complex JSON structure, text streams representing fragments of the exact structural matching the Zod schema are pushed to the client immediately.</li>
                            <li><strong>Benefit:</strong> The user sees formatting render in real-time instantly without waiting for the full network request cycle to finish, achieving both speed and reliable object typing.</li>
                        </ul>
                    </div>

                    {/* Input Area */}
                    <div className="relative group mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                        <div className="relative bg-[#111] border border-white/10 rounded-2xl p-2 shadow-2xl transition duration-300">
                            <textarea
                                value={product}
                                onChange={(e) => setProduct(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        analyzeProduct();
                                    }
                                }}
                                placeholder="E.g., 'A smart coffee mug with temperature control and a companion app'"
                                className="w-full bg-transparent text-white placeholder:text-zinc-400 p-4 min-h-[120px] resize-none focus:outline-none focus:ring-0 text-lg leading-relaxed"
                            />
                            <div className="flex justify-end p-2 border-t border-white/5 mt-2">
                                <button
                                    onClick={analyzeProduct}
                                    disabled={loading || !product.trim()}
                                    className="px-6 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:hover:bg-white transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:shadow-none"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            Start Analysis
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
                        <div className="relative mt-4 flex-1 animate-in fade-in duration-500 pb-16">
                            <div className="absolute top-0 left-8 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-white/10 to-transparent hidden md:block"></div>

                            <div className="md:pl-16 relative">
                                {/* Indicator dot */}
                                <div className="absolute left-[-37px] top-8 w-3 h-3 bg-violet-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.6)] hidden md:block z-10">
                                    {loading && <div className="absolute inset-0 rounded-full animate-ping bg-violet-400 opacity-75"></div>}
                                </div>

                                <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
                                    <div className="prose prose-invert prose-violet max-w-none prose-p:leading-relaxed prose-headings:text-white prose-a:text-violet-400 hover:prose-a:text-violet-300 prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-img:rounded-xl">
                                        <ReactMarkdown>
                                            {result || (loading ? "*Connecting to neural models...*" : "")}
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