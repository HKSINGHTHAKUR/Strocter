import { motion } from "framer-motion";

export default function GoalCard({ icon, badge, badgeColor, label, current, suffix, progress, progressColor, subLeft, subRight, subRightColor, index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative rounded-2xl border border-[#2D3139] bg-[#12141A] p-5 overflow-hidden hover:-translate-y-[2px] transition-all duration-300 transform-gpu"
        >
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* Icon + Badge */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-lg">{icon}</span>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${badgeColor}`}>
                    {badge}
                </span>
            </div>

            {/* Label */}
            <p className="text-[9px] font-semibold uppercase tracking-widest text-text-muted mb-1.5">
                {label}
            </p>

            {/* Value */}
            <div className="flex items-baseline gap-1 mb-3">
                <p className="text-2xl font-bold tracking-tight">{current}</p>
                {suffix && <span className="text-sm text-text-muted font-medium">{suffix}</span>}
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden mb-3">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, progress || 0)}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                    className={`h-full rounded-full ${progressColor || "bg-[#38E6A2]"}`}
                />
            </div>

            {/* Sub text */}
            <div className="flex items-center justify-between">
                <span className="text-[10px] text-text-muted">{subLeft}</span>
                <span className={`text-[10px] font-semibold ${subRightColor || "text-text-muted"}`}>{subRight}</span>
            </div>
        </motion.div>
    );
}
