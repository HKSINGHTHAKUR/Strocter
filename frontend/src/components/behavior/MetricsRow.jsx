import { motion } from "framer-motion";

const METRICS = [
    {
        label: "Emotional Spending",
        value: "42.8%",
        change: "+2.4%",
        changeColor: "text-emerald-400",
        progress: 42.8,
        barColor: "bg-[#ec5b13]",
        glowColor: "rgba(236,91,19,0.15)",
        icon: "🧡",
    },
    {
        label: "Logical Spending",
        value: "57.2%",
        change: "-1.2%",
        changeColor: "text-red-400",
        progress: 57.2,
        barColor: "bg-emerald-500",
        glowColor: "rgba(16,185,129,0.15)",
        icon: "🧠",
    },
    {
        label: "Dopamine Index",
        value: "74",
        suffix: "/100",
        change: "Stable",
        changeColor: "text-text-muted",
        progress: 74,
        barColor: "bg-[#6E33B1]",
        glowColor: "rgba(110,51,177,0.15)",
        icon: "⚡",
    },
    {
        label: "Resilience Score",
        value: "8.4",
        change: "Excellent",
        changeColor: "text-emerald-400",
        progress: 84,
        barColor: "bg-emerald-500",
        glowColor: "rgba(56,230,162,0.15)",
        icon: "🛡️",
    },
    {
        label: "Volatility Index",
        value: "Low-Mid",
        change: "-8% decrease",
        changeColor: "text-text-muted",
        progress: 35,
        barColor: "bg-[#6E33B1]",
        glowColor: "rgba(110,51,177,0.12)",
        icon: "📊",
    },
];

export default function MetricsRow() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {METRICS.map((metric, index) => (
                <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                        duration: 0.45,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        delay: index * 0.07,
                    }}
                    className="relative rounded-2xl border border-white/[0.08] bg-[#12141A] p-5 overflow-hidden group hover:scale-[1.02] transition-transform duration-300 transform-gpu"
                    style={{
                        boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 30px ${metric.glowColor}`,
                    }}
                >
                    {/* Top highlight */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

                    {/* Label row */}
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                            {metric.label}
                        </p>
                        <span className="text-sm">{metric.icon}</span>
                    </div>

                    {/* Value */}
                    <div className="flex items-baseline gap-1.5 mb-1">
                        <p className="text-2xl font-bold tracking-tight">
                            {metric.value}
                        </p>
                        {metric.suffix && (
                            <span className="text-sm text-text-muted font-medium">
                                {metric.suffix}
                            </span>
                        )}
                        <span
                            className={`text-xs font-medium ml-1 ${metric.changeColor}`}
                        >
                            {metric.change}
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-white/[0.06] mt-3 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.progress}%` }}
                            transition={{
                                duration: 0.8,
                                delay: 0.3 + index * 0.07,
                                ease: "easeOut",
                            }}
                            className={`h-full rounded-full ${metric.barColor}`}
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
