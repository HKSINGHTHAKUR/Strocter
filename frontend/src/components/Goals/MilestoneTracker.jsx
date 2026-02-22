import { motion } from "framer-motion";

const STATUS_STYLES = {
    achieved: { ring: "border-emerald-500 bg-emerald-500/20", dot: "bg-emerald-500", text: "text-emerald-400" },
    active: { ring: "border-[#ec5b13] bg-[#ec5b13]/20 animate-pulse", dot: "bg-[#ec5b13]", text: "text-[#ec5b13]" },
    pending: { ring: "border-[#2D3139] bg-white/[0.03]", dot: "bg-[#2D3139]", text: "text-text-muted" },
};

export default function MilestoneTracker({ milestones }) {
    if (!milestones?.length) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="rounded-2xl border border-[#2D3139] bg-[#12141A] p-6"
        >
            <p className="text-[9px] font-semibold uppercase tracking-widest text-text-muted mb-5">
                Quarterly Achievement Roadmap
            </p>

            <div className="flex items-start justify-between relative">
                {/* Connecting line */}
                <div className="absolute top-4 left-0 right-0 h-[2px] bg-[#2D3139]" />

                {milestones.map((m, i) => {
                    const style = STATUS_STYLES[m.status] || STATUS_STYLES.pending;
                    return (
                        <div key={m.quarter} className="relative flex flex-col items-center flex-1">
                            {/* Ring */}
                            <div className={`w-8 h-8 rounded-full border-2 ${style.ring} flex items-center justify-center z-10`}>
                                <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                            </div>
                            {/* Label */}
                            <p className={`text-[10px] font-bold mt-2 ${style.text}`}>{m.quarter}</p>
                            <p className="text-[9px] font-semibold text-white mt-0.5">{m.label}</p>
                            <p className="text-[8px] text-text-muted mt-0.5 text-center max-w-[120px]">{m.description}</p>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
