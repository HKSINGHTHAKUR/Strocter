import { motion } from "framer-motion";

const ALLOC_ITEMS = [
    { key: "needs", label: "Needs", color: "bg-emerald-500", glowColor: "#38E6A2" },
    { key: "savings", label: "Savings & Emergency", color: "bg-[#FF6A00]", glowColor: "#FF6A00" },
    { key: "investments", label: "Investments", color: "bg-[#6E33B1]", glowColor: "#6E33B1" },
];

export default function AssetAllocationPanel({ allocation }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl border border-white/[0.06] bg-[#12141A] p-6 flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold">Asset Allocation Insight</h3>
                <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="w-2 h-2 rounded-full bg-[#FF6A00]" />
                    <span className="w-2 h-2 rounded-full bg-[#6E33B1]" />
                </div>
            </div>

            {/* Bars */}
            <div className="space-y-5 flex-1">
                {ALLOC_ITEMS.map((item, index) => {
                    const pct = allocation?.[item.key] ?? 0;
                    return (
                        <div key={item.key}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold">{item.label}</span>
                                <span className="text-[11px] text-text-muted">{pct}% of total</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.8, delay: 0.5 + index * 0.12, ease: "easeOut" }}
                                    className={`h-full rounded-full ${item.color}`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Suggestion */}
            {allocation?.suggestion && (
                <div className="mt-5 flex items-start gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-sm mt-0.5">✦</span>
                    <div>
                        <p className="text-[11px] font-semibold mb-0.5">Optimization Suggestion</p>
                        <p className="text-[10px] text-text-muted leading-relaxed">
                            {allocation.suggestion}
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
