export default function InsightPanel({ personality, insight }) {
    const renderInsightText = (text) => {
        if (!text) {
            return (
                <>
                    Your spending patterns this week suggest a 14% increase in{" "}
                    <span className="text-accent-orange font-semibold">
                        dopamine-driven consumption
                    </span>{" "}
                    during late-night hours. However, your resilience score remains high,
                    indicating these were conscious choices rather than loss of control.
                </>
            );
        }

        const keyword = "dopamine-driven consumption";
        const index = text.toLowerCase().indexOf(keyword.toLowerCase());

        if (index === -1) return text;

        const before = text.slice(0, index);
        const match = text.slice(index, index + keyword.length);
        const after = text.slice(index + keyword.length);

        return (
            <>
                {before}
                <span className="text-accent-orange font-semibold">{match}</span>
                {after}
            </>
        );
    };

    return (
        <div className="glass-card flex fade-in fade-in-delay-4">
            {/* Gradient left border */}
            <div className="ai-accent-line flex-shrink-0" />

            {/* Content */}
            <div className="p-8 pl-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 rounded-lg bg-accent-purple/15 flex items-center justify-center">
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6E33B1"
                            strokeWidth="2"
                            strokeLinecap="round"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                        Autonomous Psychological Insight
                    </p>
                </div>

                <p className="text-lg leading-relaxed max-w-3xl mb-5 text-text-primary">
                    {renderInsightText(insight)}
                </p>

                <a
                    href="#behavioral-deep-dive"
                    className="text-accent-orange text-sm font-medium hover:underline transition-colors"
                >
                    View behavioral deep-dive →
                </a>
            </div>
        </div>
    );
}
