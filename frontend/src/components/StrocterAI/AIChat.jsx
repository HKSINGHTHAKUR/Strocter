import { useState, useRef, useEffect } from "react";
import { sendAIMessage } from "../../services/aiService";

const WELCOME_MESSAGE = {
    sender: "ai",
    text: `Welcome to Strocter AI — your financial psychology assistant.

I can see your real-time behavioral data on the left. Ask me anything:

• "Why am I overspending recently?"
• "What triggers my impulse purchases?"
• "How can I improve my control score?"

Your data stays private — I only analyze summarized metrics.`,
};

export default function AIChat() {
    const [messages, setMessages] = useState([WELCOME_MESSAGE]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

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
                    : "⚠️ Something went wrong. Please try again.";
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

    const clearChat = () => setMessages([WELCOME_MESSAGE]);

    return (
        <div className="flex flex-col h-full bg-[#080808] border border-[#1a1a1a] rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#1a1a1a]">
                <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                    <span className="text-sm text-[#888]">Strocter AI</span>
                </div>
                <button
                    onClick={clearChat}
                    className="text-[#444] hover:text-[#888] text-xs transition-colors"
                >
                    Clear
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${msg.sender === "user"
                                    ? "bg-[#ec5b13] text-white rounded-br-md"
                                    : "bg-[#111] border border-[#1a1a1a] text-[#ccc] rounded-bl-md"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-[#ec5b13] rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-1.5 h-1.5 bg-[#ec5b13] rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-1.5 h-1.5 bg-[#ec5b13] rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-[#1a1a1a] p-3">
                <div className="flex items-end gap-2 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-2 focus-within:border-[#333] transition-colors">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about your spending behavior..."
                        rows={1}
                        className="flex-1 bg-transparent text-white text-sm placeholder-[#333] resize-none outline-none px-2 py-1.5 max-h-24"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="p-2 rounded-lg bg-[#ec5b13] hover:bg-[#d44e0f] disabled:opacity-20 disabled:cursor-not-allowed transition-all flex-shrink-0"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 2L11 13" />
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
