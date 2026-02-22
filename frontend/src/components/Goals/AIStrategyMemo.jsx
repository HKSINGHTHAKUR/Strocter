import { motion } from "framer-motion";

export default function AIStrategyMemo({ memo }) {
    if (!memo) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="rounded-2xl border border-[#2D3139] bg-[#12141A] p-6 flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[#ec5b13]">⚡</span>
                <h3 className="text-sm font-bold">AI Strategy Memo</h3>
            </div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-text-muted mb-5">
                Strategic Adjustment Protocol 102-B
            </p>

            {/* Trigger */}
            <div className="mb-5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-2">
                    Identified Triggers
                </p>
                <div className="rounded-xl border border-[#2D3139] p-3">
                    <p className="text-xs font-bold mb-0.5">{memo.trigger}</p>
                    <p className="text-[10px] text-text-muted">{memo.triggerDetail}</p>
                </div>
            </div>

            {/* Action */}
            <div className="mb-5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-2">
                    Action Implemented
                </p>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-3">
                    <div className="flex items-center justify-between mb-0.5">
                        <p className="text-xs font-bold text-emerald-400">{memo.action}</p>
                        <span className="text-emerald-400 text-sm">✓</span>
                    </div>
                    <p className="text-[10px] text-text-muted">{memo.actionDetail}</p>
                </div>
            </div>

            {/* Expected Impacts */}
            <div className="mb-5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-2">
                    Expected Impacts
                </p>
                <div className="space-y-1.5">
                    {memo.expectedImpacts?.map((impact, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6E33B1] flex-shrink-0" />
                            <p className="text-[10px] text-text-muted">{impact}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Accept button */}
            <button className="mt-auto w-full py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/[0.1] transition-colors duration-200 cursor-pointer">
                Accept Protocol Adjustment
            </button>
        </motion.div>
    );
}
