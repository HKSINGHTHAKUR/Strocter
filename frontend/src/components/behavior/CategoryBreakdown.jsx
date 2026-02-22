import { motion } from "framer-motion";

const CATEGORIES = [
    { category: "Luxury & Lifestyle", emotional: 82, logical: 18 },
    { category: "Utilities & Rent", emotional: 2, logical: 98 },
    { category: "Tech & Gadgets", emotional: 45, logical: 55 },
    { category: "Dining & Entertainment", emotional: 68, logical: 32 },
];

function getLabel(emotional, logical) {
    if (emotional >= 70) return { text: `Emotional: ${emotional}%`, color: "text-[#6E33B1]" };
    if (logical >= 70) return { text: `Logical: ${logical}%`, color: "text-emerald-400" };
    return { text: `Split: ${emotional}% / ${logical}%`, color: "text-text-muted" };
}

export default function CategoryBreakdown() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="rounded-2xl border border-white/[0.08] bg-[#12141A] p-6"
        >
            {/* Header */}
            <h3 className="text-sm font-semibold mb-5">
                Category Psychological Breakdown
            </h3>

            {/* Bars */}
            <div className="space-y-5">
                {CATEGORIES.map((cat, index) => {
                    const label = getLabel(cat.emotional, cat.logical);
                    return (
                        <div key={cat.category}>
                            {/* Label row */}
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold">
                                    {cat.category}
                                </span>
                                <span className={`text-[11px] font-medium ${label.color}`}>
                                    {label.text}
                                </span>
                            </div>

                            {/* Stacked bar */}
                            <div className="flex h-2 rounded-full overflow-hidden bg-white/[0.04]">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${cat.emotional}%` }}
                                    transition={{
                                        duration: 0.7,
                                        delay: 0.5 + index * 0.1,
                                        ease: "easeOut",
                                    }}
                                    className="h-full bg-[#6E33B1] rounded-l-full"
                                />
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${cat.logical}%` }}
                                    transition={{
                                        duration: 0.7,
                                        delay: 0.6 + index * 0.1,
                                        ease: "easeOut",
                                    }}
                                    className="h-full bg-emerald-500 rounded-r-full"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 text-[10px] text-text-muted uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#6E33B1]" />
                    Emotional Segment
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Logical Segment
                </span>
            </div>
        </motion.div>
    );
}
