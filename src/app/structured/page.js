"use client";

import { useState } from "react";
import Link from "next/link";

export default function StructuredPage() {
    const [product, setProduct] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    async function analyzeProduct() {
        if (!product.trim()) return;

        try {
            setLoading(true);
            setResult(null);

            const response = await fetch("/api/structured", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product,
                }),
            });

            const data = await response.json();

            setResult(data.result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#0d0d0d] text-[#ececec]">
            {/* Header */}
            <header className="sticky top-0 z-20 px-6 py-3.5 bg-[#1a1a1a]/90 backdrop-blur-xl border-b border-[#3a3a3a]">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <nav className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="flex items-center gap-1.5 text-[#9b9b9b] text-xs font-medium px-2.5 py-1.5 rounded-lg hover:text-[#ececec] hover:bg-[#2a2a2a] transition-all"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            Chat
                        </Link>
                        <Link
                            href="/weather"
                            className="flex items-center gap-1.5 text-[#9b9b9b] text-xs font-medium px-2.5 py-1.5 rounded-lg hover:text-blue-500 hover:bg-blue-500/10 transition-all"
                        >
                            🌤️ Weather
                        </Link>
                        <Link
                            href="/weather-stream"
                            className="flex items-center gap-1.5 text-[#9b9b9b] text-xs font-medium px-2.5 py-1.5 rounded-lg hover:text-cyan-500 hover:bg-cyan-500/10 transition-all"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                            W-Stream
                        </Link>
                        <Link
                            href="/structured-stream"
                            className="flex items-center gap-1.5 text-[#9b9b9b] text-xs font-medium px-2.5 py-1.5 rounded-lg hover:text-violet-500 hover:bg-violet-500/10 transition-all"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                            Stream
                        </Link>
                    </nav>
                    <div className="flex items-center gap-2.5">
                        <div className="w-[30px] h-[30px] bg-gradient-to-br from-amber-500 to-orange-500 rounded-[9px] flex items-center justify-center text-[15px] shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                            ⚡
                        </div>
                        <span className="text-base font-semibold tracking-tight">Product Analyzer</span>
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            AI
                        </span>
                    </div>
                    <div className="w-[200px] hidden md:block"></div> {/* Spacer to maintain center alignment */}
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto px-6 py-10 pb-16">
                <div className="max-w-[860px] mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2.5">
                            AI Product Analyzer
                        </h1>
                        <p className="text-[15px] text-[#9b9b9b] max-w-[480px] mx-auto leading-relaxed">
                            Get instant AI-powered analysis with structured insights, ratings, and recommendations.
                        </p>
                    </div>

                    {/* Concept Notice */}
                    <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 mb-8 text-[#ececec] relative overflow-hidden group">
                        <div className="absolute top-0 right-[-10%] w-48 h-48 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none transition-all group-hover:bg-amber-500/20" />
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 border border-amber-500/30">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                            </div>
                            <h3 className="font-bold text-lg text-white">How it works: Structured Object Generation</h3>
                        </div>
                        <ul className="text-sm text-[#9b9b9b] space-y-2.5 list-disc pl-11 marker:text-amber-500/50 relative z-10">
                            <li><strong>API Tool:</strong> Utilizes <code className="text-amber-300 bg-amber-900/40 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono text-[13px]">generateObject</code> from the Vercel AI SDK.</li>
                            <li><strong>Methodology:</strong> A strict validation schema is defined using <strong className="text-white">Zod</strong> on the backend. This guarantees the AI returns data matching properties like <em className="text-white">pros</em>, <em className="text-white">cons</em>, and <em className="text-white">rating</em>.</li>
                            <li><strong>Benefit:</strong> Safely renders beautiful UI components (like the rating bar below) without the unreliability of manual RegEx text parsing.</li>
                        </ul>
                    </div>

                    {/* Input Card */}
                    <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl p-6 mb-8 hover:border-[#444] transition-all">
                        <label className="block text-[13px] font-semibold text-[#9b9b9b] mb-2.5 tracking-wide">
                            Product Description
                        </label>
                        <textarea
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            placeholder="Describe a product to analyze... e.g. 'iPhone 15 Pro Max — Apple's flagship smartphone with A17 Pro chip, titanium design, and 5x optical zoom'"
                            className="w-full bg-[#2f2f2f] border border-[#3a3a3a] rounded-xl p-4 text-[15px] text-[#ececec] font-inherit leading-relaxed resize-y outline-none min-h-[120px] placeholder:text-[#666] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
                            rows={5}
                        />
                        <button
                            onClick={analyzeProduct}
                            disabled={loading || !product.trim()}
                            className="inline-flex items-center gap-2 mt-4 px-7 py-3 bg-gradient-to-r from-amber-500 to-orange-500 border-none rounded-xl text-white text-[15px] font-semibold cursor-pointer shadow-[0_4px_16px_rgba(245,158,11,0.25)] hover:translate-y-[-1px] hover:shadow-[0_6px_24px_rgba(245,158,11,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 transition-all"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    Analyze Product
                                </>
                            )}
                        </button>
                    </div>

                    {/* Results */}
                    {result && (
                        <div className="flex flex-col gap-4 animate-[fadeInUp_0.5s_ease-out]">
                            {/* Product Title Card */}
                            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#212121] border border-[#444] rounded-2xl p-6 flex items-center justify-between flex-wrap gap-3">
                                <div className="text-2xl font-extrabold tracking-tight">{result.name}</div>
                                <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full whitespace-nowrap">
                                    {result.category}
                                </span>
                            </div>

                            {/* Rating + Summary Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl p-6 flex flex-col hover:border-[#444] transition-all">
                                    <div className="text-xs font-bold text-[#666] uppercase tracking-widest mb-3.5">Rating</div>
                                    <div className="flex items-baseline gap-0.5 mb-4">
                                        <span className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent leading-none">
                                            {result.rating}
                                        </span>
                                        <span className="text-xl font-semibold text-[#666]">/10</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden mt-auto">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-800"
                                            style={{ width: `${result.rating * 10}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl p-6 flex flex-col hover:border-[#444] transition-all">
                                    <div className="text-xs font-bold text-[#666] uppercase tracking-widest mb-3.5">Summary</div>
                                    <p className="text-sm leading-relaxed text-[#9b9b9b] m-0">{result.summary}</p>
                                </div>
                            </div>

                            {/* Pros, Cons & Distributors Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl p-6 hover:border-[#444] transition-all">
                                    <div className="text-xs font-bold text-[#666] uppercase tracking-widest mb-3.5 flex items-center gap-1.5">
                                        <span className="text-green-500 font-bold">✓</span> Pros
                                    </div>
                                    <ul className="list-none p-0 m-0 flex flex-col gap-2">
                                        {result.pros.map((pro, index) => (
                                            <li key={index} className="text-sm leading-normal text-[#9b9b9b] py-2 px-3 rounded-lg bg-[#0d0d0d] border-l-[3px] border-l-green-500">
                                                {pro}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl p-6 hover:border-[#444] transition-all">
                                    <div className="text-xs font-bold text-[#666] uppercase tracking-widest mb-3.5 flex items-center gap-1.5">
                                        <span className="text-red-500 font-bold">✗</span> Cons
                                    </div>
                                    <ul className="list-none p-0 m-0 flex flex-col gap-2">
                                        {result.cons.map((con, index) => (
                                            <li key={index} className="text-sm leading-normal text-[#9b9b9b] py-2 px-3 rounded-lg bg-[#0d0d0d] border-l-[3px] border-l-red-500">
                                                {con}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl p-6 hover:border-[#444] transition-all">
                                    <div className="text-xs font-bold text-[#666] uppercase tracking-widest mb-3.5 flex items-center gap-1.5">
                                        <span className="text-blue-500 font-bold">🏪</span> Distributors
                                    </div>
                                    <ul className="list-none p-0 m-0 flex flex-col gap-2">
                                        {result.distributers.map((distributer, index) => (
                                            <li key={index} className="text-sm leading-normal text-[#9b9b9b] py-2 px-3 rounded-lg bg-[#0d0d0d] border-l-[3px] border-l-blue-500">
                                                {distributer}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Recommendation */}
                            <div className="bg-gradient-to-br from-amber-500/[0.06] to-orange-500/[0.04] border border-amber-500/15 rounded-2xl p-6 hover:border-amber-500/25 transition-all">
                                <div className="text-xs font-bold text-[#666] uppercase tracking-widest mb-3.5">💡 Recommendation</div>
                                <p className="text-[15px] leading-relaxed text-[#ececec] m-0">{result.recommendation}</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}