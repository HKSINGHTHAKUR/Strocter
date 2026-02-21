export default function AIInsightPanel({ personality, insight }) {
    return (
        <div className="glass-card flex fade-in fade-in-delay-4">
            {/* Accent line */}
            <div className="ai-accent-line flex-shrink-0"></div>

            {/* Content */}
            <div className="p-8 pl-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 rounded-lg bg-accent/15 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">AI Intelligence</p>
                </div>
                <h3 className="text-xl font-semibold mb-2">{personality ?? "Analyzing..."}</h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
                    {insight ?? "Collecting more data to generate your personalized financial intelligence."}
                </p>
            </div>
        </div>
    );
}
