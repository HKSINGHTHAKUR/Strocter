import { motion } from "framer-motion";

const CARDS = [
    {
        key: "impulseScore",
        label: "Impulse Score",
        getValue: (d) => d?.impulseScore ?? 0,
        suffix: "/100",
        getSub: (d) => `${d?.impulseBaseline > 0 ? "↗" : "↘"} ${Math.abs(d?.impulseBaseline ?? 0)}% from baseline`,
        subColor: (d) => (d?.impulseBaseline <= 0 ? "text-emerald-400" : "text-red-400"),
        icon: "⚡",
        glowColor: "rgba(255,106,0,0.12)",
    },
    {
        key: "stressCorrelation",
        label: "Stress Correlation",
        getValue: (d) => `${d?.stressCorrelation ?? 0}`,
        suffix: "%",
        getSub: (d) => `↗ ${d?.stressVsAverage > 0 ? "+" : ""}${d?.stressVsAverage ?? 0}% vs average`,
        subColor: (d) => (d?.stressVsAverage <= 0 ? "text-emerald-400" : "text-[#FF6A00]"),
        icon: "🧠",
        glowColor: "rgba(110,51,177,0.12)",
    },
    {
        key: "lateNight",
        label: "Late Night Window",
        getValue: (d) => d?.lateNightWindow ?? "N/A",
        getSub: (d) => `STATUS: ${d?.lateNightStatus ?? "Unknown"}`,
        subColor: (d) => (d?.lateNightStatus === "CRITICAL WINDOW" ? "text-[#FF6A00]" : "text-text-muted"),
        icon: "🌙",
        glowColor: "rgba(99,102,241,0.12)",
    },
    {
        key: "volatility",
        label: "Impulse Volatility",
        getValue: (d) => d?.volatility ?? "Low",
        getSub: (d) => `● ${d?.volatilityTrend ?? "Stable pattern"}`,
        subColor: () => "text-emerald-400",
        icon: "📊",
        glowColor: "rgba(56,230,162,0.10)",
    },
];

export default function ImpulseMetrics({ data }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {CARDS.map((card, index) => (
                <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative rounded-2xl border border-white/[0.08] bg-[#12141A] p-5 overflow-hidden group hover:-translate-y-[2px] transition-all duration-300 transform-gpu"
                    style={{ boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 30px ${card.glowColor}` }}
                >
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                            {card.label}
                        </p>
                        <span className="text-sm">{card.icon}</span>
                    </div>

                    <div className="flex items-baseline gap-1.5 mb-1">
                        <p className="text-2xl font-bold tracking-tight">
                            {card.getValue(data)}
                        </p>
                        {card.suffix && (
                            <span className="text-sm text-text-muted font-medium">{card.suffix}</span>
                        )}
                    </div>

                    <p className={`text-[11px] mt-1 ${card.subColor(data)}`}>
                        {card.getSub(data)}
                    </p>
                </motion.div>
            ))}
        </div>
    );
}
