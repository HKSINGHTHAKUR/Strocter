export default function BehavioralAlert() {
    return (
        <div className="glass-card flex fade-in fade-in-delay-4">
            {/* Orange gradient left border */}
            <div className="w-[3px] flex-shrink-0 rounded-l-3xl bg-gradient-to-b from-accent-orange via-accent-orange/60 to-transparent" />

            {/* Content */}
            <div className="p-8 pl-6 flex-1">
                <div className="flex items-center gap-2 mb-3">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#FF6A00"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent-orange">
                        Behavioral Pattern Detected
                    </p>
                </div>

                <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                            Unusual Impulse Spending Spike
                        </h3>
                        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
                            Increased late-night impulse spending detected over the last 7 days,
                            correlating with high stress signals. Our AI suggests a shift in budget
                            allocation to mitigate risk and suggests enabling &apos;Mindful Cooling&apos; on
                            your digital wallet.
                        </p>
                    </div>

                    <button className="flex-shrink-0 mt-2 px-5 py-2.5 rounded-xl border border-white/[0.12] bg-white/[0.04] text-sm font-medium text-text-primary hover:bg-white/[0.08] transition-colors cursor-pointer whitespace-nowrap">
                        View deeper analysis
                    </button>
                </div>
            </div>
        </div>
    );
}
