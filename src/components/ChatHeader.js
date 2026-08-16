import Link from "next/link";

export default function ChatHeader() {
    return (
        <header className="chat-header">
            <div className="chat-header-inner">
                <div className="chat-header-logo">✦</div>
                <span className="chat-header-title">AI Chat</span>
                <span className="chat-header-badge">Gemini</span>
            </div>
            <nav className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <Link
                    href="/weather"
                    className="flex items-center gap-1.5 text-[#9b9b9b] no-underline text-[13px] font-medium px-3.5 py-1.5 rounded-lg border border-[#3a3a3a] hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/[0.06] transition-all"
                >
                    🌤️ Weather
                </Link>
                <Link
                    href="/weather-stream"
                    className="flex items-center gap-1.5 text-[#9b9b9b] no-underline text-[13px] font-medium px-3.5 py-1.5 rounded-lg border border-[#3a3a3a] hover:text-cyan-500 hover:border-cyan-500/30 hover:bg-cyan-500/[0.06] transition-all"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                    W-Stream
                </Link>
                <Link
                    href="/assistant"
                    className="flex items-center gap-1.5 text-[#9b9b9b] no-underline text-[13px] font-medium px-3.5 py-1.5 rounded-lg border border-[#3a3a3a] hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-500/[0.06] transition-all"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                    Assistant
                </Link>
                <Link
                    href="/structured-stream"
                    className="flex items-center gap-1.5 text-[#9b9b9b] no-underline text-[13px] font-medium px-3.5 py-1.5 rounded-lg border border-[#3a3a3a] hover:text-violet-500 hover:border-violet-500/30 hover:bg-violet-500/[0.06] transition-all"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                    Stream
                </Link>
                <Link
                    href="/structured"
                    className="flex items-center gap-1.5 text-[#9b9b9b] no-underline text-[13px] font-medium px-3.5 py-1.5 rounded-lg border border-[#3a3a3a] hover:text-amber-500 hover:border-amber-500/30 hover:bg-amber-500/[0.06] transition-all"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    Analyzer
                </Link>
            </nav>
        </header>
    );
}
