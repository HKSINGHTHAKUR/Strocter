import { motion } from "framer-motion";

export default function CognitivePanel() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="rounded-2xl border border-white/[0.08] bg-[#12141A] p-6 relative overflow-hidden h-full flex flex-col"
        >
            {/* Burnt-orange left accent */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl bg-[#FF6A00]" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#FF6A00]/15 flex items-center justify-center text-sm">
                    ✦
                </div>
                <h3 className="text-sm font-semibold">Cognitive Analysis</h3>
            </div>

            {/* Insight text */}
            <p className="text-[13px] text-text-secondary leading-relaxed mb-5">
                Your <span className="text-white font-semibold">Impulse Resilience</span> has
                increased by 14% this month. Data suggests a strong correlation between
                your "Productive Routine" window (8 AM–11 AM) and high-value logical
                investments.
            </p>

            {/* Trigger + Action row */}
            <div className="space-y-2 mb-5 py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Primary Trigger
                    </span>
                    <span className="text-[11px] font-semibold text-[#ec5b13]">
                        High Stress
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Recommended Action
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-400">
                        24h Hold Period
                    </span>
                </div>
            </div>

            {/* Quote */}
            <p className="text-[11px] text-text-muted italic leading-relaxed mb-5">
                "Reducing discretionary exposure during late-night windows could improve
                your net savings by approximately $1,240 based on last month's velocity."
            </p>

            {/* Button */}
            <div className="mt-auto">
                <button className="w-full py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm font-semibold text-white hover:bg-white/[0.1] transition-colors cursor-pointer">
                    View Deeper Analysis
                </button>
            </div>
        </motion.div>
    );
}
