import { motion } from "framer-motion";

const METRICS = [
    {
        key: "stability",
        label: "Stability Index",
        getValue: (d) => d?.stabilityIndex ?? 0,
        suffix: "/100",
        getSub: (d) => `↗ +${Math.abs(d?.stabilityMom ?? 0)}% MoM`,
        subColor: (d) => (d?.stabilityMom >= 0 ? "text-emerald-400" : "text-red-400"),
        glowColor: "rgba(56,230,162,0.12)",
    },
    {
        key: "risk",
        label: "Risk Exposure",
        getValue: (d) => d?.riskExposure ?? "LOW",
        getSub: (d) => `🛡 ${d?.riskDetail ?? ""}`,
        subColor: () => "text-emerald-400",
        glowColor: "rgba(255,106,0,0.10)",
    },
    {
        key: "savings",
        label: "Savings Growth",
        getValue: (d) => `+${d?.savingsGrowth ?? 0}%`,
        getSub: (d) => `↗ ${d?.savingsBenchmark ?? ""}`,
        subColor: (d) => (d?.savingsGrowth > 10 ? "text-emerald-400" : "text-[#FF6A00]"),
        glowColor: "rgba(56,230,162,0.15)",
    },
    {
        key: "buffer",
        label: "Financial Buffer",
        getValue: (d) => d?.financialBuffer ?? 0,
        suffix: " Months",
        getSub: (d) => `📊 ${d?.bufferStatus ?? ""}`,
        subColor: () => "text-text-muted",
        glowColor: "rgba(110,51,177,0.10)",
    },
];

export default function StabilityMetricsRow({ data }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {METRICS.map((m, index) => (
                <motion.div
                    key={m.key}
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative rounded-2xl border border-white/[0.06] bg-[#12141A] p-5 overflow-hidden group hover:-translate-y-[2px] transition-all duration-300 transform-gpu"
                    style={{ boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 30px ${m.glowColor}` }}
                >
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

                    <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-2">
                        {m.label}
                    </p>
                    <div className="flex items-baseline gap-1 mb-1">
                        <p className="text-2xl font-bold tracking-tight">{m.getValue(data)}</p>
                        {m.suffix && <span className="text-sm text-text-muted font-medium">{m.suffix}</span>}
                    </div>
                    <p className={`text-[11px] mt-1 ${m.subColor(data)}`}>{m.getSub(data)}</p>
                </motion.div>
            ))}
        </div>
    );
}
