import { useState, useRef, useEffect } from "react";
import { sendAIMessage } from "../../services/aiService";

function getWelcomeMessage(analytics) {
    const controlScore = analytics?.controlScore;
    const impulseScore = analytics?.impulseScore;

    let contextLine = "I have access to your real-time behavioral data.";
    if (controlScore != null && impulseScore != null) {
        contextLine = `Based on your Control Score of ${controlScore}/10 and Impulse Score of ${impulseScore}/100, I can provide personalized financial psychology insights.`;
    }

    return {
        sender: "ai",
        text: `Welcome to Strocter AI — your financial psychology assistant.\n\n${contextLine}\n\nTry asking:\n• "Why am I overspending recently?"\n• "What triggers my impulse purchases?"\n• "How can I improve my control score?"`,
    };
}

export default function AIChat({ analytics }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    /* Update welcome message when analytics load */
    useEffect(() => {
        setMessages([getWelcomeMessage(analytics)]);
    }, [analytics]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
        setInput("");
        setLoading(true);

        try {
            const reply = await sendAIMessage(trimmed);
            setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
        } catch (err) {
            const errorText =
                err.response?.status === 403
                    ? "🔒 Premium subscription required."
                    : "⚠️ AI service temporarily unavailable. Please try again.";
            setMessages((prev) => [...prev, { sender: "ai", text: errorText }]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => setMessages([getWelcomeMessage(analytics)]);

    return (
        <div className="bg-neutral-900/60 backdrop-blur-xl rounded-2xl border border-neutral-800 flex flex-col h-full min-h-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ec5b13] to-[#d44e0f] flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                                <path d="M10 21h4" />
                            </svg>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-neutral-900" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">Strocter AI</p>
                        <p className="text-[10px] text-neutral-500">Financial Psychology Assistant</p>
                    </div>
                </div>
                <button
                    onClick={clearChat}
                    className="text-neutral-600 hover:text-neutral-400 text-[10px] uppercase tracking-wider font-semibold transition-colors duration-200"
                >
                    Clear
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 min-h-0 scrollbar-thin">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed whitespace-pre-wrap ${msg.sender === "user"
                                    ? "bg-[#ec5b13] text-white rounded-br-sm"
                                    : "bg-white/[0.03] border border-white/[0.06] text-neutral-300 rounded-bl-sm"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl rounded-bl-sm px-4 py-3.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-[#ec5b13] rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-1.5 h-1.5 bg-[#ec5b13] rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-1.5 h-1.5 bg-[#ec5b13] rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-2 flex-shrink-0">
                <div className="relative">
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about your spending behavior..."
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-neutral-600 outline-none pl-4 pr-12 py-3 focus:border-[#ec5b13]/30 focus:ring-1 focus:ring-[#ec5b13]/10 transition-all duration-200"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#ec5b13] hover:bg-[#d44e0f] disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 2L11 13" />
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
