import { motion } from "framer-motion";

export default function OverviewCard({ icon, badge, badgeColor, title, description, metricLabel, metricValue, metricColor, actionText, index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="group relative rounded-2xl border border-white/[0.06] bg-[#12141A] p-5 cursor-pointer
                       hover:-translate-y-[3px] hover:border-[#ec5b13]/40 hover:shadow-[0_0_30px_rgba(236,91,19,0.08)]
                       transition-all duration-300 transform-gpu flex flex-col"
        >
            {/* Top edge highlight */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* Icon + Badge row */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-xl">{icon}</span>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${badgeColor}`}>
                    {badge}
                </span>
            </div>

            {/* Title + Description */}
            <h4 className="text-sm font-bold mb-1.5 group-hover:text-[#ec5b13] transition-colors duration-300">
                {title}
            </h4>
            <p className="text-[10px] text-text-muted leading-relaxed mb-auto">
                {description}
            </p>

            {/* Bottom metric */}
            <div className="flex items-end justify-between mt-5 pt-4 border-t border-white/[0.04]">
                <div>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-text-muted">
                        {metricLabel}
                    </p>
                    <p className={`text-lg font-bold mt-0.5 ${metricColor || "text-white"}`}>
                        {metricValue}
                    </p>
                </div>
                <span className="text-[10px] font-semibold text-[#ec5b13] group-hover:underline cursor-pointer">
                    {actionText}
                </span>
            </div>
        </motion.div>
    );
}
