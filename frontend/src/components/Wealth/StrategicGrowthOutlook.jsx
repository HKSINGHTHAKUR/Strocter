import { motion } from "framer-motion";

export default function StrategicGrowthOutlook({ outlook }) {
    const impacts = outlook?.behavioralImpacts ?? {};

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl border border-white/[0.06] bg-[#12141A] p-6 overflow-hidden relative"
        >
            {/* Subtle top glow */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF6A00]/30 to-transparent" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Narrative */}
                <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/20 text-[9px] font-semibold text-[#FF6A00] uppercase tracking-wider mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-pulse" />
                        AI Analysis Active
                    </div>
                    <h3 className="text-lg font-bold leading-tight mb-3">
                        Strategic<br />Growth Outlook
                    </h3>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                        {outlook?.narrative ?? "Based on your recent transaction behavior and global market trends, our proprietary model suggests a pivot towards defensive asset appreciation over the next 18 months."}
                    </p>
                </div>

                {/* Center: Behavioral Impacts */}
                <div>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-text-muted mb-3">
                        Behavioral Impacts
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                            <span className="text-[11px]">
                                Reduced variable churn: <span className="text-emerald-400 font-semibold">{impacts.reducedChurn ?? "+14%"}</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#FF6A00] flex-shrink-0" />
                            <span className="text-[11px]">
                                Subscription leakage: <span className="text-[#FF6A00] font-semibold">{impacts.subscriptionLeakage ?? "-2.1%"}</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#6E33B1] flex-shrink-0" />
                            <span className="text-[11px]">
                                Re-investment velocity: <span className="text-[#6E33B1] font-semibold">{impacts.reinvestmentVelocity ?? "Optimized"}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Key Indicators */}
                <div>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-text-muted mb-3">
                        Key Indicators
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <span className="text-[11px] text-text-muted">Predicted Improvement</span>
                            <span className="text-sm font-bold text-emerald-400">
                                {outlook?.predictedImprovement ?? 0}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <span className="text-[11px] text-text-muted">Risk Reduction</span>
                            <span className="text-sm font-bold text-[#6E33B1]">
                                {outlook?.riskReduction ?? 0}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
