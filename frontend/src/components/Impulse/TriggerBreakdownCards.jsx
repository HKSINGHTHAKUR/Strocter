import { motion } from "framer-motion";

const CARDS = [
    {
        key: "topTrigger",
        label: "Top Trigger Category",
        getValue: (d) => d?.topTriggerCategory ?? "N/A",
        getSub: (d) => d?.topTriggerDetail ?? "",
        icon: "🔥",
        iconBg: "bg-[#FF6A00]/15",
    },
    {
        key: "peakVuln",
        label: "Peak Vulnerability",
        getValue: (d) => d?.peakVulnerability ?? "N/A",
        getSub: (d) => d?.peakVulnerabilityContext ?? "",
        icon: "⏰",
        iconBg: "bg-[#6E33B1]/15",
    },
    {
        key: "emotionalPattern",
        label: "Emotional Pattern",
        getValue: (d) => d?.emotionalPattern ?? "Neutral",
        getSub: (d) => d?.emotionalCorrelation ?? "",
        icon: "💜",
        iconBg: "bg-[#6E33B1]/15",
    },
    {
        key: "intensity",
        label: "Intensity Index",
        getValue: (d) => d?.intensityIndex ?? "Low",
        getSub: (d) => `Avg. $${d?.intensityAvg?.toLocaleString() ?? 0} / event`,
        icon: "📈",
        iconBg: "bg-emerald-500/15",
    },
];

export default function TriggerBreakdownCards({ data }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CARDS.map((card, index) => (
                <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.07 }}
                    className="rounded-2xl border border-white/[0.08] bg-[#12141A] p-5 group hover:-translate-y-[2px] transition-all duration-300"
                >
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-text-muted mb-3">
                        {card.label}
                    </p>
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center text-sm flex-shrink-0`}>
                            {card.icon}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold truncate">
                                {card.getValue(data)}
                            </p>
                            <p className="text-[10px] text-text-muted truncate">
                                {card.getSub(data)}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
