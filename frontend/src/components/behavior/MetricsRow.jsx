import { motion } from "framer-motion";

const ICONS = ["🧡", "🧠", "⚡", "🛡️", "📊"];
const BAR_COLORS = ["bg-[#ec5b13]", "bg-emerald-500", "bg-[#6E33B1]", "bg-emerald-500", "bg-[#6E33B1]"];
const GLOW_COLORS = [
    "rgba(236,91,19,0.15)", "rgba(16,185,129,0.15)", "rgba(110,51,177,0.15)",
    "rgba(56,230,162,0.15)", "rgba(110,51,177,0.12)",
];

export default function MetricsRow({ metrics }) {
    if (!metrics) return null;

    const keys = ["emotionalSpending", "logicalSpending", "dopamineIndex", "resilienceScore", "volatilityIndex"];
    const labels = ["Emotional Spending", "Logical Spending", "Dopamine Index", "Resilience Score", "Volatility Index"];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {keys.map((key, index) => {
                const m = metrics[key];
                if (!m) return null;
                return (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.07 }}
                        className="relative rounded-2xl border border-white/[0.08] bg-[#12141A] p-5 overflow-hidden group hover:scale-[1.02] transition-transform duration-300 transform-gpu"
                        style={{ boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 30px ${GLOW_COLORS[index]}` }}
                    >
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">{labels[index]}</p>
                            <span className="text-sm">{ICONS[index]}</span>
                        </div>
                        <div className="flex items-baseline gap-1.5 mb-1">
                            <p className="text-2xl font-bold tracking-tight">{m.value}</p>
                            {m.suffix && <span className="text-sm text-text-muted font-medium">{m.suffix}</span>}
                            <span className={`text-xs font-medium ml-1 ${m.changePositive ? "text-emerald-400" : "text-red-400"}`}>{m.change}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/[0.06] mt-3 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, m.progress || 0)}%` }}
                                transition={{ duration: 0.8, delay: 0.3 + index * 0.07, ease: "easeOut" }}
                                className={`h-full rounded-full ${BAR_COLORS[index]}`}
                            />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
