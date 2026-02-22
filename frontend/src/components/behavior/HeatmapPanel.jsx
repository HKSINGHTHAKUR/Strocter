import { motion } from "framer-motion";

const HOURS = [
    "12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM",
    "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM",
];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const INTENSITY_COLORS = [
    "bg-white/[0.03]", "bg-emerald-900/40", "bg-emerald-700/50",
    "bg-emerald-500/60", "bg-[#ec5b13]/50", "bg-[#ec5b13]/70",
];

export default function HeatmapPanel({ heatmapData, insight }) {
    if (!heatmapData) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl border border-white/[0.08] bg-[#12141A] p-6 h-full"
        >
            <div className="flex items-start justify-between mb-1">
                <div>
                    <h3 className="text-sm font-semibold">24-Hour Behavioral Heatmap</h3>
                    <p className="text-[10px] text-text-muted mt-0.5">Identifying cognitive triggers based on time-of-day activity</p>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ec5b13]" />Impulse</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />Routine</span>
                </div>
            </div>

            <div className="mt-4 overflow-x-auto">
                <div className="min-w-[480px]">
                    <div className="flex ml-10 mb-1">
                        {HOURS.filter((_, i) => i % 6 === 0).map((h) => (
                            <span key={h} className="text-[9px] text-text-muted" style={{ width: `${(6 / 24) * 100}%` }}>{h}</span>
                        ))}
                    </div>
                    {DAYS.map((day, dayIdx) => (
                        <div key={day} className="flex items-center gap-1 mb-[3px]">
                            <span className="text-[9px] text-text-muted w-8 text-right pr-2 flex-shrink-0">{day}</span>
                            <div className="flex gap-[2px] flex-1">
                                {(heatmapData[dayIdx] || []).map((intensity, hourIdx) => (
                                    <motion.div
                                        key={hourIdx}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.2, delay: 0.4 + dayIdx * 0.04 + hourIdx * 0.01 }}
                                        className={`flex-1 aspect-square rounded-[3px] ${INTENSITY_COLORS[intensity] || INTENSITY_COLORS[0]} transition-colors duration-200 hover:ring-1 hover:ring-white/20`}
                                        title={`${day} ${HOURS[hourIdx]} — Intensity: ${intensity}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {insight && (
                <div className="mt-5 flex items-start gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="w-2 h-2 rounded-full bg-[#6E33B1] mt-1 flex-shrink-0" />
                    <p className="text-[11px] text-text-muted leading-relaxed">{insight}</p>
                </div>
            )}
        </motion.div>
    );
}
