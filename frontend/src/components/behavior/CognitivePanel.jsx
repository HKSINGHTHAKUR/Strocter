import { motion } from "framer-motion";

export default function CognitivePanel({ cognitive }) {
    const data = cognitive || { narrative: "", trigger: "N/A", action: "N/A", quote: "" };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="rounded-2xl border border-white/[0.08] bg-[#12141A] p-6 relative overflow-hidden h-full flex flex-col"
        >
            <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl bg-[#FF6A00]" />
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#FF6A00]/15 flex items-center justify-center text-sm">✦</div>
                <h3 className="text-sm font-semibold">Cognitive Analysis</h3>
            </div>
            <p className="text-[13px] text-text-secondary leading-relaxed mb-5">{data.narrative}</p>
            <div className="space-y-2 mb-5 py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Primary Trigger</span>
                    <span className="text-[11px] font-semibold text-[#ec5b13]">{data.trigger}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Recommended Action</span>
                    <span className="text-[11px] font-semibold text-emerald-400">{data.action}</span>
                </div>
            </div>
            <p className="text-[11px] text-text-muted italic leading-relaxed mb-5">{data.quote}</p>
            <div className="mt-auto">
                <button className="w-full py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm font-semibold text-white hover:bg-white/[0.1] transition-colors cursor-pointer">
                    View Deeper Analysis
                </button>
            </div>
        </motion.div>
    );
}
